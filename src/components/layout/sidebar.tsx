'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import type { ReactNode } from 'react'

// ============================================
// Navigation items
// ============================================

interface NavItem {
  href: string
  label: string
  icon: ReactNode
  badge?: number
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/tickets',
    label: 'Tickets',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    href: '/boards',
    label: 'Boards',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    href: '/catalog',
    label: 'Service Catalog',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: '/customers',
    label: 'Customers',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    href: '/knowledge',
    label: 'Knowledge Base',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/reports',
    label: 'Reports',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

const BOTTOM_NAV_ITEMS: NavItem[] = [
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

// ============================================
// NavLink
// ============================================

interface NavLinkProps {
  item: NavItem
  collapsed?: boolean
}

function NavLink({ item, collapsed = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + '/')

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group flex items-center gap-2.5 px-3 py-2 rounded-lg',
        'text-sm font-medium transition-all duration-150',
        'relative',
        isActive
          ? [
              'bg-indigo-500/15 text-indigo-300',
              'border border-indigo-500/20',
              'shadow-sm shadow-indigo-500/10',
            ]
          : [
              'text-slate-400 hover:text-slate-200',
              'hover:bg-[#1e2535]',
              'border border-transparent',
            ],
        collapsed && 'justify-center px-2',
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 transition-colors',
          isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300',
        )}
      >
        {item.icon}
      </span>

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>

          {item.badge != null && item.badge > 0 && (
            <span
              className={cn(
                'flex-shrink-0 inline-flex items-center justify-center',
                'min-w-[18px] h-[18px] px-1',
                'rounded-full text-[10px] font-bold leading-none',
                isActive
                  ? 'bg-indigo-500 text-white'
                  : 'bg-[#253047] text-slate-300',
              )}
            >
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </>
      )}

      {/* Active indicator bar */}
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-r-full" />
      )}
    </Link>
  )
}

// ============================================
// GMI Logo
// ============================================

function GMILogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
      {/* Logo mark */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-900/60">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 text-white"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-slate-100 leading-tight tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            GMI ServiceOS
          </span>
          <span className="text-[10px] text-slate-500 leading-tight font-medium uppercase tracking-widest">
            Service Desk
          </span>
        </div>
      )}
    </div>
  )
}

// ============================================
// Sidebar
// ============================================

export interface SidebarProps {
  /** Ticket count shown in the nav badge */
  openTicketCount?: number
  /** Currently signed-in user */
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  } | null
  collapsed?: boolean
  className?: string
}

export function Sidebar({
  openTicketCount,
  user,
  collapsed = false,
  className,
}: SidebarProps) {
  // Inject ticket count badge into nav items
  const navItems = NAV_ITEMS.map(item =>
    item.href === '/tickets' && openTicketCount != null
      ? { ...item, badge: openTicketCount }
      : item,
  )

  return (
    <aside
      className={cn(
        'flex flex-col h-full',
        'bg-[#0d111c] border-r border-[#1e2535]',
        collapsed ? 'w-16' : 'w-64',
        'transition-all duration-200',
        className,
      )}
    >
      {/* Logo */}
      <div className={cn('px-4 py-4 border-b border-[#1e2535]', collapsed && 'px-3')}>
        <GMILogo collapsed={collapsed} />
      </div>

      {/* Main navigation */}
      <nav
        className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5"
        aria-label="Main navigation"
      >
        {navItems.map(item => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-[#1e2535]" />

      {/* Bottom nav items */}
      <nav className="px-2 py-2 space-y-0.5" aria-label="Secondary navigation">
        {BOTTOM_NAV_ITEMS.map(item => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User profile footer */}
      {user && (
        <div className={cn('border-t border-[#1e2535] p-3', collapsed && 'flex justify-center')}>
          {collapsed ? (
            <Avatar name={user.name} image={user.image} size="sm" />
          ) : (
            <div className="flex items-center gap-2.5 px-1">
              <Avatar name={user.name} image={user.image} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate leading-tight">
                  {user.name ?? 'Unknown User'}
                </p>
                <p className="text-[11px] text-slate-500 truncate leading-tight">
                  {user.role
                    ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
                    : 'Technician'}
                </p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" title="Online" />
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
