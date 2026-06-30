'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

// ============================================
// Input
// ============================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  rightAction?: ReactNode
  fullWidth?: boolean
  wrapperClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      rightAction,
      fullWidth = true,
      wrapperClassName,
      className,
      id,
      disabled,
      required,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(error)

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none',
              hasError ? 'text-red-400' : 'text-slate-300',
            )}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-400" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-slate-500">
              <span className="h-4 w-4 flex items-center justify-center">{leftIcon}</span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              // Base
              'flex h-9 w-full rounded-lg',
              'bg-[#0f1117] border',
              'text-sm text-slate-100 placeholder:text-slate-500',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60',
              // Default border
              hasError
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60'
                : 'border-[#253047] hover:border-[#304060]',
              // Disabled
              disabled && 'cursor-not-allowed opacity-50',
              // Padding — adjust for icons
              leftIcon ? 'pl-9' : 'pl-3.5',
              rightIcon || rightAction ? 'pr-9' : 'pr-3.5',
              'py-2',
              className,
            )}
            {...props}
          />

          {(rightIcon || rightAction) && (
            <div className="absolute right-3 flex items-center">
              {rightIcon && (
                <span className="h-4 w-4 text-slate-500 flex items-center justify-center pointer-events-none">
                  {rightIcon}
                </span>
              )}
              {rightAction}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

// ============================================
// SearchInput — thin wrapper with search icon
// ============================================

export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, className, ...props }, ref) => {
    const SearchIcon = (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )

    const ClearButton = value && onClear ? (
      <button
        type="button"
        onClick={onClear}
        className="text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Clear search"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    ) : undefined

    return (
      <Input
        ref={ref}
        leftIcon={SearchIcon}
        rightAction={ClearButton}
        value={value}
        className={className}
        {...props}
      />
    )
  },
)

SearchInput.displayName = 'SearchInput'
