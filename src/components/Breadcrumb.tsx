import React from 'react'

export interface BreadcrumbItem {
  /** Display label */
  label: string
  /** Link href — omit for current (last) item */
  href?: string
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Breadcrumb items in order */
  items: BreadcrumbItem[]
  /** Custom separator between items */
  separator?: React.ReactNode
}

/**
 * Breadcrumb navigation component. Renders a list of links with separators.
 * The last item is rendered as the current page (non-linked).
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      separator,
      className = '',
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-breadcrumb',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const defaultSeparator = (
      <span className="ui-breadcrumb-separator" aria-hidden="true">/</span>
    )

    return (
      <nav ref={ref} className={cls} aria-label="Breadcrumb" {...rest}>
        <ol className="ui-breadcrumb-list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={index} className="ui-breadcrumb-item">
                {index > 0 && (
                  separator
                    ? <span className="ui-breadcrumb-separator" aria-hidden="true">{separator}</span>
                    : defaultSeparator
                )}
                {isLast || !item.href ? (
                  <span className="ui-breadcrumb-current" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <a className="ui-breadcrumb-link" href={item.href}>
                    {item.label}
                  </a>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'
