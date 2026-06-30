'use client'

import { Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

// ============================================
// Modal sizes
// ============================================

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

const sizeClasses: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-xl',
  '2xl':'max-w-2xl',
  full: 'max-w-[90vw] max-h-[90vh]',
}

// ============================================
// Modal component
// ============================================

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  /** Prevent closing when clicking the overlay */
  preventOverlayClose?: boolean
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  preventOverlayClose = false,
  className,
}: ModalProps) {
  function handleClose() {
    if (!preventOverlayClose) onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={handleClose}
      >
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />
        </TransitionChild>

        {/* Panel container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95 translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-2"
            >
              <DialogPanel
                className={cn(
                  'w-full',
                  sizeClasses[size],
                  'bg-[#161b27]',
                  'border border-[#1e2535]',
                  'rounded-xl',
                  'shadow-[0_20px_60px_rgba(0,0,0,0.7),0_8px_24px_rgba(0,0,0,0.5)]',
                  'overflow-hidden',
                  className,
                )}
              >
                {/* Header */}
                {(title || description) && (
                  <ModalHeader onClose={onClose}>
                    <div>
                      {title && (
                        <DialogTitle className="text-base font-semibold text-slate-100">
                          {title}
                        </DialogTitle>
                      )}
                      {description && (
                        <p className="mt-1 text-sm text-slate-400">{description}</p>
                      )}
                    </div>
                  </ModalHeader>
                )}

                {/* Body */}
                {children && (
                  <div className="px-5 py-4">{children}</div>
                )}

                {/* Footer */}
                {footer && (
                  <ModalFooter>{footer}</ModalFooter>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

// ============================================
// Sub-components
// ============================================

export function ModalHeader({
  onClose,
  children,
  className,
}: {
  onClose?: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        'px-5 py-4',
        'border-b border-[#1e2535]',
        className,
      )}
    >
      <div className="flex-1 min-w-0">{children}</div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'flex-shrink-0 rounded-md p-1.5 -mr-1 -mt-1',
            'text-slate-500 hover:text-slate-300',
            'hover:bg-[#232d42]',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
          )}
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 py-4', className)}>{children}</div>
  )
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3',
        'px-5 py-4',
        'border-t border-[#1e2535]',
        'bg-[#1a2035]',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ============================================
// Confirm Dialog — convenience wrapper
// ============================================

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const iconColors = {
    danger:  'text-red-400 bg-red-500/15',
    warning: 'text-amber-400 bg-amber-500/15',
    info:    'text-blue-400 bg-blue-500/15',
  }

  const confirmColors = {
    danger:  'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30',
    warning: 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30',
    info:    'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', iconColors[variant])}>
          {variant === 'danger' && (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {variant === 'warning' && (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {variant === 'info' && (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-100">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </div>

        <div className="flex gap-3 w-full mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={cn(
              'flex-1 h-9 px-4 rounded-lg text-sm font-medium',
              'bg-[#1e2535] hover:bg-[#232d42]',
              'text-slate-300 hover:text-white',
              'border border-[#253047]',
              'transition-all duration-150',
              'disabled:opacity-50 disabled:pointer-events-none',
            )}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'flex-1 h-9 px-4 rounded-lg text-sm font-medium',
              'transition-all duration-150',
              'disabled:opacity-50 disabled:pointer-events-none',
              confirmColors[variant],
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {confirmLabel}
              </span>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
