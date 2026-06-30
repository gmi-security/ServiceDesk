import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // @ts-ignore
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: { company: true, contact: true, catalogItem: true },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Call AI triage service
    let triageResult: Record<string, unknown> = {}
    try {
      const { triageTicket } = await import('@/lib/ai')
      triageResult = await triageTicket(params.id)
    } catch (aiError) {
      console.error('AI triage error:', aiError)
      triageResult = {
        priority: ticket.priority,
        category: 'UNKNOWN',
        suggestedAssignee: null,
        confidence: 0,
        reasoning: 'AI service unavailable',
        mock: true,
      }
    }

    // Log AI decision
    try {
      // @ts-ignore
      await prisma.aIDecisionLog.create({
        data: {
          ticketId: params.id,
          decisionType: 'TRIAGE',
          input: JSON.stringify({ title: ticket.title, description: ticket.description }),
          output: JSON.stringify(triageResult),
          confidence: (triageResult.confidence as number) ?? 0,
          // @ts-ignore
          triggeredBy: session.user?.id,
        },
      })
    } catch (logError) {
      console.error('Failed to log AI decision:', logError)
    }

    // Apply AI recommendations to ticket
    const updateData: Record<string, unknown> = {}
    if (triageResult.priority && !triageResult.mock) {
      updateData.priority = triageResult.priority
    }
    if (triageResult.suggestedAssignee) {
      updateData.assignedUserId = triageResult.suggestedAssignee
    }

    if (Object.keys(updateData).length > 0) {
      try {
        // @ts-ignore
        await prisma.ticket.update({
          where: { id: params.id },
          data: updateData,
        })
      } catch (updateError) {
        console.error('Failed to update ticket with triage result:', updateError)
      }
    }

    return NextResponse.json({ ticketId: params.id, triage: triageResult })
  } catch (error) {
    console.error('Error during triage:', error)
    return NextResponse.json({ error: 'Failed to perform triage' }, { status: 500 })
  }
}
