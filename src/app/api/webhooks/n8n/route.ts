import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-n8n-secret')
  const expectedSecret = process.env.N8N_WEBHOOK_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { ticketId, automationRunId, result, status, error: automationError } = body

    if (!ticketId) {
      return NextResponse.json({ error: 'Missing ticketId' }, { status: 400 })
    }

    // Update AutomationRun if ID provided
    if (automationRunId) {
      try {
        // @ts-ignore
        await prisma.automationRun.update({
          where: { id: automationRunId },
          data: {
            status: status ?? (automationError ? 'FAILED' : 'COMPLETED'),
            result: result ? JSON.stringify(result) : null,
            error: automationError ?? null,
            completedAt: new Date(),
          },
        })
      } catch (runError) {
        console.error('Failed to update AutomationRun:', runError)
      }
    }

    // Update ticket if result contains ticket updates
    if (result?.ticketUpdate) {
      try {
        // @ts-ignore
        await prisma.ticket.update({
          where: { id: ticketId },
          data: result.ticketUpdate,
        })
      } catch (ticketError) {
        console.error('Failed to update ticket from n8n webhook:', ticketError)
      }
    }

    return NextResponse.json({ received: true, ticketId })
  } catch (error) {
    console.error('Error processing n8n webhook:', error)
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 })
  }
}
