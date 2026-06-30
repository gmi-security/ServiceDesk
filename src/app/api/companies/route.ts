import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createCompanySchema = z.object({
  name: z.string().min(1),
  domain: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  slaLevel: z.enum(['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE']).default('STANDARD'),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // @ts-ignore
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: {
            contacts: true,
            tickets: { where: { status: { notIn: ['RESOLVED', 'CLOSED'] } } },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error listing companies:', error)
    return NextResponse.json({ error: 'Failed to list companies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const validated = createCompanySchema.parse(body)

    // @ts-ignore
    const company = await prisma.company.create({ data: validated })
    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Error creating company:', error)
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}
