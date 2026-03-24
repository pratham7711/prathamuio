import React from 'react'

export type ProgressBarVariant = 'accent' | 'success' | 'warning' | 'danger'
export type ProgressBarSize = 'sm' | 'md'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value from 0 to 100 */
  value: number
  /** Color variant */
  variant?: ProgressBarVariant
  /** Size preset */
  size?: ProgressBarSize
  /** Show percentage label */
  showLabel?: boolean
  /** Animate the progress bar fill */
  animated?: boolean
}

/**
 * Progress indicator bar. Displays a horizontal bar filled to the given percentage.
 * Supports 4 color variants and 2 sizes.
 */
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      variant = 'accent',
      size = 'md',
      showLabel = false,
      animated = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const clamped = Math.max(0, Math.min(100, value))

    const cls = [
      'ui-progress',
      `ui-progress-${variant}`,
      `ui-progress-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const barCls = [
      'ui-progress-bar',
      animated ? 'ui-progress-animated' : '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={cls}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
      >
        <div className="ui-progress-track">
          <div
            className={barCls}
            style={{ width: `${clamped}%` }}
          />
        </div>
        {showLabel && (
          <span className="ui-progress-label">{Math.round(clamped)}%</span>
        )}
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'
