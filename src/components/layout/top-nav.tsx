'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { SearchInput } from '@/components/ui/input'
import type { FormEvent } from 'react'

// ============================================
// Notification bell
// ============================================

function NotificationBell({ count = 0 }: { count?: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-label={`Notifications${count > 0 ? `, ${count} unread` : ''}`}
        className={cn(
          'relative flex items-center justify-center w-9 h-9 rounded-lg',
          'text-slate-400 hover:text-slate-200',
          'hover:bg-[#1e2535]',
          'border border-transparent hover:border-[#253047]',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
        )}
      >
        <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-[9px] font-bold text-white leading-none">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 w-80',
            'bg-[#161b27] border border-[#1e2535] rounded-xl',
            'shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
            'animate-slide-up',
            'z-50',
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2535]">
            <span className="text-sm font-semibold text-slate-100">Notifications</span>
            {count > 0 && (
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Mark all read
              </button>
            )}
          </div>

          {count === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-[#1e2535] flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-sm text-slate-400">No notifications</p>
              <p className="text-xs text-slate-500 mt-1">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-[#1e2535]">
              {/* Notification items would be rendered here */}
              <div className="px-4 py-3 hover:bg-[#1e2535] transition-colors cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-200">New ticket assigned to you</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">2 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 py-2 border-t border-[#1e2535]">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors block text-center"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// User menu dropdown
// ============================================

interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
  onSignOut?: () => void
}

function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const roleLabel = user.role
    ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
    : 'Technician'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg',
          'hover:bg-[#1e2535]',
          'border border-transparent hover:border-[#253047]',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
        )}
        aria-label="User menu"
        aria-expanded={open}
      >
        <Avatar name={user.name} image={user.image} size="sm" />
        <div className="hidden sm:block text-left min-w-0">
          <p className="text-xs font-medium text-slate-200 truncate max-w-[120px] leading-tight">
            {user.name ?? 'User'}
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">{roleLabel}</p>
        </div>
        <svg
          className={cn('w-3 h-3 text-slate-500 transition-transform duration-150', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 w-56',
            'bg-[#161b27] border border-[#1e2535] rounded-xl',
            'shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
            'animate-slide-up',
            'z-50 overflow-hidden',
          )}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-[#1e2535]">
            <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
            <span className="mt-1.5 inline-flex items-center px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 text-[10px] font-semibold border border-indigo-500/20">
              {roleLabel}
            </span>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {[
              { href: '/profile',      label: 'My Profile',     icon: '👤' },
              { href: '/settings',     label: 'Preferences',    icon: '⚙️' },
              { href: '/my-tickets',   label: 'My Tickets',     icon: '🎫' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-2',
                  'text-sm text-slate-300 hover:text-slate-100',
                  'hover:bg-[#1e2535]',
                  'transition-colors',
                )}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-[#1e2535] py-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onSignOut?.()
              }}
              className={cn(
                'w-full flex items-center gap-2.5 px-4 py-2',
                'text-sm text-red-400 hover:text-red-300',
                'hover:bg-red-500/10',
                'transition-colors text-left',
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// TopNav
// ============================================

export interface TopNavProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  } | null
  notificationCount?: number
  onMobileMenuToggle?: () => void
  mobileMenuOpen?: boolean
  onSignOut?: () => void
  className?: string
}

export function TopNav({
  user,
  notificationCount = 0,
  onMobileMenuToggle,
  mobileMenuOpen = false,
  onSignOut,
  className,
}: TopNavProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
  }

  return (
    <header
      className={cn(
        'h-16 flex items-center gap-3 px-4',
        'bg-[#0d111c] border-b border-[#1e2535]',
        'sticky top-0 z-40',
        className,
      )}
    >
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={onMobileMenuToggle}
        className={cn(
          'lg:hidden flex items-center justify-center w-9 h-9 rounded-lg',
          'text-slate-400 hover:text-slate-200',
          'hover:bg-[#1e2535]',
          'border border-transparent hover:border-[#253047]',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
        )}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-lg">
        <form onSubmit={handleSearch} role="search">
          <SearchInput
            placeholder="Search tickets, customers, articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            className="h-8 text-sm"
            aria-label="Global search"
          />
        </form>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Quick create */}
        <Link
          href="/tickets/new"
          className={cn(
            'hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg',
            'text-xs font-medium',
            'bg-indigo-600 hover:bg-indigo-500',
            'text-white',
            'border border-indigo-500/50',
            'transition-all duration-150',
            'shadow-sm shadow-indigo-900/50',
          )}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </Link>

        {/* Notifications */}
        <NotificationBell count={notificationCount} />

        {/* User menu */}
        {user && (
          <UserMenu user={user} onSignOut={onSignOut} />
        )}
      </div>
    </header>
  )
}
