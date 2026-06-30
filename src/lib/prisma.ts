import { PrismaClient } from '@prisma/client'

// ============================================
// Prisma Client Singleton
// Prevents multiple PrismaClient instances in
// Next.js development (hot module replacement
// creates new module instances on each reload).
// ============================================

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
