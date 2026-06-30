import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // @ts-ignore
    const boards = await prisma.board.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    // Get ticket counts per status per board
    const boardsWithStatusCounts = await Promise.all(
      boards.map(async (board: Record<string, unknown>) => {
        // @ts-ignore
        const statusCounts = await prisma.ticket.groupBy({
          by: ['status'],
          where: { boardId: board.id as string },
          _count: { status: true },
        })
        return {
          ...board,
          ticketsByStatus: statusCounts.map((s: { status: string; _count: { status: number } }) => ({
            status: s.status,
            count: s._count.status,
          })),
        }
      })
    )

    return NextResponse.json(boardsWithStatusCounts)
  } catch (error) {
    console.error('Error listing boards:', error)
    return NextResponse.json({ error: 'Failed to list boards' }, { status: 500 })
  }
}
