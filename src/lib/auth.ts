import NextAuth from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: { scope: 'openid profile email User.Read' },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true, role: true, isActive: true },
          })
          if (dbUser) {
            token.userId = dbUser.id
            token.role = dbUser.role
            token.isActive = dbUser.isActive
          } else {
            const newUser = await prisma.user.create({
              data: { email: user.email!, name: user.name ?? '', role: 'TECH', isActive: true },
            })
            token.userId = newUser.id
            token.role = newUser.role
            token.isActive = true
          }
        } catch {
          token.role = 'TECH'
          token.isActive = true
        }
      }
      if (account?.access_token) token.accessToken = account.access_token
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) ?? token.sub ?? ''
        session.user.role = (token.role as string) ?? 'TECH'
        session.user.isActive = (token.isActive as boolean) ?? true
      }
      return session
    },

    async signIn({ user }) {
      if (!user.email) return false
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { isActive: true },
        })
        if (dbUser && !dbUser.isActive) return '/auth/signin?error=AccountDisabled'
      } catch { /* allow */ }
      return true
    },
  },

  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
      role: string
      isActive: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    role?: string
    isActive?: boolean
    accessToken?: string
  }
}
