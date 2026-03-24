import React, { useState, useCallback, useRef, useEffect, useContext, createContext } from 'react'
import { createPortal } from 'react-dom'

/** Semantic variant for toasts */
export type ToastVariant = 'info' | 'success' | 'warning' | 'danger'

/** Screen position for the toast stack */
export type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'

/** Size preset for toasts */
export type ToastSize = 'sm' | 'md' | 'lg'

export interface ToastOptions {
  /** Semantic color variant */
  variant?: ToastVariant
  /** Size preset */
  size?: ToastSize
  /** Optional heading */
  title?: string
  /** Toast body text */
  message: string
  /** Auto-dismiss in ms. 0 = persistent */
  duration?: number
  /** Show close button */
  closable?: boolean
  /** Custom icon */
  icon?: React.ReactNode
  /** Optional action button */
  action?: { label: string; onClick: () => void }
}

export interface ToastContainerProps {
  /** Position of the toast stack */
  position?: ToastPosition
  /** Maximum number of visible toasts */
  max?: number
}

interface ToastEntry extends ToastOptions {
  id: number
  exiting?: boolean
}

interface ToastContextValue {
  toast: (options: ToastOptions) => number
  dismiss: (id: number) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

/**
 * Hook to show/dismiss toasts. Must be used within a `ToastProvider`.
 * Returns `{ toast, dismiss, dismissAll }`.
 */
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

/* ── Default variant icons ── */
const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M9 8v5M9 5.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const SuccessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 9.5l2 2 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l7.5 13H1.5L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 7v4M9 13v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const DangerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)

const defaultIcons: Record<ToastVariant, React.ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  danger: <DangerIcon />,
}

/* ── Single toast item ── */
const ToastItem: React.FC<{
  entry: ToastEntry
  onDismiss: (id: number) => void
}> = ({ entry, onDismiss }) => {
  const {
    id,
    variant = 'info',
    size = 'md',
    title,
    message,
    duration = 5000,
    closable = true,
    icon,
    action,
    exiting,
  } = entry

  const [progress, setProgress] = useState(100)
  const [paused, setPaused] = useState(false)
  const startRef = useRef(Date.now())
  const remainingRef = useRef(duration)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (duration <= 0) return

    const tick = () => {
      if (paused) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const elapsed = Date.now() - startRef.current
      const remaining = Math.max(0, remainingRef.current - elapsed)
      const pct = (remaining / duration) * 100
      setProgress(pct)
      if (remaining <= 0) {
        onDismiss(id)
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    startRef.current = Date.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [duration, id, onDismiss, paused])

  const handlePause = () => {
    if (duration <= 0) return
    setPaused(true)
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startRef.current))
  }

  const handleResume = () => {
    if (duration <= 0) return
    setPaused(false)
    startRef.current = Date.now()
  }

  const cls = [
    'ui-toast',
    `ui-toast-${variant}`,
    `ui-toast-${size}`,
    exiting ? 'ui-toast-exit' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cls}
      role="alert"
      aria-live="polite"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      <span className="ui-toast-icon" aria-hidden="true">
        {icon || defaultIcons[variant]}
      </span>
      <div className="ui-toast-body">
        {title && <div className="ui-toast-title">{title}</div>}
        <div className="ui-toast-message">{message}</div>
        {action && (
          <button className="ui-toast-action" onClick={action.onClick} type="button">
            {action.label}
          </button>
        )}
      </div>
      {closable && (
        <button className="ui-toast-close" onClick={() => onDismiss(id)} aria-label="Dismiss" type="button">
          &#x2715;
        </button>
      )}
      {duration > 0 && (
        <div className="ui-toast-progress" style={{ width: `${progress}%` }} />
      )}
    </div>
  )
}

/**
 * Provides toast context to the application. Wrap your app in `ToastProvider`
 * and use the `useToast` hook to trigger toasts. Renders a portal-based
 * container with stacked, auto-dismissing notifications.
 */
export const ToastProvider: React.FC<{
  children?: React.ReactNode
} & ToastContainerProps> = ({
  children,
  position = 'top-right',
  max = 5,
}) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    )
    // Remove after exit animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 250)
  }, [])

  const dismissAll = useCallback(() => {
    setToasts((prev) => prev.map((t) => ({ ...t, exiting: true })))
    setTimeout(() => {
      setToasts([])
    }, 250)
  }, [])

  const toast = useCallback((options: ToastOptions): number => {
    const id = ++idRef.current
    setToasts((prev) => {
      const next = [...prev, { ...options, id }]
      // Respect max visible
      if (next.length > max) {
        return next.slice(next.length - max)
      }
      return next
    })
    return id
  }, [max])

  const containerCls = [
    'ui-toast-container',
    `ui-toast-container-${position}`,
  ].join(' ')

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      {createPortal(
        <div className={containerCls}>
          {toasts.map((entry) => (
            <ToastItem key={entry.id} entry={entry} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

ToastProvider.displayName = 'ToastProvider'

/**
 * Standalone ToastContainer for rendering toasts. Used internally
 * by ToastProvider; not typically needed directly.
 */
export const ToastContainer: React.FC<ToastContainerProps> = () => {
  return null // Container is rendered inside ToastProvider
}

ToastContainer.displayName = 'ToastContainer'
