import React, { useState, useRef, useEffect, useCallback, useId, useMemo } from 'react'

/** Select visual variant */
export type SelectVariant = 'default' | 'ghost' | 'filled'
/** Select size preset */
export type SelectSize = 'sm' | 'md' | 'lg'

/** Option definition for the Select component */
export interface SelectOption {
  /** Unique value */
  value: string
  /** Display label */
  label: string
  /** Whether this option is disabled */
  disabled?: boolean
  /** Group name for grouping options */
  group?: string
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Available options */
  options: SelectOption[]
  /** Controlled selected value(s) */
  value?: string | string[]
  /** Default selected value(s) for uncontrolled usage */
  defaultValue?: string | string[]
  /** Called when selection changes */
  onChange?: (value: string | string[]) => void
  /** Visual style variant */
  variant?: SelectVariant
  /** Size preset */
  size?: SelectSize
  /** Placeholder text when nothing is selected */
  placeholder?: string
  /** Label text displayed above the select */
  label?: string
  /** Error message displayed below the select */
  error?: string
  /** Allow selecting multiple options */
  multiple?: boolean
  /** Enable typing to filter options */
  searchable?: boolean
  /** Show a clear button when value is selected */
  clearable?: boolean
  /** Disable all interactions */
  disabled?: boolean
  /** Maximum dropdown height in pixels */
  maxHeight?: number
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * Custom select dropdown component with search, multi-select, and grouping.
 * Supports 3 variants and 3 sizes. Full keyboard navigation and ARIA compliance.
 */
export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      variant = 'default',
      size = 'md',
      placeholder = 'Select...',
      label,
      error,
      multiple = false,
      searchable = false,
      clearable = false,
      disabled = false,
      maxHeight = 240,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const uid = useId()
    const labelId = `${uid}-label`
    const listboxId = `${uid}-listbox`

    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = useState<string | string[]>(
      defaultValue ?? (multiple ? [] : '')
    )
    const selected = isControlled ? controlledValue : internalValue

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [activeIndex, setActiveIndex] = useState(-1)

    const rootRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const selectedArray = useMemo(
      () => (Array.isArray(selected) ? selected : selected ? [selected] : []),
      [selected]
    )

    const filteredOptions = useMemo(() => {
      if (!search) return options
      const lower = search.toLowerCase()
      return options.filter(
        (o) =>
          o.label.toLowerCase().includes(lower) ||
          o.value.toLowerCase().includes(lower)
      )
    }, [options, search])

    const groupedOptions = useMemo(() => {
      const groups: Map<string, SelectOption[]> = new Map()
      for (const opt of filteredOptions) {
        const group = opt.group || ''
        if (!groups.has(group)) groups.set(group, [])
        groups.get(group)!.push(opt)
      }
      return groups
    }, [filteredOptions])

    // Flat list for keyboard navigation
    const flatFiltered = filteredOptions

