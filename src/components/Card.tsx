import React from 'react'

export type CardVariant = 'glass' | 'solid' | 'outlined'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style */
  variant?: CardVariant
  /** Makes the card clickable with pointer cursor and stronger hover */
  clickable?: boolean
  /** Padding applied to card body (pass false to remove padding) */
  noPadding?: boolean
  children?: React.ReactNode
}

/**
 * Versatile container card. Supports glass, solid, and outlined variants.
 * Use `clickable` to add pointer cursor + stronger hover lift.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'glass',
      clickable = false,
      noPadding = false,
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-card',
      `ui-card-${variant}`,
      clickable ? 'ui-card-clickable' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={cls}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && rest.onClick) {
                  rest.onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
                }
              }
            : undefined
        }
        {...rest}
      >
        {noPadding ? children : <div className="ui-card-body">{children}</div>}
      </div>
    )
  }
)

Card.displayName = 'Card'
