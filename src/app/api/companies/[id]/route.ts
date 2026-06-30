import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  domain: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  slaLevel: z.enum(['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE']).optional(),
  notes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // @ts-ignore
    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        contacts: { orderBy: { name: 'asc' } },
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            assignedUser: { select: { id: true, name: true } },
            board: true,
          },
        },
        assets: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
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
    const validated = updateCompanySchema.parse(body)

    // @ts-ignore
    const company = await prisma.company.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(company)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Error updating company:', error)
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }
}
