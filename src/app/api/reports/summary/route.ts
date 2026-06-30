import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const [
      totalTickets,
      openTickets,
      resolvedToday,
      ticketsByStatus,
      ticketsByPriority,
      ticketsByBoard,
      resolvedTickets,
    ] = await Promise.all([
      // @ts-ignore
      prisma.ticket.count(),
      // @ts-ignore
      prisma.ticket.count({
        where: { status: { notIn: ['RESOLVED', 'CLOSED'] } },
      }),
      // @ts-ignore
      prisma.ticket.count({
        where: {
          status: 'RESOLVED',
          resolvedAt: { gte: todayStart, lte: todayEnd },
        },
      }),
      // @ts-ignore
      prisma.ticket.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      // @ts-ignore
      prisma.ticket.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),
      // @ts-ignore
      prisma.ticket.groupBy({
        by: ['boardId'],
        _count: { boardId: true },
        where: { boardId: { not: null } },
      }),
      // @ts-ignore
      prisma.ticket.findMany({
        where: { status: 'RESOLVED', resolvedAt: { not: null }, createdAt: { not: null } },
        select: { createdAt: true, resolvedAt: true, slaDeadline: true },
      }),
    ])

    // Calculate average resolution hours
    let avgResolutionHours = 0
    let slaCompliantCount = 0
    if (resolvedTickets.length > 0) {
      const totalHours = resolvedTickets.reduce((sum: number, t: { createdAt: Date; resolvedAt: Date | null; slaDeadline: Date | null }) => {
        if (!t.resolvedAt) return sum
        const hours = (new Date(t.resolvedAt).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60)
        return sum + hours
      }, 0)
      avgResolutionHours = Math.round((totalHours / resolvedTickets.length) * 10) / 10

      slaCompliantCount = resolvedTickets.filter((t: { createdAt: Date; resolvedAt: Date | null; slaDeadline: Date | null }) => {
        if (!t.resolvedAt || !t.slaDeadline) return true
        return new Date(t.resolvedAt) <= new Date(t.slaDeadline)
      }).length
    }

    const slaCompliance = resolvedTickets.length > 0
      ? Math.round((slaCompliantCount / resolvedTickets.length) * 100)
      : 100

    // Enrich ticketsByBoard with board names
    const boardIds = ticketsByBoard
      .map((b: { boardId: string | null }) => b.boardId)
      .filter(Boolean) as string[]
    // @ts-ignore
    const boards = await prisma.board.findMany({
      where: { id: { in: boardIds } },
      select: { id: true, name: true },
    })
    const boardMap = new Map(boards.map((b: { id: string; name: string }) => [b.id, b.name]))

    const ticketsByBoardResult = ticketsByBoard.map((b: { boardId: string | null; _count: { boardId: number } }) => ({
      board: boardMap.get(b.boardId as string) ?? b.boardId,
      count: b._count.boardId,
    }))

    // Technician metrics
    // @ts-ignore
    const technicianAssigned = await prisma.ticket.groupBy({
      by: ['assignedUserId'],
      _count: { assignedUserId: true },
      where: { assignedUserId: { not: null } },
    })
    // @ts-ignore
    const technicianResolved = await prisma.ticket.groupBy({
      by: ['assignedUserId'],
      _count: { assignedUserId: true },
      where: { assignedUserId: { not: null }, status: 'RESOLVED' },
    })

    const techIds = technicianAssigned
      .map((t: { assignedUserId: string | null }) => t.assignedUserId)
      .filter(Boolean) as string[]
    // @ts-ignore
    const techUsers = await prisma.user.findMany({
      where: { id: { in: techIds } },
      select: { id: true, name: true },
    })

    const resolvedByTech = new Map(
      technicianResolved.map((t: { assignedUserId: string | null; _count: { assignedUserId: number } }) => [t.assignedUserId, t._count.assignedUserId])
    )

    const technicianMetrics = techUsers.map((u: { id: string; name: string }) => ({
      name: u.name,
      assigned: technicianAssigned.find((t: { assignedUserId: string | null }) => t.assignedUserId === u.id)?._count?.assignedUserId ?? 0,
      resolved: resolvedByTech.get(u.id) ?? 0,
    }))

    return NextResponse.json({
      totalTickets,
      openTickets,
      resolvedToday,
      slaCompliance,
      avgResolutionHours,
      ticketsByBoard: ticketsByBoardResult,
      ticketsByStatus: ticketsByStatus.map((s: { status: string; _count: { status: number } }) => ({
        status: s.status,
        count: s._count.status,
      })),
      ticketsByPriority: ticketsByPriority.map((p: { priority: string; _count: { priority: number } }) => ({
        priority: p.priority,
        count: p._count.priority,
      })),
      technicianMetrics,
    })
  } catch (error) {
    console.error('Error generating summary report:', error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
