import React, { useId } from 'react'

export type ToggleSize = 'sm' | 'md'

export interface ToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Whether the toggle is on */
  checked: boolean
  /** Called when toggled */
  onChange: (checked: boolean) => void
  /** Optional label text */
  label?: string
  /** Size preset */
  size?: ToggleSize
  /** Disabled state */
  disabled?: boolean
}

/**
 * Toggle switch component. Accessible via hidden checkbox with label association.
 * Supports 2 sizes and disabled state.
 */
export const Toggle = React.forwardRef<HTMLDivElement, ToggleProps>(
  (
    {
      checked,
      onChange,
      label,
      size = 'md',
      disabled = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const id = useId()

    const cls = [
      'ui-toggle',
      `ui-toggle-${size}`,
      checked ? 'ui-toggle-checked' : '',
      disabled ? 'ui-toggle-disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const handleClick = () => {
      if (!disabled) onChange(!checked)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (!disabled) onChange(!checked)
      }
    }

    return (
      <div ref={ref} className={cls} {...rest}>
        <button
          type="button"
          role="switch"
          id={id}
          aria-checked={checked}
          aria-disabled={disabled}
          className="ui-toggle-track"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
        >
          <span className="ui-toggle-thumb" />
        </button>
        {label && (
          <label className="ui-toggle-label" htmlFor={id}>
            {label}
          </label>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'
