import React, { useState, useCallback, useMemo, useEffect } from 'react'

/** Visual style of the calendar */
export type CalendarVariant = 'default' | 'glass' | 'compact'

/** Size preset */
export type CalendarSize = 'sm' | 'md' | 'lg'

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Selected date (controlled) */
  value?: Date | null
  /** Initial selected date (uncontrolled) */
  defaultValue?: Date
  /** Callback when a date is selected */
  onChange?: (date: Date) => void
  /** Visual variant */
  variant?: CalendarVariant
  /** Size preset */
  size?: CalendarSize
  /** Earliest selectable date */
  minDate?: Date
  /** Latest selectable date */
  maxDate?: Date
  /** Dates that cannot be selected */
  disabledDates?: Date[] | ((date: Date) => boolean)
  /** Dates to highlight with an accent dot */
  highlightedDates?: Date[]
  /** Day the week starts on: 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1
  /** Show days from adjacent months */
  showOutsideDays?: boolean
  /** Custom header replacing the default month/year navigation */
  header?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/* ── Date helpers (no external deps) ─────────────────── */

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isToday(d: Date): boolean {
  return isSameDay(d, new Date())
}

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_LABELS_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const DAY_LABELS_MON = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

/**
 * Full-featured month calendar with keyboard navigation.
 * All date calculations are implemented without external libraries.
 */
