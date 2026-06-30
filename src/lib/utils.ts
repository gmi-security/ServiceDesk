import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  differenceInDays,
} from 'date-fns'

// ============================================
// Class name utility
// ============================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// Date formatting
// ============================================

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  return format(d, 'MMM d, yyyy')
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  return format(d, 'MMM d, yyyy h:mm a')
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'

  if (isToday(d)) {
    return formatDistanceToNow(d, { addSuffix: true })
  }

  if (isYesterday(d)) {
    return `Yesterday at ${format(d, 'h:mm a')}`
  }

  const daysAgo = differenceInDays(new Date(), d)
  if (daysAgo < 7) {
    return formatDistanceToNow(d, { addSuffix: true })
  }

  return format(d, 'MMM d, yyyy')
}

export function formatShortDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  return format(d, 'MMM d')
}

// ============================================
// Ticket status styling
// ============================================

export type TicketStatus =
  | 'NEW'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_ON_CUSTOMER'
  | 'WAITING_ON_THIRD_PARTY'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED'

export function getTicketStatusColor(status: string): string {
  switch (status) {
    case 'NEW':
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
    case 'OPEN':
      return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
    case 'IN_PROGRESS':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
    case 'WAITING_ON_CUSTOMER':
      return 'bg-orange-500/15 text-orange-400 border border-orange-500/25'
    case 'WAITING_ON_THIRD_PARTY':
      return 'bg-purple-500/15 text-purple-400 border border-purple-500/25'
    case 'RESOLVED':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
    case 'CLOSED':
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
    case 'CANCELLED':
      return 'bg-red-500/15 text-red-400 border border-red-500/25'
    default:
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
  }
}

export function getTicketStatusLabel(status: string): string {
  switch (status) {
    case 'NEW':                  return 'New'
    case 'OPEN':                 return 'Open'
    case 'IN_PROGRESS':          return 'In Progress'
    case 'WAITING_ON_CUSTOMER':  return 'Waiting on Customer'
    case 'WAITING_ON_THIRD_PARTY': return 'Waiting on 3rd Party'
    case 'RESOLVED':             return 'Resolved'
    case 'CLOSED':               return 'Closed'
    case 'CANCELLED':            return 'Cancelled'
    default:                     return status
  }
}

// ============================================
// Priority styling
// ============================================

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'PLANNING'

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-red-500/15 text-red-400 border border-red-500/25'
    case 'HIGH':
      return 'bg-orange-500/15 text-orange-400 border border-orange-500/25'
    case 'MEDIUM':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
    case 'LOW':
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
    case 'PLANNING':
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
    default:
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
  }
}

export function getPriorityDotColor(priority: string): string {
  switch (priority) {
    case 'CRITICAL': return 'bg-red-400'
    case 'HIGH':     return 'bg-orange-400'
    case 'MEDIUM':   return 'bg-amber-400'
    case 'LOW':      return 'bg-blue-400'
    case 'PLANNING': return 'bg-slate-400'
    default:         return 'bg-slate-400'
  }
}

export function getPriorityIcon(priority: string): string {
  switch (priority) {
    case 'CRITICAL': return 'flame'       // Fire icon — system-down urgency
    case 'HIGH':     return 'arrow-up'    // Upward arrow — elevated priority
    case 'MEDIUM':   return 'minus'       // Dash — neutral / normal
    case 'LOW':      return 'arrow-down'  // Downward arrow — defer safely
    case 'PLANNING': return 'calendar'    // Calendar — future work
    default:         return 'circle'
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'CRITICAL': return 'Critical'
    case 'HIGH':     return 'High'
    case 'MEDIUM':   return 'Medium'
    case 'LOW':      return 'Low'
    case 'PLANNING': return 'Planning'
    default:         return priority
  }
}

// ============================================
// String utilities
// ============================================

export function truncate(str: string, length: number): string {
  if (!str) return ''
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + '…'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function titleCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(capitalize)
    .join(' ')
}

export function initials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// ============================================
// Ticket number generation
// ============================================

export function generateTicketNumber(): string {
  const prefix = 'TKT'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `${prefix}-${timestamp}${random}`
}

export function generateId(prefix = ''): string {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return prefix ? `${prefix}_${ts}${rand}` : `${ts}${rand}`
}

// ============================================
// Number formatting
// ============================================

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

// ============================================
// Color helpers
// ============================================

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// ============================================
// Array / object utilities
// ============================================

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key])
      return {
        ...groups,
        [groupKey]: [...(groups[groupKey] || []), item],
      }
    },
    {} as Record<string, T[]>,
  )
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

// ============================================
// Validation utilities
// ============================================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// ============================================
// Async utilities
// ============================================

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 500,
): Promise<T> {
  let lastError: Error | unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts - 1) await sleep(delayMs * (i + 1))
    }
  }
  throw lastError
}
