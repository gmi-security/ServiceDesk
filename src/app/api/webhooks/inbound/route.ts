import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Basic spam/blocklist check
function isSpam(subject: string, body: string): boolean {
  const spamKeywords = ['unsubscribe', 'out of office', 'auto-reply', 'automatic reply', 'delivery failed', 'mailer-daemon']
  const combined = `${subject} ${body}`.toLowerCase()
  return spamKeywords.some(kw => combined.includes(kw))
}

async function getOrCreateContactByEmail(email: string, name?: string) {
  if (!email) return null
  // @ts-ignore
  let contact = await prisma.contact.findFirst({ where: { email } })
  if (!contact) {
    // @ts-ignore
    contact = await prisma.contact.create({
      data: { email, name: name ?? email.split('@')[0] },
    })
  }
  return contact
}

async function generateTicketNumber(): Promise<string> {
  // @ts-ignore
  const count = await prisma.ticket.count()
  return `TKT-${String(count + 1).padStart(5, '0')}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      from,
      fromName,
      subject,
      text,
      html,
      companyId,
    } = body

    if (!from) {
      return NextResponse.json({ error: 'Missing sender email' }, { status: 400 })
    }

    const emailBody = text ?? (html ? html.replace(/<[^>]*>/g, ' ') : '')

    if (isSpam(subject ?? '', emailBody)) {
      return NextResponse.json({ filtered: true, reason: 'spam' })
    }

    const contact = await getOrCreateContactByEmail(from, fromName)
    const ticketNumber = await generateTicketNumber()

    // @ts-ignore
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title: subject ?? `Inbound email from ${from}`,
        description: emailBody,
        status: 'NEW',
        priority: 'MEDIUM',
        contactId: contact?.id ?? null,
        companyId: companyId ?? contact?.companyId ?? null,
        source: 'EMAIL',
      },
    })

    try {
      // @ts-ignore
      await prisma.auditLog.create({
        data: {
          ticketId: ticket.id,
          action: 'TICKET_CREATED_VIA_EMAIL',
          changes: JSON.stringify({ from, subject }),
        },
      })
    } catch (e) {
      console.error('Audit log failed:', e)
    }

    // Trigger AI triage
    try {
      const { triageTicket } = await import('@/lib/ai')
      triageTicket(ticket.id).catch((err: Error) => console.error('AI triage error:', err))
    } catch (e) {
      console.error('AI import failed:', e)
    }

    return NextResponse.json({ ticketId: ticket.id, ticketNumber: ticket.ticketNumber }, { status: 201 })
  } catch (error) {
    console.error('Error processing inbound webhook:', error)
    return NextResponse.json({ error: 'Failed to process inbound message' }, { status: 500 })
  }
}
