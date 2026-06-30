import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')

  try {
    const where: Record<string, unknown> = { isPublished: true }
    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    // @ts-ignore
    const articles = await prisma.knowledgeArticle.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error listing knowledge articles:', error)
    return NextResponse.json({ error: 'Failed to list articles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only admin/tech can create articles
  // @ts-ignore
  const userRole = session.user?.role
  if (!['ADMIN', 'TECHNICIAN'].includes(userRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const validated = createArticleSchema.parse(body)

    // @ts-ignore
    const article = await prisma.knowledgeArticle.create({
      data: {
        ...validated,
        // @ts-ignore
        authorId: session.user?.id,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
