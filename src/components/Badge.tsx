import React from 'react'

export type BadgeVariant = 'accent' | 'success' | 'warning' | 'danger' | 'neutral'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color variant */
  variant?: BadgeVariant
  /** Size preset */
  size?: BadgeSize
  /** Renders an outlined (transparent bg) version */
  outlined?: boolean
  /** Show a status dot before the label */
  dot?: boolean
  children?: React.ReactNode
}

/**
 * Small label for status, categories, or counts.
 * Use `dot` for a status indicator. Use `outlined` for a softer look.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'accent',
  size = 'md',
  outlined = false,
  dot = false,
  className = '',
  children,
  ...rest
}) => {
  const cls = [
    'ui-badge',
    `ui-badge-${variant}`,
    `ui-badge-${size}`,
    outlined ? 'ui-badge-outlined' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={cls} {...rest}>
      {dot && <span className="ui-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  )
}
