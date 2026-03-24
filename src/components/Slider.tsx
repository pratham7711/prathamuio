import React, { useState, useRef, useCallback } from 'react'

/** Slider visual variant */
export type SliderVariant = 'default' | 'accent' | 'gradient'
/** Slider size preset */
export type SliderSize = 'sm' | 'md' | 'lg'

/** Mark definition for the slider track */
export interface SliderMark {
  value: number
  label?: string
}

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Current value (single or range) */
  value?: number | [number, number]
  /** Default value (uncontrolled) */
  defaultValue?: number | [number, number]
  /** Called when value changes */
  onChange?: (value: number | [number, number]) => void
  /** Visual style variant */
  variant?: SliderVariant
  /** Size preset */
  size?: SliderSize
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Show marks along the track */
  marks?: boolean | SliderMark[]
  /** Show value tooltip on hover/drag */
  showTooltip?: boolean | 'always'
  /** Show current value as text */
  showValue?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Label text */
  label?: string
  /** Format the displayed value */
  formatValue?: (value: number) => string
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

function roundToStep(val: number, min: number, step: number): number {
  const steps = Math.round((val - min) / step)
  return min + steps * step
}

/**
 * Slider component with single and range modes, custom track and thumb,
 * marks, tooltip, and full keyboard/ARIA support.
 */
