import React, { useMemo, useCallback } from 'react'

/** Pagination visual variant */
export type PaginationVariant = 'default' | 'outlined' | 'ghost' | 'pills'
/** Pagination size preset */
export type PaginationSize = 'sm' | 'md' | 'lg'

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Total number of pages */
  total: number
  /** Current active page (1-based) */
  current: number
  /** Called when a page is selected */
  onChange: (page: number) => void
  /** Visual style variant */
  variant?: PaginationVariant
  /** Size preset */
  size?: PaginationSize
  /** Number of pages shown around the current page */
  siblings?: number
  /** Number of pages shown at start and end */
  boundaries?: number
  /** Show first/last page jump buttons */
  showFirstLast?: boolean
  /** Show previous/next navigation buttons */
  showPrevNext?: boolean
  /** Disable all interactions */
  disabled?: boolean
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let i = start; i <= end; i++) result.push(i)
  return result
}

function buildPages(
  total: number,
  current: number,
  siblings: number,
  boundaries: number
): (number | 'dots')[] {
  if (total <= 0) return []
  const totalSlots = boundaries * 2 + siblings * 2 + 3 // boundaries + ellipses + current
  if (total <= totalSlots) return range(1, total)

  const leftBound = Math.max(current - siblings, boundaries + 2)
  const rightBound = Math.min(current + siblings, total - boundaries - 1)

  const showLeftDots = leftBound > boundaries + 2
  const showRightDots = rightBound < total - boundaries - 1

  const pages: (number | 'dots')[] = []

  // Left boundary
  for (let i = 1; i <= Math.min(boundaries, total); i++) pages.push(i)

  if (showLeftDots) {
    pages.push('dots')
  } else {
    for (let i = boundaries + 1; i < leftBound; i++) pages.push(i)
  }

  // Middle range
  for (let i = leftBound; i <= rightBound; i++) pages.push(i)

  if (showRightDots) {
    pages.push('dots')
  } else {
    for (let i = rightBound + 1; i <= total - boundaries; i++) pages.push(i)
  }

  // Right boundary
  for (let i = Math.max(total - boundaries + 1, boundaries + 1); i <= total; i++) pages.push(i)

  return pages
}

/**
 * Pagination component with smart ellipsis. Supports 4 variants and 3 sizes.
 * Keyboard navigable with arrow keys and Enter. Fully ARIA-compliant.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      total,
      current,
      onChange,
      variant = 'default',
      size = 'md',
      siblings = 1,
      boundaries = 1,
      showFirstLast = false,
      showPrevNext = true,
      disabled = false,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const pages = useMemo(
      () => buildPages(total, current, siblings, boundaries),
      [total, current, siblings, boundaries]
    )

    const handlePageClick = useCallback(
      (page: number) => {
        if (!disabled && page >= 1 && page <= total && page !== current) {
          onChange(page)
        }
      },
      [disabled, total, current, onChange]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          if (current > 1) onChange(current - 1)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          if (current < total) onChange(current + 1)
        }
      },
      [disabled, current, total, onChange]
    )

    const cls = [
      'ui-pagination',
      variant && `ui-pagination-${variant}`,
      size && `ui-pagination-${size}`,
      disabled && 'ui-pagination-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const isFirstPage = current <= 1
    const isLastPage = current >= total

    return (
      <nav
        ref={ref}
        className={cls}
        style={style}
        role="navigation"
        aria-label="Pagination"
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <ul className="ui-pagination-list">
          {showFirstLast && (
            <li>
              <button
                className="ui-pagination-btn ui-pagination-nav"
                onClick={() => handlePageClick(1)}
                disabled={disabled || isFirstPage}
                aria-label="Go to first page"
                tabIndex={disabled || isFirstPage ? -1 : 0}
              >
                &#x00AB;
              </button>
            </li>
          )}

          {showPrevNext && (
            <li>
              <button
                className="ui-pagination-btn ui-pagination-nav"
                onClick={() => handlePageClick(current - 1)}
                disabled={disabled || isFirstPage}
                aria-label="Go to previous page"
                tabIndex={disabled || isFirstPage ? -1 : 0}
              >
                &#x2039;
              </button>
            </li>
          )}

          {pages.map((page, index) =>
            page === 'dots' ? (
              <li key={`dots-${index}`} className="ui-pagination-dots" aria-hidden="true">
                <span>&hellip;</span>
              </li>
            ) : (
              <li key={page}>
                <button
                  className={[
                    'ui-pagination-btn',
                    page === current && 'ui-pagination-active',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handlePageClick(page)}
                  disabled={disabled}
                  aria-current={page === current ? 'page' : undefined}
                  aria-label={`Page ${page}`}
                  tabIndex={disabled ? -1 : 0}
                >
                  {page}
                </button>
              </li>
            )
          )}

          {showPrevNext && (
            <li>
              <button
                className="ui-pagination-btn ui-pagination-nav"
                onClick={() => handlePageClick(current + 1)}
                disabled={disabled || isLastPage}
                aria-label="Go to next page"
                tabIndex={disabled || isLastPage ? -1 : 0}
              >
                &#x203A;
              </button>
            </li>
          )}

          {showFirstLast && (
            <li>
              <button
                className="ui-pagination-btn ui-pagination-nav"
                onClick={() => handlePageClick(total)}
                disabled={disabled || isLastPage}
                aria-label="Go to last page"
                tabIndex={disabled || isLastPage ? -1 : 0}
              >
                &#x00BB;
              </button>
            </li>
          )}
        </ul>
      </nav>
    )
  }
)

Pagination.displayName = 'Pagination'