export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      variant = 'default',
      size = 'md',
      minDate,
      maxDate,
      disabledDates,
      highlightedDates,
      weekStartsOn = 0,
      showOutsideDays = true,
      header,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const initialDate = value ?? defaultValue ?? new Date()

    const [selectedDate, setSelectedDate] = useState<Date | null>(
      isControlled ? null : (defaultValue ?? null)
    )
    const [viewYear, setViewYear] = useState(initialDate.getFullYear())
    const [viewMonth, setViewMonth] = useState(initialDate.getMonth())
    const [focusedDay, setFocusedDay] = useState<number | null>(null)
    const [showYearPicker, setShowYearPicker] = useState(false)

    // Sync controlled value
    useEffect(() => {
      if (isControlled && value) {
        setViewYear(value.getFullYear())
        setViewMonth(value.getMonth())
      }
    }, [isControlled, value])

    const activeDate = isControlled ? value : selectedDate

    const isDateDisabled = useCallback(
      (date: Date): boolean => {
        if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true
        if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true
        if (!disabledDates) return false
        if (typeof disabledDates === 'function') return disabledDates(date)
        return disabledDates.some((d) => isSameDay(d, date))
      },
      [minDate, maxDate, disabledDates]
    )

    const isDateHighlighted = useCallback(
      (date: Date): boolean => {
        if (!highlightedDates) return false
        return highlightedDates.some((d) => isSameDay(d, date))
      },
      [highlightedDates]
    )

    const handleSelect = useCallback(
      (date: Date) => {
        if (isDateDisabled(date)) return
        if (!isControlled) setSelectedDate(date)
        onChange?.(date)
      },
      [isControlled, isDateDisabled, onChange]
    )

    const goToPrevMonth = () => {
      if (viewMonth === 0) {
        setViewMonth(11)
        setViewYear((y) => y - 1)
      } else {
        setViewMonth((m) => m - 1)
      }
      setFocusedDay(null)
    }

    const goToNextMonth = () => {
      if (viewMonth === 11) {
        setViewMonth(0)
        setViewYear((y) => y + 1)
      } else {
        setViewMonth((m) => m + 1)
      }
      setFocusedDay(null)
    }

    /* ── Build grid ─────────────────────────────────── */
    const grid = useMemo(() => {
      const daysInMonth = getDaysInMonth(viewYear, viewMonth)
      const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
      const offset = weekStartsOn === 1 ? (firstDay + 6) % 7 : firstDay

      const daysInPrevMonth = getDaysInMonth(
        viewMonth === 0 ? viewYear - 1 : viewYear,
        viewMonth === 0 ? 11 : viewMonth - 1
      )

      const cells: Array<{
        day: number
        month: number
        year: number
        outside: boolean
        date: Date
      }> = []

      // Previous month trailing days
      for (let i = offset - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i
        const m = viewMonth === 0 ? 11 : viewMonth - 1
        const y = viewMonth === 0 ? viewYear - 1 : viewYear
        cells.push({ day: d, month: m, year: y, outside: true, date: new Date(y, m, d) })
      }

      // Current month
      for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, month: viewMonth, year: viewYear, outside: false, date: new Date(viewYear, viewMonth, d) })
      }

      // Next month leading days
      const remaining = 42 - cells.length
      for (let d = 1; d <= remaining; d++) {
        const m = viewMonth === 11 ? 0 : viewMonth + 1
        const y = viewMonth === 11 ? viewYear + 1 : viewYear
        cells.push({ day: d, month: m, year: y, outside: true, date: new Date(y, m, d) })
      }

      return cells
    }, [viewYear, viewMonth, weekStartsOn])

    /* ── Keyboard navigation ────────────────────────── */
    const handleKeyDown = (e: React.KeyboardEvent) => {
      const daysInMonth = getDaysInMonth(viewYear, viewMonth)
      let next = focusedDay ?? 1

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          next = next + 1
          if (next > daysInMonth) { goToNextMonth(); setFocusedDay(1); return }
          break
        case 'ArrowLeft':
          e.preventDefault()
          next = next - 1
          if (next < 1) {
            goToPrevMonth()
            setFocusedDay(getDaysInMonth(
              viewMonth === 0 ? viewYear - 1 : viewYear,
              viewMonth === 0 ? 11 : viewMonth - 1
            ))
            return
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          next = next + 7
          if (next > daysInMonth) { goToNextMonth(); setFocusedDay(next - daysInMonth); return }
          break
        case 'ArrowUp':
          e.preventDefault()
          next = next - 7
          if (next < 1) {
            const prevDays = getDaysInMonth(
              viewMonth === 0 ? viewYear - 1 : viewYear,
              viewMonth === 0 ? 11 : viewMonth - 1
            )
            goToPrevMonth()
            setFocusedDay(prevDays + next)
            return
          }
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          handleSelect(new Date(viewYear, viewMonth, next))
          return
        case 'PageDown':
          e.preventDefault()
          goToNextMonth()
          return
        case 'PageUp':
          e.preventDefault()
          goToPrevMonth()
          return
        default:
          return
      }
      setFocusedDay(next)
    }

    /* ── Year picker ────────────────────────────────── */
    const yearRange = useMemo(() => {
      const base = viewYear
      const years: number[] = []
      for (let y = base - 6; y <= base + 5; y++) years.push(y)
      return years
    }, [viewYear])

    /* ── Render ──────────────────────────────────────── */
    const cls = [
      'ui-calendar',
      `ui-calendar-${variant}`,
      `ui-calendar-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const dayLabels = weekStartsOn === 1 ? DAY_LABELS_MON : DAY_LABELS_SUN

    return (
      <div
        ref={ref}
        className={cls}
        style={style}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {/* Header */}
        {header ?? (
          <div className="ui-calendar-header">
            <button
              type="button"
              className="ui-calendar-nav-btn"
              onClick={goToPrevMonth}
              aria-label="Previous month"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="ui-calendar-title"
              onClick={() => setShowYearPicker((v) => !v)}
              aria-label="Select year"
            >
              {MONTH_NAMES[viewMonth]} {viewYear}
            </button>
            <button
              type="button"
              className="ui-calendar-nav-btn"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Year picker */}
        {showYearPicker && (
          <div className="ui-calendar-year-picker" role="listbox" aria-label="Year selection">
            {yearRange.map((y) => (
              <button
                key={y}
                type="button"
                role="option"
                aria-selected={y === viewYear}
                className={[
                  'ui-calendar-year-option',
                  y === viewYear && 'ui-calendar-year-active',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  setViewYear(y)
                  setShowYearPicker(false)
                }}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Day grid */}
        {!showYearPicker && (
          <div className="ui-calendar-grid" role="grid" aria-label={`${MONTH_NAMES[viewMonth]} ${viewYear}`}>
            <div className="ui-calendar-weekdays" role="row">
              {dayLabels.map((d) => (
                <div key={d} className="ui-calendar-weekday" role="columnheader" aria-label={d}>
                  {d}
                </div>
              ))}
            </div>
            {Array.from({ length: 6 }, (_, row) => (
              <div key={row} className="ui-calendar-row" role="row">
                {grid.slice(row * 7, row * 7 + 7).map((cell, i) => {
                  const disabled = isDateDisabled(cell.date)
                  const selected = activeDate ? isSameDay(cell.date, activeDate) : false
                  const today = isToday(cell.date)
                  const highlighted = isDateHighlighted(cell.date)
                  const focused = !cell.outside && cell.day === focusedDay

                  if (cell.outside && !showOutsideDays) {
                    return <div key={i} className="ui-calendar-cell ui-calendar-cell-empty" role="gridcell" />
                  }

                  const cellCls = [
                    'ui-calendar-cell',
                    cell.outside && 'ui-calendar-cell-outside',
                    disabled && 'ui-calendar-cell-disabled',
                    selected && 'ui-calendar-cell-selected',
                    today && 'ui-calendar-cell-today',
                    highlighted && 'ui-calendar-cell-highlighted',
                    focused && 'ui-calendar-cell-focused',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <button
                      key={i}
                      type="button"
                      className={cellCls}
                      role="gridcell"
                      aria-selected={selected}
                      aria-disabled={disabled}
                      aria-label={formatDateLabel(cell.date)}
                      tabIndex={focused ? 0 : -1}
                      onClick={() => !cell.outside && handleSelect(cell.date)}
                      onFocus={() => !cell.outside && setFocusedDay(cell.day)}
                    >
                      <span className="ui-calendar-day">{cell.day}</span>
                      {highlighted && <span className="ui-calendar-dot" aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

Calendar.displayName = 'Calendar'
