import React, { useId, useRef, useEffect } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Field label */
  label?: string
  /** Error message shown below */
  error?: string
  /** Automatically resize to content height */
  autoResize?: boolean
  /** Show character count (requires maxLength) */
  showCount?: boolean
}

/**
 * Multi-line text input with optional auto-resize, label, error state, and character count.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      autoResize = false,
      showCount = false,
      className = '',
      id: propId,
      maxLength,
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const id = propId ?? generatedId
    const innerRef = useRef<HTMLTextAreaElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? innerRef

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize && resolvedRef.current) {
        resolvedRef.current.style.height = 'auto'
        resolvedRef.current.style.height = resolvedRef.current.scrollHeight + 'px'
      }
      onChange?.(e)
    }

    useEffect(() => {
      if (autoResize && resolvedRef.current) {
        resolvedRef.current.style.height = 'auto'
        resolvedRef.current.style.height = resolvedRef.current.scrollHeight + 'px'
      }
    }, [value, autoResize, resolvedRef])

    const rootCls = ['ui-input-root', error ? 'ui-textarea-error' : ''].filter(Boolean).join(' ')
    const textareaCls = [
      'ui-textarea',
      autoResize ? 'ui-textarea-auto' : '',
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
        <textarea
          ref={resolvedRef}
          id={id}
          className={textareaCls}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          {...rest}
        />
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

Textarea.displayName = 'Textarea'
