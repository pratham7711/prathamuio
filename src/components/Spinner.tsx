import React from 'react'

/** Visual animation style */
export type SpinnerVariant = 'ring' | 'dots' | 'pulse' | 'bars' | 'orbit'

/** Size preset */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation variant */
  variant?: SpinnerVariant
  /** Size preset */
  size?: SpinnerSize
  /** Color theme */
  color?: 'accent' | 'white' | 'inherit'
  /** Animation speed */
  speed?: 'slow' | 'normal' | 'fast'
  /** Visually hidden label for screen readers */
  label?: string
  /** Center spinner in parent with semi-transparent backdrop */
  overlay?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Animated loading indicator with multiple visual variants.
 * All animations are pure CSS — no JS animation loops.
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      variant = 'ring',
      size = 'md',
      color = 'accent',
      speed = 'normal',
      label = 'Loading',
      overlay = false,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-spinner',
      `ui-spinner-${variant}`,
      `ui-spinner-${size}`,
      `ui-spinner-color-${color}`,
      `ui-spinner-speed-${speed}`,
      overlay && 'ui-spinner-overlay',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const renderVariant = () => {
      switch (variant) {
        case 'ring':
          return <div className="ui-spinner-ring" />
        case 'dots':
          return (
            <div className="ui-spinner-dots">
              <span className="ui-spinner-dot" />
              <span className="ui-spinner-dot" />
              <span className="ui-spinner-dot" />
            </div>
          )
        case 'pulse':
          return <div className="ui-spinner-pulse-circle" />
        case 'bars':
          return (
            <div className="ui-spinner-bars">
              <span className="ui-spinner-bar" />
              <span className="ui-spinner-bar" />
              <span className="ui-spinner-bar" />
              <span className="ui-spinner-bar" />
            </div>
          )
        case 'orbit':
          return (
            <div className="ui-spinner-orbit">
              <span className="ui-spinner-orbit-dot" />
              <span className="ui-spinner-orbit-dot" />
            </div>
          )
        default:
          return null
      }
    }

    const content = (
      <div
        ref={ref}
        className={cls}
        role="status"
        aria-label={label}
        style={style}
        {...rest}
      >
        {renderVariant()}
        <span className="ui-spinner-sr-only">{label}</span>
      </div>
    )

    if (overlay) {
      return (
        <div className="ui-spinner-overlay-wrapper">
          {content}
        </div>
      )
    }

    return content
  }
)

Spinner.displayName = 'Spinner'
