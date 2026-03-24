import React, { useMemo } from 'react'

/** Table visual variant */
export type TableVariant = 'default' | 'striped' | 'bordered' | 'glass'
/** Table size preset */
export type TableSize = 'sm' | 'md' | 'lg'

/** Column definition for the Table component */
export interface TableColumn<T> {
  /** Key to access row data, or a custom string for render-only columns */
  key: keyof T | string
  /** Column header content */
  header: string | React.ReactNode
  /** Custom cell renderer */
  render?: (row: T, index: number) => React.ReactNode
  /** Column width (CSS value) */
  width?: string
  /** Text alignment within the column */
  align?: 'left' | 'center' | 'right'
  /** Whether this column is individually sortable */
  sortable?: boolean
}

export interface TableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Row data array */
  data: T[]
  /** Column definitions */
  columns: TableColumn<T>[]
  /** Visual style variant */
  variant?: TableVariant
  /** Size preset */
  size?: TableSize
  /** Enable sorting globally on all columns with sortable flag */
  sortable?: boolean
  /** Callback when a sortable column header is clicked */
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  /** Currently sorted column key */
  sortKey?: string
  /** Current sort direction */
  sortDirection?: 'asc' | 'desc'
  /** Highlight rows on hover */
  hoverable?: boolean
  /** Make header sticky on scroll */
  stickyHeader?: boolean
  /** Content shown when data is empty */
  emptyMessage?: React.ReactNode
  /** Show loading skeleton */
  loading?: boolean
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/** Sub-component for compositional table building */
export interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

/** Table head sub-component */
export const TableHead = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ children, className, ...rest }, ref) => {
    const cls = ['ui-table-head', className].filter(Boolean).join(' ')
    return (
      <thead ref={ref} className={cls} {...rest}>
        {children}
      </thead>
    )
  }
)
TableHead.displayName = 'TableHead'

/** Sub-component props for table body */
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

/** Table body sub-component */
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const cls = ['ui-table-body', className].filter(Boolean).join(' ')
    return (
      <tbody ref={ref} className={cls} {...rest}>
        {children}
      </tbody>
    )
  }
)
TableBody.displayName = 'TableBody'

/** Sub-component props for table row */
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

/** Table row sub-component */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, ...rest }, ref) => {
    const cls = ['ui-table-row', className].filter(Boolean).join(' ')
    return (
      <tr ref={ref} className={cls} {...rest}>
        {children}
      </tr>
    )
  }
)
TableRow.displayName = 'TableRow'

/** Sub-component props for table cell */
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Render as th instead of td */
  header?: boolean
  children?: React.ReactNode
}

/** Table cell sub-component */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ header = false, children, className, ...rest }, ref) => {
    const cls = ['ui-table-cell', className].filter(Boolean).join(' ')
    const Tag = header ? 'th' : 'td'
    return (
      <Tag ref={ref} className={cls} {...rest}>
        {children}
      </Tag>
    )
  }
)
TableCell.displayName = 'TableCell'

/**
 * Data table component with sorting, loading, and empty states.
 * Supports 4 variants and 3 sizes. Responsive with horizontal scroll.
 * Exports sub-components (TableHead, TableBody, TableRow, TableCell) for composition.
 */
export function Table<T extends object>({
  data,
  columns,
  variant = 'default',
  size = 'md',
  sortable = false,
  onSort,
  sortKey,
  sortDirection,
  hoverable = true,
  stickyHeader = false,
  emptyMessage = 'No data available',
  loading = false,
  className,
  style,
  ...rest
}: TableProps<T>) {
  const cls = [
    'ui-table-wrapper',
    variant && `ui-table-${variant}`,
    size && `ui-table-${size}`,
    hoverable && 'ui-table-hoverable',
    stickyHeader && 'ui-table-sticky',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleSort = (col: TableColumn<T>) => {
    if (!onSort) return
    const key = String(col.key)
    const newDir: 'asc' | 'desc' =
      sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(key, newDir)
  }

  const skeletonRows = useMemo(() => {
    const rows = []
    for (let i = 0; i < 5; i++) {
      rows.push(
        <tr key={`skeleton-${i}`} className="ui-table-row ui-table-skeleton-row">
          {columns.map((_col, j) => (
            <td key={j} className="ui-table-cell">
              <div className="ui-table-skeleton-bar" />
            </td>
          ))}
        </tr>
      )
    }
    return rows
  }, [columns])

  const getSortAria = (col: TableColumn<T>): 'ascending' | 'descending' | 'none' | undefined => {
    const colSortable = sortable || col.sortable
    if (!colSortable) return undefined
    if (sortKey === String(col.key)) {
      return sortDirection === 'asc' ? 'ascending' : 'descending'
    }
    return 'none'
  }

  return (
    <div className={cls} style={style} {...rest}>
      <div className="ui-table-scroll">
        <table className="ui-table" role="table">
          <thead className="ui-table-head">
            <tr>
              {columns.map((col) => {
                const colSortable = sortable || col.sortable
                const isSorted = sortKey === String(col.key)
                const thCls = [
                  'ui-table-th',
                  colSortable && 'ui-table-th-sortable',
                  isSorted && 'ui-table-th-sorted',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <th
                    key={String(col.key)}
                    className={thCls}
                    style={{
                      width: col.width,
                      textAlign: col.align || 'left',
                    }}
                    aria-sort={getSortAria(col)}
                    onClick={colSortable ? () => handleSort(col) : undefined}
                    tabIndex={colSortable ? 0 : undefined}
                    onKeyDown={
                      colSortable
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleSort(col)
                            }
                          }
                        : undefined
                    }
                    role={colSortable ? 'columnheader' : undefined}
                  >
                    <span className="ui-table-th-content">
                      {col.header}
                      {colSortable && (
                        <span className="ui-table-sort-icon" aria-hidden="true">
                          {isSorted
                            ? sortDirection === 'asc'
                              ? '\u25B2'
                              : '\u25BC'
                            : '\u25B4'}
                        </span>
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="ui-table-body">
            {loading ? (
              skeletonRows
            ) : data.length === 0 ? (
              <tr className="ui-table-empty-row">
                <td
                  className="ui-table-cell ui-table-empty"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="ui-table-row">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="ui-table-cell"
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : String(row[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

Table.displayName = 'Table'
