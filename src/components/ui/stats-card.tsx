import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

// ============================================
// Color variants
// ============================================

type StatsVariant = 'indigo' | 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'slate'

const variantStyles: Record<StatsVariant, { icon: string; badge: string; trend: string }> = {
  indigo: {
    icon:  'bg-indigo-500/15 text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    trend: 'text-indigo-400',
  },
  blue: {
    icon:  'bg-blue-500/15 text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    trend: 'text-blue-400',
  },
  emerald: {
    icon:  'bg-emerald-500/15 text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    trend: 'text-emerald-400',
  },
  amber: {
    icon:  'bg-amber-500/15 text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    trend: 'text-amber-400',
  },
  red: {
    icon:  'bg-red-500/15 text-red-400',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    trend: 'text-red-400',
  },
  purple: {
    icon:  'bg-purple-500/15 text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    trend: 'text-purple-400',
  },
  slate: {
    icon:  'bg-slate-500/15 text-slate-400',
    badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    trend: 'text-slate-400',
  },
}

// ============================================
// StatsCard
// ============================================

export interface StatsCardProps {
  title: string
  value: string | number
  change?: number        // Percentage change (positive = increase)
  changeLabel?: string   // e.g. "vs last week"
  icon?: ReactNode
  variant?: StatsVariant
  loading?: boolean
  className?: string
  /** If true, a positive change is bad (e.g. SLA breaches) */
  invertTrend?: boolean
  suffix?: string
  description?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  variant = 'indigo',
  loading = false,
  className,
  invertTrend = false,
  suffix,
  description,
}: StatsCardProps) {
  const styles = variantStyles[variant]
  const hasChange = change !== undefined && change !== null

  // Determine if the trend is positive or negative for coloring
  const isPositive = invertTrend ? (change ?? 0) < 0 : (change ?? 0) > 0
  const isNegative = invertTrend ? (change ?? 0) > 0 : (change ?? 0) < 0

  const trendColor = isPositive
    ? 'text-emerald-400'
    : isNegative
      ? 'text-red-400'
      : 'text-slate-400'

  if (loading) {
    return (
      <div className={cn('rounded-xl border border-[#1e2535] bg-[#161b27] p-5', className)}>
        <div className="flex items-start justify-between mb-4">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-8 w-8 rounded-lg" />
        </div>
        <div className="skeleton h-8 w-20 rounded mb-2" />
        <div className="skeleton h-3 w-28 rounded" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-[#1e2535] bg-[#161b27]',
        'p-5',
        'shadow-[0_1px_3px_rgba(0,0,0,0.4)]',
        'hover:border-[#253047] hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
        'transition-all duration-200',
        className,
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider leading-none">
          {title}
        </p>

        {icon && (
          <div
            className={cn(
              'flex items-center justify-center rounded-lg w-8 h-8 flex-shrink-0',
              styles.icon,
            )}
          >
            <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5 mb-2">
        <span className="text-3xl font-bold text-slate-100 leading-none tabular-nums">
          {value}
        </span>
        {suffix && (
          <span className="text-base font-medium text-slate-400 mb-0.5">{suffix}</span>
        )}
      </div>

      {/* Change / description */}
      {hasChange && (
        <div className="flex items-center gap-1.5">
          <span className={cn('flex items-center gap-0.5 text-xs font-medium', trendColor)}>
            {isPositive && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            )}
            {isNegative && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {Math.abs(change ?? 0)}%
          </span>
          <span className="text-xs text-slate-500">{changeLabel}</span>
        </div>
      )}

      {description && !hasChange && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
    </div>
  )
}

// ============================================
// StatsGrid — layout helper
// ============================================

export function StatsGrid({
  children,
  cols = 4,
  className,
}: {
  children: ReactNode
  cols?: 2 | 3 | 4 | 5
  className?: string
}) {
  const colClasses: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
  }

  return (
    <div className={cn('grid gap-4', colClasses[cols], className)}>
      {children}
    </div>
  )
}
