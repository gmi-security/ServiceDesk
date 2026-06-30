'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

// ============================================
// Option type
// ============================================

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectGroup {
  label: string
  options: SelectOption[]
}

// ============================================
// Select component
// ============================================

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options?: SelectOption[]
  groups?: SelectGroup[]
  placeholder?: string
  fullWidth?: boolean
  wrapperClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      groups,
      placeholder,
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

        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              'appearance-none',
              'flex h-9 w-full rounded-lg',
              'bg-[#0f1117] border',
              'text-sm text-slate-100',
              'pl-3.5 pr-9 py-2',
              'transition-all duration-150 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60',
              hasError
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60'
                : 'border-[#253047] hover:border-[#304060]',
              disabled && 'cursor-not-allowed opacity-50',
              // Style the placeholder (empty option)
              '[&>option]:bg-[#161b27] [&>option]:text-slate-100',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Flat options */}
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}

            {/* Grouped options */}
            {groups?.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Chevron icon */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

Select.displayName = 'Select'

// ============================================
// Preset option sets for common fields
// ============================================

export const STATUS_OPTIONS: SelectOption[] = [
  { value: 'NEW',                    label: 'New' },
  { value: 'OPEN',                   label: 'Open' },
  { value: 'IN_PROGRESS',            label: 'In Progress' },
  { value: 'WAITING_ON_CUSTOMER',    label: 'Waiting on Customer' },
  { value: 'WAITING_ON_THIRD_PARTY', label: 'Waiting on 3rd Party' },
  { value: 'RESOLVED',               label: 'Resolved' },
  { value: 'CLOSED',                 label: 'Closed' },
  { value: 'CANCELLED',              label: 'Cancelled' },
]

export const PRIORITY_OPTIONS: SelectOption[] = [
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH',     label: 'High' },
  { value: 'MEDIUM',   label: 'Medium' },
  { value: 'LOW',      label: 'Low' },
  { value: 'PLANNING', label: 'Planning' },
]

export const ROLE_OPTIONS: SelectOption[] = [
  { value: 'ADMIN',      label: 'Admin' },
  { value: 'MANAGER',    label: 'Manager' },
  { value: 'TECHNICIAN', label: 'Technician' },
  { value: 'READONLY',   label: 'Read Only' },
]
