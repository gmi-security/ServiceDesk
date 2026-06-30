import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const approvalSchema = z.object({
  action: z.enum(['request', 'approve', 'reject']),
  reason: z.string().optional(),
  approverId: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const validated = approvalSchema.parse(body)

    // @ts-ignore
    const ticket = await prisma.ticket.findUnique({ where: { id: params.id } })
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    if (validated.action === 'request') {
      // Create an approval request
      // @ts-ignore
      const approval = await prisma.approval.create({
        data: {
          ticketId: params.id,
          approverId: validated.approverId ?? null,
          status: 'PENDING',
          reason: validated.reason ?? null,
          // @ts-ignore
          requestedById: session.user?.id,
        },
        include: {
          approver: { select: { id: true, name: true, email: true } },
        },
      })

      // Update ticket status to PENDING
      // @ts-ignore
      await prisma.ticket.update({
        where: { id: params.id },
        data: { status: 'PENDING' },
      })

      // Audit log
      try {
        // @ts-ignore
        await prisma.auditLog.create({
          data: {
            ticketId: params.id,
            // @ts-ignore
            userId: session.user?.id,
            action: 'APPROVAL_REQUESTED',
            changes: JSON.stringify({ approverId: validated.approverId }),
          },
        })
      } catch (e) {
        console.error('Audit log failed:', e)
      }

      return NextResponse.json(approval, { status: 201 })
    }

    if (validated.action === 'approve' || validated.action === 'reject') {
      // Find the pending approval for this ticket
      // @ts-ignore
      const approval = await prisma.approval.findFirst({
        where: { ticketId: params.id, status: 'PENDING' },
      })

      if (!approval) {
        return NextResponse.json({ error: 'No pending approval found' }, { status: 404 })
      }

      const newApprovalStatus = validated.action === 'approve' ? 'APPROVED' : 'REJECTED'
      const newTicketStatus = validated.action === 'approve' ? 'OPEN' : 'CLOSED'

      // @ts-ignore
      const [updatedApproval] = await Promise.all([
        // @ts-ignore
        prisma.approval.update({
          where: { id: approval.id },
          data: {
            status: newApprovalStatus,
            reason: validated.reason ?? null,
            respondedAt: new Date(),
            // @ts-ignore
            respondedById: session.user?.id,
          },
          include: {
            approver: { select: { id: true, name: true, email: true } },
          },
        }),
        // @ts-ignore
        prisma.ticket.update({
          where: { id: params.id },
          data: { status: newTicketStatus },
        }),
      ])

      try {
        // @ts-ignore
        await prisma.auditLog.create({
          data: {
            ticketId: params.id,
            // @ts-ignore
            userId: session.user?.id,
            action: validated.action === 'approve' ? 'APPROVAL_APPROVED' : 'APPROVAL_REJECTED',
            changes: JSON.stringify({ reason: validated.reason }),
          },
        })
      } catch (e) {
        console.error('Audit log failed:', e)
      }

      return NextResponse.json(updatedApproval)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Error processing approval:', error)
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 })
  }
}
