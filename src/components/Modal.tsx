import React, { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

export type ModalSize = 'sm' | 'md' | 'lg' | 'full'

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Called when user requests close (Escape, backdrop click, close button) */
  onClose: () => void
  /** Modal heading */
  title?: string
  /** Size preset */
  size?: ModalSize
  /** Footer content (e.g. action buttons) */
  footer?: React.ReactNode
  /** Hide the close ✕ button */
  hideClose?: boolean
  children?: React.ReactNode
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'

/**
 * Accessible modal dialog with:
 * - Focus trap (Tab/Shift+Tab cycles within modal)
 * - Escape to close
 * - Click-outside backdrop to close
 * - Body scroll lock while open
 * - Portal to `document.body`
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  footer,
  hideClose = false,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  // Lock body scroll
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
      // Auto-focus first focusable element
      setTimeout(() => {
        const first = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)[0]
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
    if (e.key !== 'Tab' || !modalRef.current) return
    const focusable = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
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

  const modal = (
    <div
      className="ui-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      <div
        ref={modalRef}
        className={`ui-modal ui-modal-${size}`}
        onKeyDown={handleKeyDown}
      >
        {(title || !hideClose) && (
          <div className="ui-modal-header">
            {title && <h2 className="ui-modal-title">{title}</h2>}
            {!hideClose && (
              <button
                className="ui-modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="ui-modal-body">{children}</div>
        {footer && <div className="ui-modal-footer">{footer}</div>}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
