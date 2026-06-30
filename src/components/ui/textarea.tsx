'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

// ============================================
// Textarea
// ============================================

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  fullWidth?: boolean
  wrapperClassName?: string
  /** Show character count when maxLength is set */
  showCount?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = true,
      wrapperClassName,
      className,
      id,
      disabled,
      required,
      maxLength,
      showCount = false,
      value,
      defaultValue,
      resize = 'vertical',
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(error)
    const currentLength =
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
          ? defaultValue.length
          : 0

    const resizeClasses: Record<string, string> = {
      none:       'resize-none',
      vertical:   'resize-y',
      horizontal: 'resize-x',
      both:       'resize',
    }

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', wrapperClassName)}>
        {(label || (showCount && maxLength)) && (
          <div className="flex items-center justify-between">
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

            {showCount && maxLength && (
              <span
                className={cn(
                  'text-xs tabular-nums',
                  currentLength >= maxLength
                    ? 'text-red-400'
                    : currentLength >= maxLength * 0.9
                      ? 'text-amber-400'
                      : 'text-slate-500',
                )}
              >
                {currentLength} / {maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          rows={rows}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(
            'w-full rounded-lg',
            'bg-[#0f1117] border',
            'text-sm text-slate-100 placeholder:text-slate-500',
            'px-3.5 py-2.5',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60',
            hasError
              ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60'
              : 'border-[#253047] hover:border-[#304060]',
            disabled && 'cursor-not-allowed opacity-50',
            resizeClasses[resize],
            'min-h-[80px]',
            className,
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea'
