import React, { useState, useRef, useEffect, useCallback } from 'react'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export type DateRangePickerVariant = 'default' | 'filled' | 'ghost'
export type DateRangePickerSize = 'sm' | 'md' | 'lg'

export type DateRangePreset = {
  label: string
  range: () => DateRange
}

export interface DateRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled value */
  value?: DateRange
  /** Called when range changes */
  onChange?: (range: DateRange) => void
  /** Visual variant */
  variant?: DateRangePickerVariant
  /** Size preset */
  size?: DateRangePickerSize
  /** Placeholder text */
  placeholder?: string
  /** Label */
  label?: string
  /** Quick-select presets */
  presets?: DateRangePreset[]
  /** Disabled state */
  disabled?: boolean
  /** Min selectable date */
  minDate?: Date
  /** Max selectable date */
  maxDate?: Date
  /** Format for display (default: 'short') */
  displayFormat?: 'short' | 'long' | 'iso'
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false
  return date > start && date < end
}

function formatDate(date: Date | null, format: 'short' | 'long' | 'iso'): string {
  if (!date) return ''
  if (format === 'iso') return date.toISOString().split('T')[0]
  if (format === 'long') return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

/** Default presets for quick date range selection */
export const DEFAULT_PRESETS: DateRangePreset[] = [
  { label: 'Today', range: () => ({ start: new Date(), end: new Date() }) },
  { label: 'Last 7 days', range: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 7); return { start: s, end: e } } },
  { label: 'Last 30 days', range: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 30); return { start: s, end: e } } },
  { label: 'This month', range: () => { const now = new Date(); return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now } } },
  { label: 'Last month', range: () => { const now = new Date(); return { start: new Date(now.getFullYear(), now.getMonth() - 1, 1), end: new Date(now.getFullYear(), now.getMonth(), 0) } } },
  { label: 'This year', range: () => ({ start: new Date(new Date().getFullYear(), 0, 1), end: new Date() }) },
]

/**
 * Date range picker with calendar dropdown, preset quick-selects, and dual-month view.
 */
export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      variant = 'default',
      size = 'md',
      placeholder = 'Select date range',
      label,
      presets = DEFAULT_PRESETS,
      disabled = false,
      minDate,
      maxDate,
      displayFormat = 'short',
      className = '',
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [selecting, setSelecting] = useState<'start' | 'end'>('start')
    const [viewMonth, setViewMonth] = useState(new Date().getMonth())
    const [viewYear, setViewYear] = useState(new Date().getFullYear())
    const [localRange, setLocalRange] = useState<DateRange>(value ?? { start: null, end: null })
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (value) setLocalRange(value)
    }, [value])

    useEffect(() => {
      if (!open) return
      const handleClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    const handleDayClick = useCallback((day: Date) => {
      if (disabled) return
      if (minDate && day < minDate) return
      if (maxDate && day > maxDate) return

      if (selecting === 'start') {
        const newRange = { start: day, end: null }
        setLocalRange(newRange)
        setSelecting('end')
      } else {
        const start = localRange.start!
        const newRange = day >= start ? { start, end: day } : { start: day, end: start }
        setLocalRange(newRange)
        setSelecting('start')
        onChange?.(newRange)
      }
    }, [selecting, localRange.start, disabled, minDate, maxDate, onChange])

    const handlePreset = useCallback((preset: DateRangePreset) => {
      const range = preset.range()
      setLocalRange(range)
      onChange?.(range)
      setOpen(false)
    }, [onChange])

    const prevMonth = () => {
      if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
      else setViewMonth(m => m - 1)
    }

    const nextMonth = () => {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
      else setViewMonth(m => m + 1)
    }

    const days = getDaysInMonth(viewYear, viewMonth)
    const firstDayOffset = days[0]?.getDay() ?? 0
    const nextMonthDays = getDaysInMonth(viewMonth === 11 ? viewYear + 1 : viewYear, viewMonth === 11 ? 0 : viewMonth + 1)
    const nextMonthFirstOffset = nextMonthDays[0]?.getDay() ?? 0

    const displayText = localRange.start
      ? `${formatDate(localRange.start, displayFormat)}${localRange.end ? ` — ${formatDate(localRange.end, displayFormat)}` : ''}`
      : placeholder

    const cls = ['ui-daterange', `ui-daterange-${variant}`, `ui-daterange-${size}`, disabled ? 'ui-daterange-disabled' : '', className].filter(Boolean).join(' ')

    const renderMonth = (monthDays: Date[], offset: number, monthLabel: string) => (
      <div className="ui-daterange-month">
        <div className="ui-daterange-month-label">{monthLabel}</div>
        <div className="ui-daterange-weekdays">
          {DAY_NAMES.map(d => <span key={d} className="ui-daterange-weekday">{d}</span>)}
        </div>
        <div className="ui-daterange-days">
          {Array.from({ length: offset }).map((_, i) => <span key={`pad-${i}`} className="ui-daterange-day-pad" />)}
          {monthDays.map(day => {
            const isStart = localRange.start && isSameDay(day, localRange.start)
            const isEnd = localRange.end && isSameDay(day, localRange.end)
            const inRange = isInRange(day, localRange.start, localRange.end)
            const isDisabled = (minDate && day < minDate) || (maxDate && day > maxDate)
            const dayCls = [
              'ui-daterange-day',
              isStart ? 'ui-daterange-day-start' : '',
              isEnd ? 'ui-daterange-day-end' : '',
              inRange ? 'ui-daterange-day-inrange' : '',
              isDisabled ? 'ui-daterange-day-disabled' : '',
            ].filter(Boolean).join(' ')
            return (
              <button key={day.toISOString()} className={dayCls} onClick={() => handleDayClick(day)} disabled={!!isDisabled} type="button">
                {day.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )

    return (
      <div ref={containerRef} className={cls} {...rest}>
        {label && <label className="ui-daterange-label">{label}</label>}
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className="ui-daterange-trigger"
          onClick={() => !disabled && setOpen(!open)}
          type="button"
          disabled={disabled}
        >
          <svg className="ui-daterange-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="ui-daterange-text">{displayText}</span>
          <svg className="ui-daterange-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </button>

        {open && (
          <div className="ui-daterange-dropdown">
            {presets.length > 0 && (
              <div className="ui-daterange-presets">
                {presets.map(p => (
                  <button key={p.label} className="ui-daterange-preset" onClick={() => handlePreset(p)} type="button">
                    {p.label}
                  </button>
                ))}
              </div>
            )}
            <div className="ui-daterange-calendars">
              <div className="ui-daterange-nav">
                <button className="ui-daterange-nav-btn" onClick={prevMonth} type="button">&lsaquo;</button>
                <span className="ui-daterange-nav-title">{MONTH_NAMES[viewMonth]} {viewYear}</span>
                <span className="ui-daterange-nav-title">{MONTH_NAMES[viewMonth === 11 ? 0 : viewMonth + 1]} {viewMonth === 11 ? viewYear + 1 : viewYear}</span>
                <button className="ui-daterange-nav-btn" onClick={nextMonth} type="button">&rsaquo;</button>
              </div>
              <div className="ui-daterange-dual">
                {renderMonth(days, firstDayOffset, MONTH_NAMES[viewMonth])}
                {renderMonth(nextMonthDays, nextMonthFirstOffset, MONTH_NAMES[viewMonth === 11 ? 0 : viewMonth + 1])}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)
DateRangePicker.displayName = 'DateRangePicker'
