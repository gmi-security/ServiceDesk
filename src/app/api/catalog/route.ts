import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    const where: Record<string, unknown> = { isActive: true }
    if (category) where.category = category

    // @ts-ignore
    const items = await prisma.serviceCatalogItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error listing catalog items:', error)
    return NextResponse.json({ error: 'Failed to list catalog items' }, { status: 500 })
  }
}
