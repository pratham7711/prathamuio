import React, { useId } from 'react'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field label */
  label?: string
  /** Error message shown below input */
  error?: string
  /** Icon rendered on the left */
  iconLeft?: React.ReactNode
  /** Icon rendered on the right */
  iconRight?: React.ReactNode
  /** Show character count (requires maxLength) */
  showCount?: boolean
  /** Size preset */
  size?: InputSize
}

/**
 * Text input with optional label, error state, icons, and character count.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      iconLeft,
      iconRight,
      showCount = false,
      size = 'md',
      className = '',
      id: propId,
      maxLength,
      value,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const id = propId ?? generatedId

    const rootCls = [
      'ui-input-root',
      error ? 'ui-input-error' : '',
    ]
      .filter(Boolean)
      .join(' ')

    const inputCls = [
      'ui-input',
      `ui-input-${size}`,
      iconLeft ? 'ui-input-with-left' : '',
      iconRight ? 'ui-input-with-right' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className={rootCls}>
        {label && (
          <label htmlFor={id} className="ui-input-label">
            {label}
          </label>
        )}
        <div className="ui-input-wrap">
          {iconLeft && (
            <span className="ui-input-icon-left" aria-hidden="true">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={inputCls}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            maxLength={maxLength}
            value={value}
            {...rest}
          />
          {iconRight && (
            <span className="ui-input-icon-right" aria-hidden="true">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <span id={`${id}-error`} className="ui-input-error-msg" role="alert">
            {error}
          </span>
        )}
        {showCount && maxLength && (
          <span className="ui-input-count" aria-live="polite">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
