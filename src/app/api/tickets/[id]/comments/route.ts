import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createCommentSchema = z.object({
  content: z.string().min(1),
  isInternal: z.boolean().default(false),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // @ts-ignore
    const comments = await prisma.comment.findMany({
      where: { ticketId: params.id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const validated = createCommentSchema.parse(body)

    // @ts-ignore
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: { assignedUser: true },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // @ts-ignore
    const comment = await prisma.comment.create({
      data: {
        ticketId: params.id,
        // @ts-ignore
        userId: session.user?.id,
        content: validated.content,
        isInternal: validated.isInternal,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    // Create notifications
    try {
      // @ts-ignore
      const currentUserId = session.user?.id
      if (!validated.isInternal && ticket.assignedUser && ticket.assignedUser.id !== currentUserId) {
        // Notify assignee of public comment
        // @ts-ignore
        await prisma.notification.create({
          data: {
            userId: ticket.assignedUser.id,
            type: 'NEW_COMMENT',
            title: `New comment on ticket ${ticket.ticketNumber}`,
            body: validated.content.slice(0, 200),
            ticketId: params.id,
          },
        })
      } else if (validated.isInternal) {
        // Notify admins/techs of internal note — find users with admin or tech role
        // @ts-ignore
        const staffUsers = await prisma.user.findMany({
          where: {
            role: { in: ['ADMIN', 'TECHNICIAN'] },
            id: { not: currentUserId },
            isActive: true,
          },
          select: { id: true },
        })
        // @ts-ignore
        await prisma.notification.createMany({
          data: staffUsers.map((u: { id: string }) => ({
            userId: u.id,
            type: 'INTERNAL_NOTE',
            title: `Internal note on ticket ${ticket.ticketNumber}`,
            body: validated.content.slice(0, 200),
            ticketId: params.id,
          })),
        })
      }
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
