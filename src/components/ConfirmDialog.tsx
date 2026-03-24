import React, { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

/** Visual variant for the confirm dialog */
export type ConfirmDialogVariant = 'info' | 'success' | 'warning' | 'danger' | 'custom'

/** Size preset for the confirm dialog */
export type ConfirmDialogSize = 'sm' | 'md' | 'lg'

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Called when user requests close */
  onClose: () => void
  /** Called when user confirms */
  onConfirm: () => void
  /** Called when user cancels (defaults to onClose) */
  onCancel?: () => void
  /** Visual variant */
  variant?: ConfirmDialogVariant
  /** Size preset */
  size?: ConfirmDialogSize
  /** Dialog heading */
  title: string
  /** Description text or node below the title */
  description?: string | React.ReactNode
  /** Custom icon (defaults based on variant) */
  icon?: React.ReactNode
  /** Confirm button label */
  confirmText?: string
  /** Cancel button label */
  cancelText?: string
  /** Show loading spinner on confirm button */
  confirmLoading?: boolean
  /** Hide the cancel button */
  hideCancel?: boolean
  /** Extra content between description and actions */
  children?: React.ReactNode
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'

const defaultIcons: Record<Exclude<ConfirmDialogVariant, 'custom'>, React.ReactNode> = {
  info: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  warning: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  danger: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
}

/**
 * Accessible confirmation dialog with variant icons, loading state,
 * focus trap, Escape to close, and body scroll lock. Renders via portal.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onCancel,
  variant = 'info',
  size = 'md',
  title,
  description,
  icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmLoading = false,
  hideCancel = false,
  children,
  className,
  style,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  const handleCancel = useCallback(() => {
    ;(onCancel ?? onClose)()
  }, [onCancel, onClose])

  // Body scroll lock + auto-focus
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        const first = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)[0]
        first?.focus()
      }, 50)
    } else {
      document.body.style.overflow = ''
      ;(previousFocusRef.current as HTMLElement | null)?.focus()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    ).filter((el) => !el.closest('[aria-hidden]'))
    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  if (!open) return null

  const resolvedIcon = icon ?? (variant !== 'custom' ? defaultIcons[variant] : null)

  const cls = [
    'ui-confirm-dialog',
    `ui-confirm-dialog-${size}`,
    `ui-confirm-dialog-${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const dialog = (
    <div
      className="ui-confirm-dialog-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-modal="true"
      role="alertdialog"
      aria-label={title}
      aria-describedby="ui-confirm-dialog-desc"
    >
      <div
        ref={dialogRef}
        className={cls}
        style={style}
        onKeyDown={handleKeyDown}
      >
        {resolvedIcon && (
          <div className="ui-confirm-dialog-icon">
            {resolvedIcon}
          </div>
        )}
        <h2 className="ui-confirm-dialog-title">{title}</h2>
        {description && (
          <div className="ui-confirm-dialog-description" id="ui-confirm-dialog-desc">
            {description}
          </div>
        )}
        {children && <div className="ui-confirm-dialog-content">{children}</div>}
        <div className="ui-confirm-dialog-actions">
          {!hideCancel && (
            <button
              className="ui-confirm-dialog-btn ui-confirm-dialog-btn-cancel"
              onClick={handleCancel}
              type="button"
            >
              {cancelText}
            </button>
          )}
          <button
            className={[
              'ui-confirm-dialog-btn',
              'ui-confirm-dialog-btn-confirm',
              `ui-confirm-dialog-btn-${variant}`,
            ].join(' ')}
            onClick={onConfirm}
            disabled={confirmLoading}
            type="button"
          >
            {confirmLoading && <span className="ui-confirm-dialog-spinner" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}
