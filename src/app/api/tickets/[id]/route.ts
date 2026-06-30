import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const updateTicketSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['NEW', 'OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED']).optional(),
  boardId: z.string().optional(),
  assignedUserId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  slaDeadline: z.string().datetime().optional().nullable(),
  resolvedAt: z.string().datetime().optional().nullable(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // @ts-ignore
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        company: true,
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true, role: true } },
        requester: { select: { id: true, name: true, email: true } },
        board: true,
        catalogItem: true,
        comments: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'asc' },
        },
        auditLogs: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        approvals: {
          include: { approver: { select: { id: true, name: true, email: true } } },
        },
        attachments: true,
        linkedAssets: true,
        aiDecisionLogs: { orderBy: { createdAt: 'desc' } },
        automationRuns: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const validated = updateTicketSchema.parse(body)

    // @ts-ignore
    const existing = await prisma.ticket.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = { ...validated }
    if (validated.status === 'RESOLVED' && !validated.resolvedAt) {
      updateData.resolvedAt = new Date().toISOString()
    }

    // @ts-ignore
    const ticket = await prisma.ticket.update({
      where: { id: params.id },
      data: updateData,
      include: {
        company: true,
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true } },
        board: true,
      },
    })

    // Track changes for audit log
    const changes: Record<string, unknown> = {}
    for (const key of Object.keys(validated) as Array<keyof typeof validated>) {
      // @ts-ignore
      if (validated[key] !== undefined && validated[key] !== existing[key]) {
        // @ts-ignore
        changes[key] = { from: existing[key], to: validated[key] }
      }
    }

    if (Object.keys(changes).length > 0) {
      try {
        // @ts-ignore
        await prisma.auditLog.create({
          data: {
            ticketId: params.id,
            // @ts-ignore
            userId: session.user?.id,
            action: validated.status ? 'STATUS_CHANGED' : 'TICKET_UPDATED',
            changes: JSON.stringify(changes),
          },
        })
      } catch (auditError) {
        console.error('Failed to create audit log:', auditError)
      }
    }

    return NextResponse.json(ticket)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Error updating ticket:', error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // @ts-ignore
    const existing = await prisma.ticket.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Soft delete - set status to CLOSED
    // @ts-ignore
    await prisma.ticket.update({
      where: { id: params.id },
      data: { status: 'CLOSED' },
    })

    try {
      // @ts-ignore
      await prisma.auditLog.create({
        data: {
          ticketId: params.id,
          // @ts-ignore
          userId: session.user?.id,
          action: 'TICKET_CLOSED',
          changes: JSON.stringify({ status: { from: existing.status, to: 'CLOSED' } }),
        },
      })
    } catch (auditError) {
      console.error('Failed to create audit log:', auditError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error closing ticket:', error)
    return NextResponse.json({ error: 'Failed to close ticket' }, { status: 500 })
  }
}
