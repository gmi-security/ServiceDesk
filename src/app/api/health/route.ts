import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  let dbStatus: 'ok' | 'error' = 'ok'
  let aiStatus: 'ok' | 'mock' | 'error' = 'mock'

  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    dbStatus = 'error'
  }

  if (process.env.OPENAI_API_KEY) {
    aiStatus = 'ok'
  } else {
    aiStatus = 'mock'
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    services: {
      database: dbStatus,
      ai: aiStatus,
    },
  })
}
