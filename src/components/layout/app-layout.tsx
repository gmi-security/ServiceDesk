'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import type { ReactNode } from 'react'

// ============================================
// AppLayout
// Authenticated shell: sidebar + top-nav + main.
// Sidebar collapses on desktop via toggle.
// Hidden on mobile behind a slide-in drawer.
// ============================================

export interface AppLayoutProps {
  children: ReactNode
  /** Currently signed-in user — passed to sidebar/top-nav */
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  } | null
  /** Unread notification count for the bell */
  notificationCount?: number
  /** Open ticket count for sidebar badge */
  openTicketCount?: number
  /** Called when user clicks "Sign out" */
  onSignOut?: () => void
}

export function AppLayout({
  children,
  user,
  notificationCount = 0,
  openTicketCount,
  onSignOut,
}: AppLayoutProps) {
  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Desktop sidebar collapsed state — persisted to localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('gmi:sidebarCollapsed') === 'true'
  })

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem('gmi:sidebarCollapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileSidebarOpen])

  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      {/* ==========================================
          Desktop Sidebar
          ========================================== */}
      <div
        className={cn(
          'hidden lg:flex flex-col flex-shrink-0',
          'transition-all duration-200',
          sidebarCollapsed ? 'w-16' : 'w-64',
        )}
      >
        <Sidebar
          user={user}
          openTicketCount={openTicketCount}
          collapsed={sidebarCollapsed}
          className="h-full"
        />
      </div>

      {/* ==========================================
          Mobile Sidebar Overlay
          ========================================== */}
      {mobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer */}
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-64 flex flex-col',
              'lg:hidden',
              'animate-slide-in-right',
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <Sidebar
              user={user}
              openTicketCount={openTicketCount}
              collapsed={false}
              className="h-full"
            />
          </div>
        </>
      )}

      {/* ==========================================
          Main content area
          ========================================== */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top nav */}
        <TopNav
          user={user}
          notificationCount={notificationCount}
          mobileMenuOpen={mobileSidebarOpen}
          onMobileMenuToggle={() => setMobileSidebarOpen(prev => !prev)}
          onSignOut={onSignOut}
        />

        {/* Sidebar collapse toggle (desktop) */}
        <div className="hidden lg:block absolute left-0 top-1/2 z-30" style={{ left: sidebarCollapsed ? 52 : 240 }}>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(prev => !prev)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex items-center justify-center',
              'w-5 h-10 rounded-r-lg',
              'bg-[#1e2535] hover:bg-[#232d42]',
              'border-y border-r border-[#253047]',
              'text-slate-500 hover:text-slate-300',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
            )}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={cn('w-3 h-3 transition-transform duration-200', sidebarCollapsed && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          id="main-content"
          tabIndex={-1}
        >
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// ============================================
// PageHeader — standard page title/action row
// ============================================

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  className?: string
}

export function PageHeader({ title, description, actions, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn('px-6 py-5 border-b border-[#1e2535]', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-2 text-xs text-slate-500" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-slate-300 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-400">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-100 leading-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// PageContent — standard padded content area
// ============================================

export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-5', className)}>
      {children}
    </div>
  )
}
