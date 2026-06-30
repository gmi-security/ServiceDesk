import NextAuth from 'next-auth'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import type { NextAuthConfig } from 'next-auth'

// ============================================
// NextAuth v5 Configuration
// Provider: Microsoft Entra ID (Azure AD)
// Adapter:  Prisma
// Strategy: JWT
// ============================================

export const authConfig: NextAuthConfig = {
  // Use Prisma adapter for database persistence
  adapter: PrismaAdapter(prisma),

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout',
  },

  // Session strategy
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // Refresh token every 24h
  },

  // Providers
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: 'openid profile email User.Read',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email ?? profile.preferred_username,
          image: null,
          role: 'TECHNICIAN', // Default role; updated post-login via DB lookup
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign-in, persist user data to token
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image

        // Fetch role from database
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
            // First-time user — create record
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name ?? '',
                role: 'TECHNICIAN',
                isActive: true,
              },
            })
            token.userId = newUser.id
            token.role = newUser.role
            token.isActive = true
          }
        } catch (err) {
          console.error('[auth] Failed to load user from DB:', err)
          token.role = 'TECHNICIAN'
          token.isActive = true
        }
      }

      // Store Azure AD access token for Graph API calls if needed
      if (account?.access_token) {
        token.accessToken = account.access_token
      }

      return token
    },

    async session({ session, token }) {
      // Expose userId and role to the client-side session
      if (session.user) {
        session.user.id = (token.userId as string) ?? token.sub ?? ''
        session.user.role = (token.role as string) ?? 'TECHNICIAN'
        session.user.isActive = (token.isActive as boolean) ?? true
      }
      return session
    },

    async signIn({ user, account }) {
      // Block inactive users
      if (!user.email) return false

      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { isActive: true },
        })

        // New users are allowed in; existing inactive users are blocked
        if (dbUser && !dbUser.isActive) {
          return '/auth/signin?error=AccountDisabled'
        }
      } catch (err) {
        console.error('[auth] signIn callback error:', err)
      }

      return true
    },
  },

  // Debug in development
  debug: process.env.NODE_ENV === 'development',
}

// Export NextAuth handler and helpers
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// ============================================
// Type augmentation for session user
// ============================================

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

  interface User {
    role?: string
    isActive?: boolean
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
