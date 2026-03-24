import React, { useState, useCallback, useEffect, useRef, useId } from 'react'
import { Calendar } from './Calendar'

/** DatePicker variant */
export type DatePickerVariant = 'default' | 'filled' | 'ghost' | 'glass'
/** DatePicker size */
export type DatePickerSize = 'sm' | 'md' | 'lg'
/** Dropdown placement */
export type DatePickerPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Selected date (controlled) */
  value?: Date | null
  /** Initial selected date (uncontrolled) */
  defaultValue?: Date
  /** Callback when a date is selected or cleared */
  onChange?: (date: Date | null) => void
  /** Visual variant */
  variant?: DatePickerVariant
  /** Size preset */
  size?: DatePickerSize
  /** Placeholder text when no date is selected */
  placeholder?: string
  /** Label displayed above the input */
  label?: string
  /** Error message displayed below the input */
  error?: string
  /** Date display format */
  format?: string
  /** Earliest selectable date */
  minDate?: Date
  /** Latest selectable date */
  maxDate?: Date
  /** Dates that cannot be selected */
  disabledDates?: Date[] | ((date: Date) => boolean)
  /** Show clear button */
  clearable?: boolean
  /** Disable the input */
  disabled?: boolean
  /** Make input read-only */
  readOnly?: boolean
  /** Custom icon for the input */
  icon?: React.ReactNode
  /** Dropdown placement relative to input */
  placement?: DatePickerPlacement
  className?: string
  style?: React.CSSProperties
}

/* ── Date format helpers (no external deps) ─────────── */

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function formatDate(date: Date, fmt: string): string {
  const yyyy = `${date.getFullYear()}`
  const MM = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const MMM = MONTH_SHORT[date.getMonth()]

  return fmt
    .replace('yyyy', yyyy)
    .replace('MMM', MMM)
    .replace('MM', MM)
    .replace('dd', dd)
}

/* ── Default calendar icon ──────────────────────────── */

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 7h12" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ClearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/**
 * Date input with calendar dropdown. Builds on the Calendar component.
 * Supports controlled/uncontrolled modes, date formatting, and full keyboard navigation.
 */
export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      variant = 'default',
      size = 'md',
      placeholder = 'Select date',
      label,
      error,
      format = 'MMM dd, yyyy',
      minDate,
      maxDate,
      disabledDates,
      clearable = true,
      disabled = false,
      readOnly = false,
      icon,
      placement = 'bottom-start',
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalDate, setInternalDate] = useState<Date | null>(defaultValue ?? null)
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLButtonElement>(null)
    const uid = useId()
    const labelId = `${uid}-label`
    const errorId = `${uid}-error`

    const activeDate = isControlled ? (value ?? null) : internalDate

    const handleSelect = useCallback(
      (date: Date) => {
        if (!isControlled) setInternalDate(date)
        onChange?.(date)
        setOpen(false)
        inputRef.current?.focus()
      },
      [isControlled, onChange]
    )

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isControlled) setInternalDate(null)
        onChange?.(null)
        inputRef.current?.focus()
      },
      [isControlled, onChange]
    )

    const handleToggle = useCallback(() => {
      if (disabled || readOnly) return
      setOpen((prev) => !prev)
    }, [disabled, readOnly])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          e.preventDefault()
          setOpen(false)
          inputRef.current?.focus()
        }
        if ((e.key === 'Enter' || e.key === ' ') && !open) {
          e.preventDefault()
          if (!disabled && !readOnly) setOpen(true)
        }
      },
      [open, disabled, readOnly]
    )

    // Close on click outside
    useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const cls = [
      'ui-datepicker',
      `ui-datepicker-${variant}`,
      `ui-datepicker-${size}`,
      disabled && 'ui-datepicker-disabled',
      error && 'ui-datepicker-error',
      open && 'ui-datepicker-open',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const calendarVariant = variant === 'glass' ? 'glass' : 'default'

    return (
      <div ref={containerRef} className={cls} style={style} {...rest}>
        {/* Forwarded ref wrapper */}
        <div ref={ref} className="ui-datepicker-wrapper">
          {label && (
            <label id={labelId} className="ui-datepicker-label" htmlFor={uid}>
              {label}
            </label>
          )}
          <button
            ref={inputRef}
            id={uid}
            type="button"
            className="ui-datepicker-input"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-labelledby={label ? labelId : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          >
            <span className="ui-datepicker-icon" aria-hidden="true">
              {icon ?? <CalendarIcon />}
            </span>
            <span className={activeDate ? 'ui-datepicker-value' : 'ui-datepicker-placeholder'}>
              {activeDate ? formatDate(activeDate, format) : placeholder}
            </span>
            {clearable && activeDate && !disabled && !readOnly && (
              <span
                className="ui-datepicker-clear"
                role="button"
                tabIndex={0}
                aria-label="Clear date"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClear(e as unknown as React.MouseEvent)
                  }
                }}
              >
                <ClearIcon />
              </span>
            )}
          </button>
          {error && (
            <span id={errorId} className="ui-datepicker-error-text" role="alert">
              {error}
            </span>
          )}
        </div>

        {/* Dropdown calendar */}
        {open && (
          <div
            ref={dropdownRef}
            className={[
              'ui-datepicker-dropdown',
              `ui-datepicker-dropdown-${placement}`,
            ]
              .filter(Boolean)
              .join(' ')}
            role="dialog"
            aria-label="Choose date"
          >
            <Calendar
              value={activeDate}
              onChange={handleSelect}
              variant={calendarVariant}
              size={size}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
            />
          </div>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
