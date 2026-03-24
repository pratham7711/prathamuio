import React, { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

/** Slide-in direction */
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

/** Size preset for the drawer panel */
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full'

export interface DrawerProps {
  /** Whether the drawer is open */
  open: boolean
  /** Called when user requests close (Escape, overlay click, close button) */
  onClose: () => void
  /** Direction to slide in from */
  placement?: DrawerPlacement
  /** Size preset */
  size?: DrawerSize
  /** Drawer heading */
  title?: string
  /** Footer content (e.g. action buttons) */
  footer?: React.ReactNode
  /** Hide the close button */
  hideClose?: boolean
  /** Show backdrop overlay */
  overlay?: boolean
  /** Drawer body content */
  children?: React.ReactNode
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'

/**
 * Slide-in drawer / side panel. Supports all four directions with smooth
 * CSS transform animation, backdrop overlay, focus trap, Escape to close,
 * and body scroll lock. Renders via portal to document.body.
 */
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = 'right',
  size = 'md',
  title,
  footer,
  hideClose = false,
  overlay = true,
  children,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  // Body scroll lock
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
      // Auto-focus first focusable element
      setTimeout(() => {
        const first = drawerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)[0]
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
    if (e.key !== 'Tab' || !drawerRef.current) return
    const focusable = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
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

  const drawerCls = [
    'ui-drawer',
    `ui-drawer-${placement}`,
    `ui-drawer-size-${size}`,
    open ? 'ui-drawer-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const drawer = (
    <>
      {overlay && (
        <div
          className="ui-drawer-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        ref={drawerRef}
        className={drawerCls}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={handleKeyDown}
      >
        {(title || !hideClose) && (
          <div className="ui-drawer-header">
            {title && <h2 className="ui-drawer-title">{title}</h2>}
            {!hideClose && (
              <button
                className="ui-drawer-close"
                onClick={onClose}
                aria-label="Close drawer"
                type="button"
              >
                &#x2715;
              </button>
            )}
          </div>
        )}
        <div className="ui-drawer-body">{children}</div>
        {footer && <div className="ui-drawer-footer">{footer}</div>}
      </div>
    </>
  )

  return createPortal(drawer, document.body)
}

Drawer.displayName = 'Drawer'
