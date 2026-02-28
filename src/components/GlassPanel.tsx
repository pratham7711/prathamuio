import React from 'react'

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable accent glow border effect */
  glow?: boolean
  /** Remove default padding */
  noPadding?: boolean
  children?: React.ReactNode
}

/**
 * Frosted-glass container panel.
 * Use `glow` to add the accent-colored glow border effect.
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ glow = false, noPadding = false, className = '', children, style, ...rest }, ref) => {
    const cls = [
      'ui-glass-panel',
      glow ? 'ui-glass-panel-glow' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={cls}
        style={noPadding ? { padding: 0, ...style } : style}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'
