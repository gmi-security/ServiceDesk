'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

// ============================================
// Badge variants
// ============================================

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'indigo'
  | 'orange'
  | 'slate'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-500/15 text-slate-300 border-slate-500/25',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  danger:  'bg-red-500/15 text-red-400 border-red-500/25',
  info:    'bg-blue-500/15 text-blue-400 border-blue-500/25',
  purple:  'bg-purple-500/15 text-purple-400 border-purple-500/25',
  indigo:  'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  orange:  'bg-orange-500/15 text-orange-400 border-orange-500/25',
  slate:   'bg-slate-500/10 text-slate-400 border-slate-600/20',
}

type BadgeSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px] font-semibold',
  md: 'px-2.5 py-0.5 text-xs font-semibold',
  lg: 'px-3 py-1 text-sm font-medium',
}

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border leading-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'rounded-full flex-shrink-0',
            size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5',
            dotColorMap[variant],
          )}
        />
      )}
      {children}
    </span>
  )
}

const dotColorMap: Record<BadgeVariant, string> = {
  default: 'bg-slate-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-blue-400',
  purple:  'bg-purple-400',
  indigo:  'bg-indigo-400',
  orange:  'bg-orange-400',
  slate:   'bg-slate-500',
}

// ============================================
// Ticket Status Badge
// ============================================

const statusVariantMap: Record<string, BadgeVariant> = {
  NEW:                    'info',
  OPEN:                   'indigo',
  IN_PROGRESS:            'warning',
  WAITING_ON_CUSTOMER:    'orange',
  WAITING_ON_THIRD_PARTY: 'purple',
  RESOLVED:               'success',
  CLOSED:                 'slate',
  CANCELLED:              'danger',
}

const statusLabelMap: Record<string, string> = {
  NEW:                    'New',
  OPEN:                   'Open',
  IN_PROGRESS:            'In Progress',
  WAITING_ON_CUSTOMER:    'Waiting on Customer',
  WAITING_ON_THIRD_PARTY: 'Waiting on 3rd Party',
  RESOLVED:               'Resolved',
  CLOSED:                 'Closed',
  CANCELLED:              'Cancelled',
}

export interface StatusBadgeProps {
  status: string
  size?: BadgeSize
  dot?: boolean
  className?: string
}

export function StatusBadge({ status, size = 'md', dot = true, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status] ?? 'default'
  const label = statusLabelMap[status] ?? status.replace(/_/g, ' ')

  return (
    <Badge variant={variant} size={size} dot={dot} className={className}>
      {label}
    </Badge>
  )
}

// ============================================
// Priority Badge
// ============================================

const priorityVariantMap: Record<string, BadgeVariant> = {
  CRITICAL: 'danger',
  HIGH:     'orange',
  MEDIUM:   'warning',
  LOW:      'info',
  PLANNING: 'slate',
}

const priorityLabelMap: Record<string, string> = {
  CRITICAL: 'Critical',
  HIGH:     'High',
  MEDIUM:   'Medium',
  LOW:      'Low',
  PLANNING: 'Planning',
}

export interface PriorityBadgeProps {
  priority: string
  size?: BadgeSize
  dot?: boolean
  className?: string
}

export function PriorityBadge({ priority, size = 'md', dot = false, className }: PriorityBadgeProps) {
  const variant = priorityVariantMap[priority] ?? 'default'
  const label = priorityLabelMap[priority] ?? priority

  return (
    <Badge variant={variant} size={size} dot={dot} className={className}>
      {label}
    </Badge>
  )
}

// ============================================
// Role Badge
// ============================================

const roleVariantMap: Record<string, BadgeVariant> = {
  ADMIN:      'purple',
  MANAGER:    'indigo',
  TECHNICIAN: 'info',
  READONLY:   'slate',
}

export function RoleBadge({ role, className }: { role: string; className?: string }) {
  const variant = roleVariantMap[role] ?? 'default'
  const label = role.charAt(0) + role.slice(1).toLowerCase()

  return (
    <Badge variant={variant} size="sm" className={className}>
      {label}
    </Badge>
  )
}
