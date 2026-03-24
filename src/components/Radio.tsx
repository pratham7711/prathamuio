import React, { useId, useContext, createContext, useCallback } from 'react'

/** Radio visual variant */
export type RadioVariant = 'default' | 'filled' | 'card'
/** Radio size preset */
export type RadioSize = 'sm' | 'md' | 'lg'

interface RadioGroupContextValue {
  name: string
  value?: string
  onChange?: (value: string) => void
  variant: RadioVariant
  size: RadioSize
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Name attribute for all radios in the group */
  name: string
  /** Controlled selected value */
  value?: string
  /** Default selected value (uncontrolled) */
  defaultValue?: string
  /** Called when selection changes */
  onChange?: (value: string) => void
  /** Visual style variant */
  variant?: RadioVariant
  /** Size preset */
  size?: RadioSize
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical'
  /** Error message for the group */
  error?: string
  /** Group label */
  label?: string
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
  /** Radio children */
  children: React.ReactNode
}

/**
 * RadioGroup provides context to Radio children. Supports controlled and uncontrolled modes,
 * horizontal/vertical layout, and card variant. ARIA radiogroup role with keyboard navigation.
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      defaultValue,
      onChange,
      variant = 'default',
      size = 'md',
      orientation = 'vertical',
      error,
      label,
      className,
      style,
      children,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const labelId = label ? `${generatedId}-label` : undefined
    const errorId = error ? `${generatedId}-error` : undefined

    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')
    const currentValue = value !== undefined ? value : internalValue

    const handleChange = useCallback(
      (val: string) => {
        if (value === undefined) setInternalValue(val)
        onChange?.(val)
      },
      [value, onChange]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const radios = Array.from(
          (e.currentTarget as HTMLElement).querySelectorAll<HTMLInputElement>(
            'input[type="radio"]:not(:disabled)'
          )
        )
        if (!radios.length) return

        const currentIndex = radios.findIndex((r) => r.value === currentValue)
        let nextIndex = -1

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault()
          nextIndex = currentIndex < radios.length - 1 ? currentIndex + 1 : 0
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault()
          nextIndex = currentIndex > 0 ? currentIndex - 1 : radios.length - 1
        }

        if (nextIndex >= 0) {
          const nextRadio = radios[nextIndex]
          nextRadio.focus()
          handleChange(nextRadio.value)
        }
      },
      [currentValue, handleChange]
    )

    const cls = [
      'ui-radio-group',
      `ui-radio-group-${orientation}`,
      `ui-radio-group-${variant}`,
      `ui-radio-group-${size}`,
      error && 'ui-radio-group-error',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={cls}
        style={style}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={errorId}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {label && (
          <span id={labelId} className="ui-radio-group-label">
            {label}
          </span>
        )}
        <RadioGroupContext.Provider
          value={{ name, value: currentValue, onChange: handleChange, variant, size }}
        >
          <div className="ui-radio-group-items">{children}</div>
        </RadioGroupContext.Provider>
        {error && (
          <span id={errorId} className="ui-radio-group-error-msg" role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Value of this radio option */
  value: string
  /** Label text */
  label?: string
  /** Helper text below the label */
  description?: string
  /** Disabled state */
  disabled?: boolean
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * Radio component. Must be used within a RadioGroup.
 * Hidden native input + custom styled circle with animated inner dot.
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      label,
      description,
      disabled,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const ctx = useContext(RadioGroupContext)
    const generatedId = useId()

    if (!ctx) {
      throw new Error('Radio must be used within a RadioGroup')
    }

    const { name, value: groupValue, onChange, variant, size } = ctx
    const isChecked = groupValue === value

    const handleChange = () => {
      if (!disabled) onChange?.(value)
    }

    const cls = [
      'ui-radio',
      `ui-radio-${variant}`,
      `ui-radio-${size}`,
      isChecked && 'ui-radio-checked',
      disabled && 'ui-radio-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <label className={cls} style={style} htmlFor={generatedId}>
        <span className="ui-radio-input-wrap">
          <input
            ref={ref}
            type="radio"
            id={generatedId}
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className="ui-radio-native"
            tabIndex={isChecked ? 0 : -1}
            {...rest}
          />
          <span className="ui-radio-circle" aria-hidden="true">
            <span className="ui-radio-dot" />
          </span>
        </span>
        {(label || description) && (
          <span className="ui-radio-text">
            {label && <span className="ui-radio-label-text">{label}</span>}
            {description && (
              <span className="ui-radio-description">{description}</span>
            )}
          </span>
        )}
      </label>
    )
  }
)

Radio.displayName = 'Radio'
