import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

// ============================================
// Card
// ============================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional header slot — renders above content with a border separator */
  header?: ReactNode
  /** Card title — displayed in the header area */
  title?: ReactNode
  /** Subtitle beneath the title */
  description?: ReactNode
  /** Optional footer slot — renders below content with a border separator */
  footer?: ReactNode
  /** Remove default padding from the body */
  noPadding?: boolean
  /** Elevated appearance with stronger shadow */
  elevated?: boolean
  className?: string
  bodyClassName?: string
  children?: ReactNode
}

export function Card({
  header,
  title,
  description,
  footer,
  noPadding = false,
  elevated = false,
  className,
  bodyClassName,
  children,
  ...props
}: CardProps) {
  const hasHeader = header != null || title != null

  return (
    <div
      className={cn(
        'rounded-xl border border-[#1e2535] bg-[#161b27]',
        elevated
          ? 'shadow-[0_4px_16px_rgba(0,0,0,0.5),0_2px_6px_rgba(0,0,0,0.4)]'
          : 'shadow-[0_1px_3px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.3)]',
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <CardHeader>
          {header ?? (
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          )}
        </CardHeader>
      )}

      {children != null && (
        <CardBody className={cn(!noPadding && 'p-5', bodyClassName)}>
          {children}
        </CardBody>
      )}

      {footer != null && <CardFooter>{footer}</CardFooter>}
    </div>
  )
}

// ============================================
// Sub-components (composable)
// ============================================

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        'px-5 py-4',
        'border-b border-[#1e2535]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-sm font-semibold text-slate-100 leading-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('mt-0.5 text-xs text-slate-400 leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 py-3',
        'border-t border-[#1e2535]',
        'bg-[#1a2035] rounded-b-xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================
// CardGrid — responsive grid layout for cards
// ============================================

export function CardGrid({
  cols = 3,
  className,
  children,
}: {
  cols?: 1 | 2 | 3 | 4
  className?: string
  children: ReactNode
}) {
  const colClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', colClasses[cols], className)}>
      {children}
    </div>
  )
}
