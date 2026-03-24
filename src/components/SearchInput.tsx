import React, { useState, useRef, useEffect, useCallback, useId } from 'react'

/** Visual variant for the search input */
export type SearchInputVariant = 'default' | 'filled' | 'ghost' | 'glass'

/** Size preset for the search input */
export type SearchInputSize = 'sm' | 'md' | 'lg'

/** A suggestion item in the dropdown */
export interface SearchSuggestion {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Optional description */
  description?: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Group header for grouped suggestions */
  group?: string
}

export interface SearchInputProps {
  /** Controlled value */
  value?: string
  /** Uncontrolled default value */
  defaultValue?: string
  /** Called on input change (debounced) */
  onChange?: (value: string) => void
  /** Called on Enter or search button click */
  onSearch?: (value: string) => void
  /** Called when a suggestion is selected */
  onSelect?: (suggestion: SearchSuggestion) => void
  /** Suggestion items */
  suggestions?: SearchSuggestion[]
  /** Show loading spinner in dropdown */
  loading?: boolean
  /** Visual variant */
  variant?: SearchInputVariant
  /** Size preset */
  size?: SearchInputSize
  /** Placeholder text */
  placeholder?: string
  /** Show search icon on the left */
  showSearchIcon?: boolean
  /** Show clear button when value is present */
  showClearButton?: boolean
  /** Show keyboard shortcut badge */
  showShortcut?: boolean
  /** Recent search strings */
  recentSearches?: string[]
  /** Called to clear recent searches */
  onClearRecent?: () => void
  /** Debounce delay in ms */
  debounce?: number
  /** Max suggestions to display */
  maxSuggestions?: number
  /** Message shown when no results */
  emptyMessage?: string
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * Search input with autocomplete dropdown, recent searches,
 * keyboard navigation, debounce, and grouped suggestions.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onChange,
      onSearch,
      onSelect,
      suggestions = [],
      loading = false,
      variant = 'default',
      size = 'md',
      placeholder = 'Search...',
      showSearchIcon = true,
      showClearButton = true,
      showShortcut = false,
      recentSearches,
      onClearRecent,
      debounce = 300,
      maxSuggestions = 8,
      emptyMessage = 'No results found',
      className,
      style,
    },
    ref
  ) => {
    const uid = useId()
    const listboxId = `${uid}-listbox`

    const [internalValue, setInternalValue] = useState(defaultValue)
    const inputValue = controlledValue ?? internalValue

    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Merge refs
    const mergedRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [ref]
    )

    // Click outside to close
    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Debounced onChange
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (controlledValue === undefined) setInternalValue(val)

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          onChange?.(val)
        }, debounce)

        setIsOpen(true)
        setActiveIndex(-1)
      },
      [controlledValue, onChange, debounce]
    )

    const visibleSuggestions = suggestions.slice(0, maxSuggestions)

    // Group suggestions
    const grouped = visibleSuggestions.reduce<{ group: string; items: SearchSuggestion[] }[]>(
      (acc, s) => {
        const g = s.group ?? ''
        const last = acc[acc.length - 1]
        if (last && last.group === g) {
          last.items.push(s)
        } else {
          acc.push({ group: g, items: [s] })
        }
        return acc
      },
      []
    )

    // Flat list for keyboard nav
    const flatItems: { type: 'suggestion'; item: SearchSuggestion }[] = visibleSuggestions.map(
      (s) => ({ type: 'suggestion', item: s })
    )
    const recentItems: { type: 'recent'; value: string }[] = (recentSearches ?? []).map((r) => ({
      type: 'recent',
      value: r,
    }))
    const showRecent = !!recentSearches?.length && !inputValue
    const totalItems = showRecent ? recentItems.length : flatItems.length

    const handleSelect = useCallback(
      (suggestion: SearchSuggestion) => {
        if (controlledValue === undefined) setInternalValue(suggestion.label)
        onSelect?.(suggestion)
        setIsOpen(false)
      },
      [controlledValue, onSelect]
    )

    const handleRecentClick = useCallback(
      (val: string) => {
        if (controlledValue === undefined) setInternalValue(val)
        onChange?.(val)
        onSearch?.(val)
        setIsOpen(false)
      },
      [controlledValue, onChange, onSearch]
    )

    const handleClear = useCallback(() => {
      if (controlledValue === undefined) setInternalValue('')
      onChange?.('')
      inputRef.current?.focus()
    }, [controlledValue, onChange])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setIsOpen(true)
          setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1))
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (activeIndex >= 0 && isOpen) {
            if (showRecent) {
              handleRecentClick(recentItems[activeIndex].value)
            } else if (flatItems[activeIndex]) {
              handleSelect(flatItems[activeIndex].item)
            }
          } else {
            onSearch?.(inputValue)
            setIsOpen(false)
          }
        } else if (e.key === 'Escape') {
          setIsOpen(false)
          setActiveIndex(-1)
        }
      },
      [
        totalItems,
        activeIndex,
        isOpen,
        showRecent,
        recentItems,
        flatItems,
        handleRecentClick,
        handleSelect,
        onSearch,
        inputValue,
      ]
    )

    const showDropdown = isOpen && (loading || totalItems > 0 || (inputValue && !showRecent))

    const activeDescendant =
      activeIndex >= 0 ? `${uid}-option-${activeIndex}` : undefined

    const cls = [
      'ui-search-input',
      `ui-search-input-${variant}`,
      `ui-search-input-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={containerRef} className={cls} style={style}>
        <div className="ui-search-input-field">
          {showSearchIcon && (
            <span className="ui-search-input-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          )}
          <input
            ref={mergedRef}
            type="text"
            className="ui-search-input-native"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={!!showDropdown}
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant}
            aria-autocomplete="list"
            aria-haspopup="listbox"
          />
          {showShortcut && !inputValue && (
            <span className="ui-search-input-shortcut" aria-hidden="true">
              ⌘K
            </span>
          )}
          {showClearButton && inputValue && (
            <button
              className="ui-search-input-clear"
              onClick={handleClear}
              type="button"
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="ui-search-input-dropdown" id={listboxId} role="listbox">
            {loading && (
              <div className="ui-search-input-loading">
                <span className="ui-search-input-spinner" />
                Searching...
              </div>
            )}

            {!loading && showRecent && (
              <div className="ui-search-input-recent">
                <div className="ui-search-input-recent-header">
                  <span>Recent searches</span>
                  {onClearRecent && (
                    <button
                      className="ui-search-input-recent-clear"
                      onClick={onClearRecent}
                      type="button"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {recentSearches!.map((r, i) => (
                  <div
                    key={r}
                    id={`${uid}-option-${i}`}
                    className={[
                      'ui-search-input-option',
                      'ui-search-input-option-recent',
                      activeIndex === i && 'ui-search-input-option-active',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    role="option"
                    aria-selected={activeIndex === i}
                    onClick={() => handleRecentClick(r)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}

            {!loading && !showRecent && visibleSuggestions.length === 0 && inputValue && (
              <div className="ui-search-input-empty">{emptyMessage}</div>
            )}

            {!loading &&
              !showRecent &&
              grouped.map((g) => (
                <div key={g.group} className="ui-search-input-group">
                  {g.group && (
                    <div className="ui-search-input-group-header">{g.group}</div>
                  )}
                  {g.items.map((s) => {
                    const idx = visibleSuggestions.indexOf(s)
                    return (
                      <div
                        key={s.id}
                        id={`${uid}-option-${idx}`}
                        className={[
                          'ui-search-input-option',
                          activeIndex === idx && 'ui-search-input-option-active',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        role="option"
                        aria-selected={activeIndex === idx}
                        onClick={() => handleSelect(s)}
                      >
                        {s.icon && <span className="ui-search-input-option-icon">{s.icon}</span>}
                        <div className="ui-search-input-option-text">
                          <span className="ui-search-input-option-label">{s.label}</span>
                          {s.description && (
                            <span className="ui-search-input-option-desc">{s.description}</span>
                          )}
                        </div>
                      </div>
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

SearchInput.displayName = 'SearchInput'
