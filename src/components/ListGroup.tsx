import React from 'react'

/** ListGroup visual variant */
export type ListGroupVariant = 'default' | 'bordered' | 'flush' | 'glass'
/** ListGroup size preset */
export type ListGroupSize = 'sm' | 'md' | 'lg'

export interface ListGroupProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Visual style variant */
  variant?: ListGroupVariant
  /** Size preset */
  size?: ListGroupSize
  /** Lay out items horizontally */
  horizontal?: boolean
  /** List items */
  children: React.ReactNode
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

export interface ListGroupItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Highlight as the active item */
  active?: boolean
  /** Disable interactions */
  disabled?: boolean
  /** Click handler (makes the item interactive) */
  onClick?: () => void
  /** Icon rendered before content */
  icon?: React.ReactNode
  /** Badge rendered at the end */
  badge?: React.ReactNode
  /** Item content */
  children: React.ReactNode
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * ListGroup item component. Renders as an interactive button-like element when onClick is provided.
 * Supports active state, icons, and badges.
 */
export const ListGroupItem = React.forwardRef<HTMLLIElement, ListGroupItemProps>(
  (
    {
      active = false,
      disabled = false,
      onClick,
      icon,
      badge,
      children,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const isClickable = !!onClick && !disabled

    const cls = [
      'ui-listgroup-item',
      active && 'ui-listgroup-item-active',
      disabled && 'ui-listgroup-item-disabled',
      isClickable && 'ui-listgroup-item-clickable',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick!()
      }
    }

    return (
      <li
        ref={ref}
        className={cls}
        style={style}
        role={isClickable ? 'button' : 'listitem'}
        tabIndex={isClickable ? 0 : undefined}
        aria-disabled={disabled || undefined}
        aria-current={active || undefined}
        onClick={isClickable ? onClick : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        {...rest}
      >
        {icon && <span className="ui-listgroup-icon" aria-hidden="true">{icon}</span>}
        <span className="ui-listgroup-content">{children}</span>
        {badge && <span className="ui-listgroup-badge">{badge}</span>}
      </li>
    )
  }
)

ListGroupItem.displayName = 'ListGroupItem'

/**
 * ListGroup component for displaying a list of related items.
 * Supports 4 variants, 3 sizes, and horizontal layout.
 * Compound pattern: wrap ListGroupItem children.
 */
export const ListGroup = React.forwardRef<HTMLUListElement, ListGroupProps>(
  (
    {
      variant = 'default',
      size = 'md',
      horizontal = false,
      children,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-listgroup',
      variant && `ui-listgroup-${variant}`,
      size && `ui-listgroup-${size}`,
      horizontal && 'ui-listgroup-horizontal',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <ul
        ref={ref}
        className={cls}
        style={style}
        role="list"
        {...rest}
      >
        {children}
      </ul>
    )
  }
)

ListGroup.displayName = 'ListGroup'
