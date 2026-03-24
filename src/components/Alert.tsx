import React from 'react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Color variant */
  variant: AlertVariant
  /** Optional title */
  title?: string
  /** Alert body content */
  children?: React.ReactNode
  /** Close handler — renders close button when provided */
  onClose?: () => void
  /** Optional icon rendered before content */
  icon?: React.ReactNode
}

/**
 * Alert / notification banner. Supports 4 semantic variants with optional
 * title, icon, and close button. Fully accessible with ARIA role.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant,
      title,
      children,
      onClose,
      icon,
      className = '',
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-alert',
      `ui-alert-${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={cls}
        role="alert"
        {...rest}
      >
        {icon && <span className="ui-alert-icon" aria-hidden="true">{icon}</span>}
        <div className="ui-alert-content">
          {title && <div className="ui-alert-title">{title}</div>}
          {children && <div className="ui-alert-body">{children}</div>}
        </div>
        {onClose && (
          <button
            className="ui-alert-close"
            onClick={onClose}
            aria-label="Close alert"
            type="button"
          >
            &#x2715;
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = 'Alert'
