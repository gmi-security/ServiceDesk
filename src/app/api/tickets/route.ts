import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createTicketSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  status: z.enum(['NEW', 'OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED']).default('NEW'),
  boardId: z.string().optional(),
  assignedUserId: z.string().optional(),
  companyId: z.string().optional(),
  contactId: z.string().optional(),
  catalogItemId: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

async function generateTicketNumber(): Promise<string> {
  // @ts-ignore
  const count = await prisma.ticket.count()
  return `TKT-${String(count + 1).padStart(5, '0')}`
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const boardId = searchParams.get('boardId')
  const assignedUserId = searchParams.get('assignedUserId')
  const companyId = searchParams.get('companyId')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '25')
  const skip = (page - 1) * limit

  try {
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (boardId) where.boardId = boardId
    if (assignedUserId) where.assignedUserId = assignedUserId
    if (companyId) where.companyId = companyId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ticketNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    // @ts-ignore
    const [tickets, total] = await Promise.all([
      // @ts-ignore
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: true,
          contact: true,
          assignedUser: { select: { id: true, name: true, email: true } },
          board: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      // @ts-ignore
      prisma.ticket.count({ where }),
    ])

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error listing tickets:', error)
    return NextResponse.json({ error: 'Failed to list tickets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const validated = createTicketSchema.parse(body)
    const ticketNumber = await generateTicketNumber()

    // @ts-ignore
    const ticket = await prisma.ticket.create({
      data: {
        ...validated,
        ticketNumber,
        // @ts-ignore
        requesterId: session.user?.id,
      },
      include: {
        company: true,
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true } },
        board: true,
      },
    })

    // Create audit log
    try {
      // @ts-ignore
      await prisma.auditLog.create({
        data: {
          ticketId: ticket.id,
          // @ts-ignore
          userId: session.user?.id,
          action: 'TICKET_CREATED',
          changes: JSON.stringify({ ticketNumber, status: validated.status }),
        },
      })
    } catch (auditError) {
      console.error('Failed to create audit log:', auditError)
    }

    // Trigger AI triage asynchronously
    try {
      const { triageTicket } = await import('@/lib/ai')
      triageTicket(ticket.id).catch((err: Error) => console.error('AI triage failed:', err))
    } catch (aiError) {
      console.error('AI triage import failed:', aiError)
    }

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}
