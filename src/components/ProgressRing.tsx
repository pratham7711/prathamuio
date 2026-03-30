import React from 'react'

export type ProgressRingVariant = 'accent' | 'success' | 'warning' | 'danger'
export type ProgressRingSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value from 0 to 100 */
  value: number
  /** Color variant */
  variant?: ProgressRingVariant
  /** Size preset */
  size?: ProgressRingSize
  /** Show percentage label in center */
  showLabel?: boolean
  /** Custom label (overrides percentage) */
  label?: React.ReactNode
  /** Stroke width */
  strokeWidth?: number
  /** Animate on mount */
  animated?: boolean
}

const SIZE_MAP: Record<ProgressRingSize, number> = { sm: 48, md: 72, lg: 96, xl: 128 }
const STROKE_MAP: Record<ProgressRingSize, number> = { sm: 4, md: 6, lg: 8, xl: 10 }

/**
 * Circular progress indicator. Renders an SVG ring filled to the given percentage.
 */
export const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  (
    {
      value,
      variant = 'accent',
      size = 'md',
      showLabel = true,
      label,
      strokeWidth,
      animated = true,
      className = '',
      ...rest
    },
    ref
  ) => {
    const clamped = Math.max(0, Math.min(100, value))
    const dim = SIZE_MAP[size]
    const sw = strokeWidth ?? STROKE_MAP[size]
    const radius = (dim - sw) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (clamped / 100) * circumference

    const cls = [
      'ui-ring',
      `ui-ring-${variant}`,
      `ui-ring-${size}`,
      animated ? 'ui-ring-animated' : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={cls} style={{ width: dim, height: dim }} {...rest}>
        <svg className="ui-ring-svg" viewBox={`0 0 ${dim} ${dim}`} width={dim} height={dim}>
          <circle
            className="ui-ring-track"
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            strokeWidth={sw}
          />
          <circle
            className="ui-ring-fill"
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
          />
        </svg>
        {(showLabel || label) && (
          <div className="ui-ring-label">
            {label ?? `${Math.round(clamped)}%`}
          </div>
        )}
      </div>
    )
  }
)
ProgressRing.displayName = 'ProgressRing'