    const updateValue = useCallback(
      (optValue: string) => {
        let next: string | string[]
        if (multiple) {
          const arr = [...selectedArray]
          const idx = arr.indexOf(optValue)
          if (idx >= 0) arr.splice(idx, 1)
          else arr.push(optValue)
          next = arr
        } else {
          next = optValue
          setOpen(false)
          setSearch('')
        }
        if (!isControlled) setInternalValue(next)
        onChange?.(next)
      },
      [multiple, selectedArray, isControlled, onChange]
    )

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        const next = multiple ? [] : ''
        if (!isControlled) setInternalValue(next)
        onChange?.(next)
        setSearch('')
      },
      [multiple, isControlled, onChange]
    )

    // Click outside
    useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false)
          setSearch('')
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    // Focus search when opened
    useEffect(() => {
      if (open && searchable && searchRef.current) {
        searchRef.current.focus()
      }
    }, [open, searchable])

    // Scroll active option into view
    useEffect(() => {
      if (!open || activeIndex < 0) return
      const list = listRef.current
      if (!list) return
      const items = list.querySelectorAll<HTMLElement>('[role="option"]')
      items[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }, [activeIndex, open])

    // Reset active index when filter changes
    useEffect(() => {
      setActiveIndex(-1)
    }, [search])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return

        if (!open) {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
            setActiveIndex(0)
          }
          return
        }

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setActiveIndex((prev) => {
              let next = prev + 1
              while (next < flatFiltered.length && flatFiltered[next].disabled) next++
              return next < flatFiltered.length ? next : prev
            })
            break
          case 'ArrowUp':
            e.preventDefault()
            setActiveIndex((prev) => {
              let next = prev - 1
              while (next >= 0 && flatFiltered[next].disabled) next--
              return next >= 0 ? next : prev
            })
            break
          case 'Enter':
            e.preventDefault()
            if (activeIndex >= 0 && activeIndex < flatFiltered.length) {
              const opt = flatFiltered[activeIndex]
              if (!opt.disabled) updateValue(opt.value)
            }
            break
          case 'Escape':
            e.preventDefault()
            setOpen(false)
            setSearch('')
            break
          case 'Home':
            e.preventDefault()
            setActiveIndex(0)
            break
          case 'End':
            e.preventDefault()
            setActiveIndex(flatFiltered.length - 1)
            break
        }
      },
      [disabled, open, activeIndex, flatFiltered, updateValue]
    )

    const getOptionLabel = (val: string) =>
      options.find((o) => o.value === val)?.label ?? val

    const cls = [
      'ui-select',
      variant && `ui-select-${variant}`,
      size && `ui-select-${size}`,
      open && 'ui-select-open',
      disabled && 'ui-select-disabled',
      error && 'ui-select-error',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const displayValue = () => {
      if (multiple && selectedArray.length > 0) {
        return (
          <div className="ui-select-tags">
            {selectedArray.map((val) => (
              <span key={val} className="ui-select-tag">
                {getOptionLabel(val)}
                <button
                  className="ui-select-tag-remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateValue(val)
                  }}
                  aria-label={`Remove ${getOptionLabel(val)}`}
                  tabIndex={-1}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )
      }
      if (!multiple && selectedArray.length === 1) {
        return <span className="ui-select-value">{getOptionLabel(selectedArray[0])}</span>
      }
      return <span className="ui-select-placeholder">{placeholder}</span>
    }

    const hasValue = selectedArray.length > 0

    // Build a running index counter for keyboard navigation across groups
    let optionIndex = -1

    return (
      <div
        ref={(node) => {
          (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cls}
        style={style}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {label && (
          <label id={labelId} className="ui-select-label">
            {label}
          </label>
        )}

        <div
          className="ui-select-trigger"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${uid}-option-${activeIndex}` : undefined
          }
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            if (!disabled) setOpen(!open)
          }}
        >
          {displayValue()}
          <span className="ui-select-indicators">
            {clearable && hasValue && !disabled && (
              <button
                className="ui-select-clear"
                onClick={handleClear}
                aria-label="Clear selection"
                tabIndex={-1}
              >
                &times;
              </button>
            )}
            <span className="ui-select-arrow" aria-hidden="true">
              {open ? '\u25B4' : '\u25BE'}
            </span>
          </span>
        </div>

        {open && (
          <div
            ref={listRef}
            className="ui-select-dropdown"
            role="listbox"
            id={listboxId}
            aria-multiselectable={multiple || undefined}
            aria-labelledby={label ? labelId : undefined}
            style={{ maxHeight }}
          >
            {searchable && (
              <div className="ui-select-search-wrapper">
                <input
                  ref={searchRef}
                  className="ui-select-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  aria-label="Search options"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {flatFiltered.length === 0 ? (
              <div className="ui-select-empty">No options found</div>
            ) : (
              Array.from(groupedOptions.entries()).map(([group, groupOpts]) => (
                <div key={group || '__ungrouped'} className="ui-select-group">
                  {group && (
                    <div className="ui-select-group-label" role="presentation">
                      {group}
                    </div>
                  )}
                  {groupOpts.map((opt) => {
                    optionIndex++
                    const currentIdx = optionIndex
                    const isSelected = selectedArray.includes(opt.value)
                    const isActive = activeIndex === currentIdx
                    const optCls = [
                      'ui-select-option',
                      isSelected && 'ui-select-option-selected',
                      isActive && 'ui-select-option-active',
                      opt.disabled && 'ui-select-option-disabled',
                    ]
                      .filter(Boolean)
                      .join(' ')

                    return (
                      <div
                        key={opt.value}
                        id={`${uid}-option-${currentIdx}`}
                        className={optCls}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={opt.disabled || undefined}
                        onClick={() => {
                          if (!opt.disabled) updateValue(opt.value)
                        }}
                        onMouseEnter={() => setActiveIndex(currentIdx)}
                      >
                        {multiple && (
                          <span className="ui-select-check" aria-hidden="true">
                            {isSelected ? '\u2713' : ''}
                          </span>
                        )}
                        {opt.label}
                      </div>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        )}

        {error && (
          <div className="ui-select-error-msg" role="alert">
            {error}
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
