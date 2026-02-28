import React from 'react'

/** Button variant */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glow'
/** Button size */
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button */
  variant?: ButtonVariant
  /** Size preset */
  size?: ButtonSize
  /** Show loading spinner instead of content */
  loading?: boolean
  /** Icon rendered before label */
  iconLeft?: React.ReactNode
  /** Icon rendered after label */
  iconRight?: React.ReactNode
  /** Full-width button */
  fullWidth?: boolean
  children?: React.ReactNode
}

/**
 * Primary interactive element. Supports 5 variants and 3 sizes.
 * Fully accessible: forwards all button HTML attributes.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      className = '',
      children,
      style,
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-btn',
      `ui-btn-${variant}`,
      `ui-btn-${size}`,
      loading ? 'ui-btn-loading' : '',
      fullWidth ? 'ui-btn-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={cls}
        disabled={disabled || loading}
        aria-busy={loading}
        style={{ width: fullWidth ? '100%' : undefined, ...style }}
        {...rest}
      >
        {loading ? (
          <span className="ui-btn-spinner" aria-hidden="true" />
        ) : (
          <>
            {iconLeft && <span className="ui-btn-icon" aria-hidden="true">{iconLeft}</span>}
            {children}
            {iconRight && <span className="ui-btn-icon" aria-hidden="true">{iconRight}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
