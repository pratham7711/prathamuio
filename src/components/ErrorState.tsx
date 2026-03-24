import React from 'react'

/** ErrorState variant */
export type ErrorStateVariant = 'default' | 'minimal' | 'illustrated' | 'glass'
/** Error type preset */
export type ErrorStateType = '404' | '500' | '403' | 'offline' | 'maintenance' | 'empty' | 'custom'
/** ErrorState size */
export type ErrorStateSize = 'sm' | 'md' | 'lg' | 'full'

/** Action button configuration */
export interface ErrorStateAction {
  /** Button label */
  label: string
  /** Click handler */
  onClick: () => void
  /** Button visual style */
  variant?: string
}

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Error type preset (determines defaults for title, description, icon) */
  type?: ErrorStateType
  /** Visual variant */
  variant?: ErrorStateVariant
  /** Size preset */
  size?: ErrorStateSize
  /** Custom title (overrides type default) */
  title?: string
  /** Custom description (overrides type default) */
  description?: string
  /** Custom icon or illustration */
  icon?: React.ReactNode
  /** Error code to display */
  code?: string | number
  /** Show large error code */
  showCode?: boolean
  /** Primary action button */
  action?: ErrorStateAction
  /** Secondary action button */
  secondaryAction?: ErrorStateAction
  /** Extra content below the actions */
  children?: React.ReactNode
  /** Center in viewport */
  fullPage?: boolean
  className?: string
  style?: React.CSSProperties
}

/* ── Default content per type ───────────────────────── */

const TYPE_DEFAULTS: Record<ErrorStateType, { title: string; description: string; code?: string }> = {
  '404': {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist or has been moved.',
    code: '404',
  },
  '500': {
    title: 'Server Error',
    description: 'Something went wrong on our end. Please try again later.',
    code: '500',
  },
  '403': {
    title: 'Access Denied',
    description: 'You do not have permission to view this page.',
    code: '403',
  },
  offline: {
    title: 'You Are Offline',
    description: 'Check your internet connection and try again.',
  },
  maintenance: {
    title: 'Under Maintenance',
    description: 'We are currently performing scheduled maintenance. Please check back soon.',
  },
  empty: {
    title: 'Nothing Here Yet',
    description: 'There are no items to display at the moment.',
  },
  custom: {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred.',
  },
}

/* ── Default SVG icons per type ─────────────────────── */

const Icon404 = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
    <path d="M24 34v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 38h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="20" cy="18" r="1.5" fill="currentColor" />
    <circle cx="28" cy="18" r="1.5" fill="currentColor" />
    <path d="M20 25c1 -2 3-3 4-3s3 1 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const Icon500 = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="8" y="10" width="32" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M8 18h32" stroke="currentColor" strokeWidth="2" />
    <circle cx="13" cy="14" r="1" fill="currentColor" />
    <circle cx="17" cy="14" r="1" fill="currentColor" />
    <circle cx="21" cy="14" r="1" fill="currentColor" />
    <path d="M20 28l4-4 4 4M20 32l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Icon403 = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="14" y="22" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M18 22v-6a6 6 0 0 1 12 0v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="30" r="2" fill="currentColor" />
    <path d="M24 32v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const IconOffline = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M12 32a10 10 0 0 1 0-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 29a6 6 0 0 1 0-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M36 32a10 10 0 0 0 0-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 29a6 6 0 0 0 0-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="26" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M8 40L40 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const IconMaintenance = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M28 12l-2 8 6 2 -8 16 2-8-6-2 8-16z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
)

const IconEmpty = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M12 16h24l-3 22H15L12 16z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M8 16h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 24v8M28 24v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconCustom = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
    <path d="M24 16v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="32" r="1.5" fill="currentColor" />
  </svg>
)

const TYPE_ICONS: Record<ErrorStateType, React.ReactNode> = {
  '404': <Icon404 />,
  '500': <Icon500 />,
  '403': <Icon403 />,
  offline: <IconOffline />,
  maintenance: <IconMaintenance />,
  empty: <IconEmpty />,
  custom: <IconCustom />,
}

const ERROR_TYPES: ErrorStateType[] = ['404', '500', '403']

/**
 * Generic error/empty/status page component. Replaces 404, 500, maintenance,
 * and other status pages with a unified, accessible component.
 */
export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      type = 'custom',
      variant = 'default',
      size = 'md',
      title,
      description,
      icon,
      code,
      showCode,
      action,
      secondaryAction,
      children,
      fullPage = false,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const defaults = TYPE_DEFAULTS[type]
    const resolvedTitle = title ?? defaults.title
    const resolvedDescription = description ?? defaults.description
    const resolvedIcon = icon ?? TYPE_ICONS[type]
    const resolvedCode = code ?? defaults.code
    const resolvedShowCode = showCode ?? (ERROR_TYPES.includes(type) && !!resolvedCode)

    const isErrorType = ERROR_TYPES.includes(type)
    const role = isErrorType ? 'alert' : 'status'

    const cls = [
      'ui-error-state',
      `ui-error-state-${variant}`,
      `ui-error-state-${size}`,
      fullPage && 'ui-error-state-fullpage',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={cls} style={style} role={role} {...rest}>
        <div className="ui-error-state-inner">
          {/* Icon */}
          {variant !== 'minimal' && resolvedIcon && (
            <div className="ui-error-state-icon" aria-hidden="true">
              {resolvedIcon}
            </div>
          )}

          {/* Error code */}
          {resolvedShowCode && resolvedCode && (
            <div className="ui-error-state-code" aria-hidden="true">
              {resolvedCode}
            </div>
          )}

          {/* Title */}
          <h2 className="ui-error-state-title">{resolvedTitle}</h2>

          {/* Description */}
          {resolvedDescription && (
            <p className="ui-error-state-description">{resolvedDescription}</p>
          )}

          {/* Actions */}
          {(action || secondaryAction) && (
            <div className="ui-error-state-actions">
              {action && (
                <button
                  type="button"
                  className={[
                    'ui-error-state-btn',
                    'ui-error-state-btn-primary',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              )}
              {secondaryAction && (
                <button
                  type="button"
                  className="ui-error-state-btn ui-error-state-btn-secondary"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}

          {/* Extra content */}
          {children && (
            <div className="ui-error-state-extra">{children}</div>
          )}
        </div>
      </div>
    )
  }
)

ErrorState.displayName = 'ErrorState'
