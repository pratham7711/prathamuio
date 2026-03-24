import React from 'react'

/** Visual style of the divider line */
export type DividerVariant = 'solid' | 'dashed' | 'dotted' | 'gradient'

/** Thickness of the divider */
export type DividerSize = 'sm' | 'md' | 'lg'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: DividerVariant
  /** Thickness preset */
  size?: DividerSize
  /** Horizontal or vertical orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Optional label displayed in the middle of the divider */
  label?: string
  /** Position of the label along the divider */
  labelPosition?: 'start' | 'center' | 'end'
  /** Custom color override for the divider line */
  color?: string
  /** Vertical spacing above and below (horizontal) or horizontal spacing (vertical) */
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

/**
 * A visual separator between content sections.
 * Supports horizontal/vertical orientation, labeled dividers, and gradient fade effects.
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      orientation = 'horizontal',
      label,
      labelPosition = 'center',
      color,
      spacing = 'md',
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-divider',
      `ui-divider-${variant}`,
      `ui-divider-${size}`,
      `ui-divider-${orientation}`,
      `ui-divider-spacing-${spacing}`,
      label && 'ui-divider-with-label',
      label && `ui-divider-label-${labelPosition}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const colorStyle: React.CSSProperties = {
      ...style,
      ...(color ? { '--ui-divider-color': color } as React.CSSProperties : {}),
    }

    return (
      <div
        ref={ref}
        className={cls}
        role="separator"
        aria-orientation={orientation}
        style={colorStyle}
        {...rest}
      >
        {label && orientation === 'horizontal' && (
          <span className="ui-divider-label">{label}</span>
        )}
      </div>
    )
  }
)

Divider.displayName = 'Divider'
