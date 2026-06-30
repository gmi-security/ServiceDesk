'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

// ============================================
// Spinner
// ============================================

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ============================================
// Variant and size styles
// ============================================

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700',
    'text-white',
    'border border-indigo-500/50',
    'shadow-sm shadow-indigo-900/50',
    'hover:shadow-indigo-500/30 hover:shadow-md',
  ].join(' '),

  secondary: [
    'bg-[#1e2535] hover:bg-[#232d42] active:bg-[#1a2035]',
    'text-slate-200 hover:text-white',
    'border border-[#253047] hover:border-[#304060]',
    'shadow-sm',
  ].join(' '),

  ghost: [
    'bg-transparent hover:bg-[#1e2535] active:bg-[#232d42]',
    'text-slate-300 hover:text-white',
    'border border-transparent hover:border-[#253047]',
  ].join(' '),

  danger: [
    'bg-red-600/20 hover:bg-red-600/30 active:bg-red-700/40',
    'text-red-400 hover:text-red-300',
    'border border-red-500/30 hover:border-red-500/50',
  ].join(' '),

  outline: [
    'bg-transparent hover:bg-indigo-500/10 active:bg-indigo-500/15',
    'text-indigo-400 hover:text-indigo-300',
    'border border-indigo-500/40 hover:border-indigo-400/60',
  ].join(' '),

  link: [
    'bg-transparent',
    'text-indigo-400 hover:text-indigo-300',
    'underline underline-offset-4',
    'border border-transparent',
    'p-0 h-auto',
  ].join(' '),
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-6 px-2 text-[11px] font-medium gap-1 rounded',
  sm: 'h-8 px-3 text-xs font-medium gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm font-medium gap-2 rounded-lg',
  lg: 'h-11 px-6 text-base font-semibold gap-2 rounded-lg',
}

// ============================================
// Button component
// ============================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    const spinnerSize: Record<ButtonSize, string> = {
      xs: 'w-3 h-3',
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium leading-none',
          'transition-all duration-150 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1117]',
          'disabled:pointer-events-none disabled:opacity-50',
          'select-none cursor-pointer',
          // Variant
          variantClasses[variant],
          // Size (skip for link variant)
          variant !== 'link' && sizeClasses[size],
          // Full width
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <Spinner className={spinnerSize[size]} />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

// ============================================
// IconButton — square button for icons only
// ============================================

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  label: string // aria-label — required for accessibility
  className?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', loading = false, label, children, className, disabled, ...props }, ref) => {
    const squareSizeClasses: Record<ButtonSize, string> = {
      xs: 'h-6 w-6 rounded',
      sm: 'h-8 w-8 rounded-md',
      md: 'h-9 w-9 rounded-lg',
      lg: 'h-11 w-11 rounded-lg',
    }

    return (
      <button
        ref={ref}
        aria-label={label}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center flex-shrink-0',
          'transition-all duration-150 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1117]',
          'disabled:pointer-events-none disabled:opacity-50',
          'cursor-pointer',
          variantClasses[variant],
          squareSizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          children
        )}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'
