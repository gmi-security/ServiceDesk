import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const updateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // @ts-ignore
    const article = await prisma.knowledgeArticle.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true } },
      },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Increment view count
    // @ts-ignore
    prisma.knowledgeArticle.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    }).catch((err: Error) => console.error('Failed to increment view count:', err))

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
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
    const validated = updateArticleSchema.parse(body)

    // @ts-ignore
    const article = await prisma.knowledgeArticle.update({
      where: { id: params.id },
      data: { ...validated, updatedAt: new Date() },
      include: {
        author: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}