export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 50,
      onChange,
      variant = 'default',
      size = 'md',
      min = 0,
      max = 100,
      step = 1,
      marks,
      showTooltip = false,
      showValue = false,
      disabled = false,
      label,
      formatValue = (v) => String(v),
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const trackRef = useRef<HTMLDivElement>(null)
    const draggingThumb = useRef<'single' | 'start' | 'end' | null>(null)
    const [hovered, setHovered] = useState<'single' | 'start' | 'end' | null>(null)

    const isRange = Array.isArray(controlledValue) || Array.isArray(defaultValue)

    const [internalValue, setInternalValue] = useState<number | [number, number]>(
      defaultValue
    )
    const currentValue = controlledValue !== undefined ? controlledValue : internalValue

    const singleVal = typeof currentValue === 'number' ? currentValue : 0
    const rangeVal: [number, number] = Array.isArray(currentValue)
      ? currentValue
      : [0, 0]

    const setValue = useCallback(
      (newVal: number | [number, number]) => {
        if (controlledValue === undefined) setInternalValue(newVal)
        onChange?.(newVal)
      },
      [controlledValue, onChange]
    )

    const getPercentage = (val: number) => ((val - min) / (max - min)) * 100

    const getValueFromPosition = useCallback(
      (clientX: number) => {
        const track = trackRef.current
        if (!track) return min
        const rect = track.getBoundingClientRect()
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
        const raw = min + ratio * (max - min)
        return clamp(roundToStep(raw, min, step), min, max)
      },
      [min, max, step]
    )

    const handlePointerDown = useCallback(
      (e: React.PointerEvent, thumb: 'single' | 'start' | 'end') => {
        if (disabled) return
        e.preventDefault()
        e.stopPropagation()
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        draggingThumb.current = thumb
      },
      [disabled]
    )

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!draggingThumb.current || disabled) return
        const newVal = getValueFromPosition(e.clientX)

        if (!isRange) {
          setValue(newVal)
        } else {
          const [s, en] = rangeVal
          if (draggingThumb.current === 'start') {
            setValue([Math.min(newVal, en), en])
          } else {
            setValue([s, Math.max(newVal, s)])
          }
        }
      },
      [disabled, getValueFromPosition, isRange, rangeVal, setValue]
    )

    const handlePointerUp = useCallback(() => {
      draggingThumb.current = null
    }, [])

    const handleTrackClick = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return
        const target = e.target as HTMLElement
        if (target.closest('.ui-slider-thumb')) return

        const newVal = getValueFromPosition(e.clientX)
        if (!isRange) {
          setValue(newVal)
        } else {
          const [s, en] = rangeVal
          const distToStart = Math.abs(newVal - s)
          const distToEnd = Math.abs(newVal - en)
          if (distToStart <= distToEnd) {
            setValue([Math.min(newVal, en), en])
          } else {
            setValue([s, Math.max(newVal, s)])
          }
        }
      },
      [disabled, getValueFromPosition, isRange, rangeVal, setValue]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, thumb: 'single' | 'start' | 'end') => {
        if (disabled) return
        let delta = 0
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step
        else if (e.key === 'Home') {
          e.preventDefault()
          if (!isRange) { setValue(min); return }
          if (thumb === 'start') setValue([min, rangeVal[1]])
          else setValue([rangeVal[0], Math.max(min, rangeVal[0])])
          return
        } else if (e.key === 'End') {
          e.preventDefault()
          if (!isRange) { setValue(max); return }
          if (thumb === 'end') setValue([rangeVal[0], max])
          else setValue([Math.min(max, rangeVal[1]), rangeVal[1]])
          return
        } else return

        e.preventDefault()
        if (!isRange) {
          setValue(clamp(singleVal + delta, min, max))
        } else {
          const [s, en] = rangeVal
          if (thumb === 'start') {
            const ns = clamp(s + delta, min, en)
            setValue([ns, en])
          } else {
            const ne = clamp(en + delta, s, max)
            setValue([s, ne])
          }
        }
      },
      [disabled, step, min, max, isRange, singleVal, rangeVal, setValue]
    )

    // Generate mark positions
    const markItems: SliderMark[] = React.useMemo(() => {
      if (!marks) return []
      if (Array.isArray(marks)) return marks
      // Boolean true: generate marks at each step (max 20)
      const count = Math.min(Math.floor((max - min) / step) + 1, 21)
      const items: SliderMark[] = []
      for (let i = 0; i < count; i++) {
        items.push({ value: min + i * step })
      }
      return items
    }, [marks, min, max, step])

    const tooltipVisible = (thumb: 'single' | 'start' | 'end') =>
      showTooltip === 'always' ||
      (showTooltip && (draggingThumb.current === thumb || hovered === thumb))

    const cls = [
      'ui-slider',
      `ui-slider-${variant}`,
      `ui-slider-${size}`,
      disabled && 'ui-slider-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const renderThumb = (
      val: number,
      thumb: 'single' | 'start' | 'end'
    ) => (
      <div
        className="ui-slider-thumb"
        style={{ left: `${getPercentage(val)}%` }}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={val}
        aria-valuetext={formatValue(val)}
        aria-label={label ? `${label} ${thumb !== 'single' ? thumb : ''}`.trim() : undefined}
        aria-disabled={disabled}
        onPointerDown={(e) => handlePointerDown(e, thumb)}
        onKeyDown={(e) => handleKeyDown(e, thumb)}
        onMouseEnter={() => setHovered(thumb)}
        onMouseLeave={() => setHovered(null)}
      >
        {tooltipVisible(thumb) && (
          <span className="ui-slider-tooltip">{formatValue(val)}</span>
        )}
      </div>
    )

    const fillStyle = isRange
      ? {
          left: `${getPercentage(rangeVal[0])}%`,
          width: `${getPercentage(rangeVal[1]) - getPercentage(rangeVal[0])}%`,
        }
      : {
          left: '0%',
          width: `${getPercentage(singleVal)}%`,
        }

    return (
      <div ref={ref} className={cls} style={style} {...rest}>
        {(label || showValue) && (
          <div className="ui-slider-header">
            {label && <label className="ui-slider-label">{label}</label>}
            {showValue && (
              <span className="ui-slider-value">
                {isRange
                  ? `${formatValue(rangeVal[0])} - ${formatValue(rangeVal[1])}`
                  : formatValue(singleVal)}
              </span>
            )}
          </div>
        )}
        <div
          ref={trackRef}
          className="ui-slider-track"
          onClick={handleTrackClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="ui-slider-fill" style={fillStyle} />
          {markItems.length > 0 && (
            <div className="ui-slider-marks">
              {markItems.map((m) => (
                <div
                  key={m.value}
                  className="ui-slider-mark"
                  style={{ left: `${getPercentage(m.value)}%` }}
                >
                  <span className="ui-slider-mark-dot" />
                  {m.label && <span className="ui-slider-mark-label">{m.label}</span>}
                </div>
              ))}
            </div>
          )}
          {isRange ? (
            <>
              {renderThumb(rangeVal[0], 'start')}
              {renderThumb(rangeVal[1], 'end')}
            </>
          ) : (
            renderThumb(singleVal, 'single')
          )}
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'
