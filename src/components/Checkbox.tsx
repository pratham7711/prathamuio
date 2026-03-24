import React, { useId, useRef, useEffect } from 'react'

/** Checkbox visual variant */
export type CheckboxVariant = 'default' | 'filled' | 'outlined'
/** Checkbox size preset */
export type CheckboxSize = 'sm' | 'md' | 'lg'
/** Checkbox color option */
export type CheckboxColor = 'accent' | 'success' | 'warning' | 'danger'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Visual style variant */
  variant?: CheckboxVariant
  /** Size preset */
  size?: CheckboxSize
  /** Label text displayed next to checkbox */
  label?: string
  /** Helper text below the label */
  description?: string
  /** Error message shown below checkbox */
  error?: string
  /** Display indeterminate state (dash icon) */
  indeterminate?: boolean
  /** Color theme for the checkbox */
  color?: CheckboxColor
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * Checkbox component with custom styled box, SVG checkmark animation,
 * indeterminate state, and full accessibility support via hidden native input.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      variant = 'default',
      size = 'md',
      label,
      description,
      error,
      indeterminate = false,
      color = 'accent',
      className,
      style,
      disabled,
      id: propId,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const id = propId ?? generatedId
    const internalRef = useRef<HTMLInputElement | null>(null)

    const descriptionId = description ? `${id}-description` : undefined
    const errorId = error ? `${id}-error` : undefined
    const describedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined

    useEffect(() => {
      const input = internalRef.current
      if (input) {
        input.indeterminate = indeterminate
      }
    }, [indeterminate])

    const setRefs = (el: HTMLInputElement | null) => {
      internalRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el
    }

    const rootCls = [
      'ui-checkbox',
      `ui-checkbox-${variant}`,
      `ui-checkbox-${size}`,
      `ui-checkbox-color-${color}`,
      error && 'ui-checkbox-error',
      disabled && 'ui-checkbox-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={rootCls} style={style}>
        <label className="ui-checkbox-label" htmlFor={id}>
          <span className="ui-checkbox-input-wrap">
            <input
              ref={setRefs}
              type="checkbox"
              id={id}
              className="ui-checkbox-native"
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={describedBy}
              {...rest}
            />
            <span className="ui-checkbox-box" aria-hidden="true">
              <svg className="ui-checkbox-check" viewBox="0 0 16 16" fill="none">
                <polyline
                  points="3.5 8.5 6.5 11.5 12.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className="ui-checkbox-indeterminate" viewBox="0 0 16 16" fill="none">
                <line
                  x1="4"
                  y1="8"
                  x2="12"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
          {(label || description) && (
            <span className="ui-checkbox-text">
              {label && <span className="ui-checkbox-label-text">{label}</span>}
              {description && (
                <span id={descriptionId} className="ui-checkbox-description">
                  {description}
                </span>
              )}
            </span>
          )}
        </label>
        {error && (
          <span id={errorId} className="ui-checkbox-error-msg" role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
