import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const updateUserSchema = z.object({
  role: z.enum(['ADMIN', 'TECHNICIAN', 'AGENT', 'CLIENT']).optional(),
  isActive: z.boolean().optional(),
  name: z.string().min(1).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Admin only
  // @ts-ignore
  if (session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const validated = updateUserSchema.parse(body)

    // @ts-ignore
    const user = await prisma.user.update({
      where: { id: params.id },
      data: validated,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        company: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
