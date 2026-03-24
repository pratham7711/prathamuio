import React from 'react'

/** Shape of the swatch */
export type ColorSwatchVariant = 'circle' | 'square' | 'rounded'

/** Size preset */
export type ColorSwatchSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ColorSwatchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  /** CSS color value */
  color: string
  /** Shape variant */
  variant?: ColorSwatchVariant
  /** Size preset */
  size?: ColorSwatchSize
  /** Whether this swatch is currently selected */
  selected?: boolean
  /** Click handler */
  onClick?: () => void
  /** Tooltip text (defaults to the color value) */
  label?: string
  /** Show a border around the swatch */
  withBorder?: boolean
  /** Show the color value as text below the swatch */
  withLabel?: boolean
  /** Disabled state */
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * A clickable color swatch for color pickers and palettes.
 * Supports selection state, labels, and multiple shapes.
 */
export const ColorSwatch = React.forwardRef<HTMLButtonElement, ColorSwatchProps>(
  (
    {
      color,
      variant = 'circle',
      size = 'md',
      selected = false,
      onClick,
      label,
      withBorder = false,
      withLabel = false,
      disabled = false,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-color-swatch',
      `ui-color-swatch-${variant}`,
      `ui-color-swatch-${size}`,
      selected && 'ui-color-swatch-selected',
      withBorder && 'ui-color-swatch-bordered',
      disabled && 'ui-color-swatch-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const tooltipText = label || color

    return (
      <div className="ui-color-swatch-wrapper">
        <button
          ref={ref}
          type="button"
          className={cls}
          onClick={disabled ? undefined : onClick}
          disabled={disabled}
          title={tooltipText}
          aria-label={tooltipText}
          style={{
            '--ui-swatch-color': color,
            ...style,
          } as React.CSSProperties}
          {...rest}
        >
          <span className="ui-color-swatch-inner" />
          {selected && (
            <span className="ui-color-swatch-check" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </button>
        {withLabel && (
          <span className="ui-color-swatch-label">{color}</span>
        )}
      </div>
    )
  }
)

ColorSwatch.displayName = 'ColorSwatch'

/** Gap between swatches in a group */
export type ColorSwatchGroupGap = 'sm' | 'md' | 'lg'

export interface ColorSwatchGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of CSS color values */
  colors: string[]
  /** Currently selected color (controlled) */
  value?: string
  /** Callback when a color is selected */
  onChange?: (color: string) => void
  /** Shape variant for all swatches */
  variant?: ColorSwatchVariant
  /** Size preset for all swatches */
  size?: ColorSwatchSize
  /** Number of grid columns (defaults to auto-fit) */
  columns?: number
  /** Gap between swatches */
  gap?: ColorSwatchGroupGap
  className?: string
  style?: React.CSSProperties
}

/**
 * A group of selectable color swatches arranged in a grid.
 * Manages selection state and provides radiogroup semantics.
 */
export const ColorSwatchGroup = React.forwardRef<HTMLDivElement, ColorSwatchGroupProps>(
  (
    {
      colors,
      value,
      onChange,
      variant = 'circle',
      size = 'md',
      columns,
      gap = 'md',
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-color-swatch-group',
      `ui-color-swatch-group-gap-${gap}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const gridStyle: React.CSSProperties = {
      ...style,
      ...(columns
        ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
        : { gridTemplateColumns: 'repeat(auto-fit, minmax(0, max-content))' }),
    }

    return (
      <div
        ref={ref}
        className={cls}
        role="radiogroup"
        aria-label="Color selection"
        style={gridStyle}
        {...rest}
      >
        {colors.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            variant={variant}
            size={size}
            selected={value === color}
            onClick={() => onChange?.(color)}
            role="radio"
            aria-checked={value === color}
          />
        ))}
      </div>
    )
  }
)

ColorSwatchGroup.displayName = 'ColorSwatchGroup'
