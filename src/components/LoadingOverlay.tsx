import React, { useEffect } from 'react'

/** Visual variant for the loading overlay */
export type LoadingOverlayVariant = 'default' | 'glass' | 'solid' | 'minimal'

/** Size preset for the loading overlay */
export type LoadingOverlaySize = 'sm' | 'md' | 'lg'

export interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  visible: boolean
  /** Visual variant */
  variant?: LoadingOverlayVariant
  /** Size preset (affects spinner size) */
  size?: LoadingOverlaySize
  /** Custom spinner element */
  spinner?: React.ReactNode
  /** Loading message text */
  message?: string
  /** Secondary description text */
  description?: string
  /** Progress value 0-100 (shows progress bar) */
  progress?: number
  /** Cover entire viewport when true */
  fullScreen?: boolean
  /** Blur content behind overlay (default true for glass) */
  blur?: boolean
  /** Custom z-index */
  zIndex?: number
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

const DefaultSpinner: React.FC<{ size: LoadingOverlaySize }> = ({ size }) => (
  <div className={`ui-loading-overlay-ring ui-loading-overlay-ring-${size}`}>
    <svg viewBox="0 0 50 50">
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 60"
      />
    </svg>
  </div>
)

/**
 * Loading overlay for containers or full-screen use. Supports glass blur,
 * progress bar, custom spinner, and fade animation. Locks body scroll
 * when fullScreen.
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  variant = 'default',
  size = 'md',
  spinner,
  message,
  description,
  progress,
  fullScreen = false,
  blur,
  zIndex,
  className,
  style,
}) => {
  const resolvedBlur = blur ?? variant === 'glass'

  // Body scroll lock when fullScreen
  useEffect(() => {
    if (visible && fullScreen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      if (fullScreen) document.body.style.overflow = ''
    }
  }, [visible, fullScreen])

  if (!visible) return null

  const cls = [
    'ui-loading-overlay',
    `ui-loading-overlay-${variant}`,
    `ui-loading-overlay-${size}`,
    fullScreen && 'ui-loading-overlay-fullscreen',
    resolvedBlur && 'ui-loading-overlay-blur',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const hasProgress = progress != null && progress >= 0

  return (
    <div
      className={cls}
      style={{ ...style, ...(zIndex != null ? { zIndex } : {}) }}
      role={hasProgress ? 'progressbar' : 'status'}
      aria-busy="true"
      aria-label={message ?? 'Loading'}
      aria-valuenow={hasProgress ? progress : undefined}
      aria-valuemin={hasProgress ? 0 : undefined}
      aria-valuemax={hasProgress ? 100 : undefined}
    >
      <div className="ui-loading-overlay-content">
        {spinner ?? <DefaultSpinner size={size} />}
        {message && <p className="ui-loading-overlay-message">{message}</p>}
        {description && <p className="ui-loading-overlay-description">{description}</p>}
        {hasProgress && (
          <div className="ui-loading-overlay-progress">
            <div
              className="ui-loading-overlay-progress-bar"
              style={{ width: `${Math.min(100, Math.max(0, progress!))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
