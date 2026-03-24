import React, { useState, useCallback, useRef } from 'react'

/** Visual variant for rating icons */
export type RatingVariant = 'star' | 'heart' | 'circle' | 'custom'

/** Size preset for rating */
export type RatingSize = 'sm' | 'md' | 'lg' | 'xl'

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled value */
  value?: number
  /** Default value for uncontrolled mode */
  defaultValue?: number
  /** Called when rating changes */
  onChange?: (value: number) => void
  /** Visual variant */
  variant?: RatingVariant
  /** Size preset */
  size?: RatingSize
  /** Maximum number of items */
  max?: number
  /** Half-star or full precision */
  precision?: 0.5 | 1
  /** Read-only mode */
  readOnly?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Custom filled icon for 'custom' variant */
  icon?: React.ReactNode
  /** Custom empty icon */
  emptyIcon?: React.ReactNode
  /** Show hover preview */
  highlightOnHover?: boolean
  /** Accessible label */
  label?: string
}

const StarSVG: React.FC<{ filled: boolean; half: boolean }> = ({ filled, half }) => (
  <svg viewBox="0 0 24 24" className="ui-rating-svg" aria-hidden="true">
    {half && (
      <defs>
        <linearGradient id="half-star">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
    )}
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={filled ? 'currentColor' : half ? 'url(#half-star)' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

const HeartSVG: React.FC<{ filled: boolean; half: boolean }> = ({ filled, half }) => (
  <svg viewBox="0 0 24 24" className="ui-rating-svg" aria-hidden="true">
    {half && (
      <defs>
        <linearGradient id="half-heart">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
    )}
    <path
      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
      fill={filled ? 'currentColor' : half ? 'url(#half-heart)' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

const CircleSVG: React.FC<{ filled: boolean; half: boolean }> = ({ filled, half }) => (
  <svg viewBox="0 0 24 24" className="ui-rating-svg" aria-hidden="true">
    {half && (
      <defs>
        <linearGradient id="half-circle">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
    )}
    <circle
      cx="12"
      cy="12"
      r="10"
      fill={filled ? 'currentColor' : half ? 'url(#half-circle)' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
)

/**
 * Rating component with star, heart, circle, or custom icon variants.
 * Supports half-precision, hover preview, keyboard navigation, and full ARIA.
 */
export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      variant = 'star',
      size = 'md',
      max = 5,
      precision = 1,
      readOnly = false,
      disabled = false,
      icon,
      emptyIcon,
      highlightOnHover = true,
      label,
      className = '',
      ...rest
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue)
    const [hoverValue, setHoverValue] = useState<number | null>(null)
    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : internalValue
    const displayValue = highlightOnHover && hoverValue !== null ? hoverValue : currentValue
    const itemRefs = useRef<(HTMLSpanElement | null)[]>([])

    const setValue = useCallback(
      (v: number) => {
        if (readOnly || disabled) return
        if (!isControlled) setInternalValue(v)
        onChange?.(v)
      },
      [readOnly, disabled, isControlled, onChange]
    )

    const handleMouseMove = useCallback(
      (e: React.MouseEvent, index: number) => {
        if (readOnly || disabled || !highlightOnHover) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        if (precision === 0.5 && x < rect.width / 2) {
          setHoverValue(index + 0.5)
        } else {
          setHoverValue(index + 1)
        }
      },
      [readOnly, disabled, highlightOnHover, precision]
    )

    const handleMouseLeave = useCallback(() => {
      setHoverValue(null)
    }, [])

    const handleClick = useCallback(
      (e: React.MouseEvent, index: number) => {
        if (readOnly || disabled) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        if (precision === 0.5 && x < rect.width / 2) {
          setValue(index + 0.5)
        } else {
          setValue(index + 1)
        }
      },
      [readOnly, disabled, precision, setValue]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (readOnly || disabled) return
        let newValue = currentValue
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault()
          newValue = Math.min(currentValue + precision, max)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault()
          newValue = Math.max(currentValue - precision, 0)
        } else if (e.key === 'Home') {
          e.preventDefault()
          newValue = 0
        } else if (e.key === 'End') {
          e.preventDefault()
          newValue = max
        } else {
          return
        }
        setValue(newValue)
        // Focus the appropriate item
        const focusIndex = Math.max(0, Math.ceil(newValue) - 1)
        itemRefs.current[focusIndex]?.focus()
      },
      [readOnly, disabled, currentValue, precision, max, setValue]
    )

    const getIcon = (index: number) => {
      const filled = displayValue >= index + 1
      const half = !filled && displayValue >= index + 0.5

      if (variant === 'custom') {
        if (filled || half) return icon || <StarSVG filled={filled} half={half} />
        return emptyIcon || icon || <StarSVG filled={false} half={false} />
      }

      if (filled && emptyIcon === undefined) {
        switch (variant) {
          case 'heart': return <HeartSVG filled half={false} />
          case 'circle': return <CircleSVG filled half={false} />
          default: return <StarSVG filled half={false} />
        }
      }

      if (half) {
        switch (variant) {
          case 'heart': return <HeartSVG filled={false} half />
          case 'circle': return <CircleSVG filled={false} half />
          default: return <StarSVG filled={false} half />
        }
      }

      if (emptyIcon) return emptyIcon
      switch (variant) {
        case 'heart': return <HeartSVG filled={false} half={false} />
        case 'circle': return <CircleSVG filled={false} half={false} />
        default: return <StarSVG filled={false} half={false} />
      }
    }

    const cls = [
      'ui-rating',
      `ui-rating-${variant}`,
      `ui-rating-${size}`,
      readOnly && 'ui-rating-readonly',
      disabled && 'ui-rating-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const interactive = !readOnly && !disabled

    return (
      <div
        ref={ref}
        className={cls}
        role="radiogroup"
        aria-label={label || 'Rating'}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {Array.from({ length: max }, (_, i) => {
          const itemValue = i + 1
          const isChecked = currentValue >= itemValue || (currentValue >= i + 0.5 && precision === 0.5)
          const itemCls = [
            'ui-rating-item',
            displayValue >= itemValue && 'ui-rating-item-filled',
            displayValue >= i + 0.5 && displayValue < itemValue && 'ui-rating-item-half',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <span
              key={i}
              ref={(el) => { itemRefs.current[i] = el }}
              className={itemCls}
              role="radio"
              aria-checked={isChecked}
              aria-label={`${itemValue} of ${max}`}
              tabIndex={interactive ? (Math.ceil(currentValue) - 1 === i || (currentValue === 0 && i === 0) ? 0 : -1) : undefined}
              onMouseMove={interactive ? (e) => handleMouseMove(e, i) : undefined}
              onClick={interactive ? (e) => handleClick(e, i) : undefined}
              onKeyDown={interactive ? handleKeyDown : undefined}
            >
              {getIcon(i)}
            </span>
          )
        })}
      </div>
    )
  }
)

Rating.displayName = 'Rating'
