import type { Metadata, Viewport } from 'next'
import './globals.css'
import NetworkBackground from '@/components/NetworkBackground'

export const metadata: Metadata = {
  title: {
    default: 'GMI ServiceOS',
    template: '%s | GMI ServiceOS',
  },
  description: 'AI-native service desk platform — manage tickets, automate triage, and deliver exceptional IT support.',
  keywords: ['ITSM', 'service desk', 'IT support', 'helpdesk', 'ticket management', 'AI triage'],
  authors: [{ name: 'GMI' }],
  creator: 'GMI',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'GMI ServiceOS',
    description: 'AI-native service desk platform',
    siteName: 'GMI ServiceOS',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f1117',
  colorScheme: 'dark',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="min-h-screen antialiased"
        style={{
          backgroundColor: 'var(--color-bg-base)',
          color: 'var(--color-text-primary)',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      >
        <NetworkBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
