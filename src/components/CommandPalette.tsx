import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'

/** CommandPalette variant */
export type CommandPaletteVariant = 'default' | 'glass' | 'minimal'
/** CommandPalette size */
export type CommandPaletteSize = 'sm' | 'md' | 'lg'

/** A command or action in the palette */
export interface CommandItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Optional description text */
  description?: string
  /** Optional icon element */
  icon?: React.ReactNode
  /** Keyboard shortcut keys (rendered as KBD) */
  shortcut?: string[]
  /** Group heading this item belongs to */
  group?: string
  /** Called when this item is selected */
  onSelect: () => void
  /** Additional search keywords */
  keywords?: string[]
}

export interface CommandPaletteProps {
  /** Whether the palette is open */
  open: boolean
  /** Called when open state should change */
  onOpenChange: (open: boolean) => void
  /** Available commands */
  items: CommandItem[]
  /** Visual style */
  variant?: CommandPaletteVariant
  /** Size preset */
  size?: CommandPaletteSize
  /** Search input placeholder */
  placeholder?: string
  /** Message when no results match */
  emptyMessage?: string
  /** Recently used item ids (shown first when query is empty) */
  recentIds?: string[]
  /** Footer content */
  footer?: React.ReactNode
  /** Keyboard shortcut to open the palette */
  shortcut?: string[]
  /** Maximum results to show */
  maxResults?: number
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'

/**
 * Command palette (Cmd+K) for quick search and actions.
 * Features fuzzy search, grouped results, keyboard navigation,
 * recent items, and shortcut badges.
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  items,
  variant = 'default',
  size = 'md',
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  recentIds = [],
  footer,
  shortcut = ['Meta', 'k'],
  maxResults = 10,
  className,
  style,
}) => {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  /* ── Global shortcut listener ────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const match = shortcut.every((k) => {
        if (k === 'Meta') return e.metaKey
        if (k === 'Ctrl' || k === 'Control') return e.ctrlKey
        if (k === 'Alt') return e.altKey
        if (k === 'Shift') return e.shiftKey
        return e.key.toLowerCase() === k.toLowerCase()
      })
      if (match) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [shortcut, open, onOpenChange])

  /* ── Reset on open ───────────────────────────────── */
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  /* ── Fuzzy-ish matching ──────────────────────────── */
  const matchScore = useCallback((item: CommandItem, q: string): number => {
    const lower = q.toLowerCase()
    const labelLower = item.label.toLowerCase()
    if (labelLower === lower) return 100
    if (labelLower.startsWith(lower)) return 80
    if (labelLower.includes(lower)) return 60
    if (item.description?.toLowerCase().includes(lower)) return 40
    if (item.keywords?.some((kw) => kw.toLowerCase().includes(lower))) return 20
    return 0
  }, [])

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      // Show recent items first, then others
      const recentSet = new Set(recentIds)
      const recent = recentIds
        .map((id) => items.find((i) => i.id === id))
        .filter(Boolean) as CommandItem[]
      const rest = items.filter((i) => !recentSet.has(i.id))
      return [...recent, ...rest].slice(0, maxResults)
    }

    return items
      .map((item) => ({ item, score: matchScore(item, query.trim()) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(({ item }) => item)
  }, [query, items, recentIds, maxResults, matchScore])

  /* Group items */
  const grouped = useMemo(() => {
    const groups: { label: string | null; items: CommandItem[] }[] = []
    const seen = new Set<string | null>()
    for (const item of filteredItems) {
      const g = item.group ?? null
      if (!seen.has(g)) {
        seen.add(g)
        groups.push({ label: g, items: [] })
      }
      groups.find((gr) => gr.label === g)!.items.push(item)
    }
    return groups
  }, [filteredItems])

  /* ── Keyboard navigation ─────────────────────────── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onOpenChange(false)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (i + 1 < filteredItems.length ? i + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => (i - 1 >= 0 ? i - 1 : filteredItems.length - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = filteredItems[activeIndex]
        if (item) {
          item.onSelect()
          onOpenChange(false)
        }
      }
    },
    [filteredItems, activeIndex, onOpenChange]
  )

  /* Scroll active item into view */
  useEffect(() => {
    const active = listRef.current?.querySelector('[data-active="true"]') as HTMLElement | null
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  /* Reset active index on filter change */
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  if (!open) return null

  const cls = [
    'ui-cmd',
    `ui-cmd-${variant}`,
    `ui-cmd-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  let flatIdx = -1

  const palette = (
    <>
      <div
        className="ui-cmd-backdrop"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className={cls}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="ui-cmd-input-wrapper">
          <svg className="ui-cmd-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="ui-cmd-input"
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="ui-cmd-list"
            aria-activedescendant={
              filteredItems[activeIndex]
                ? `ui-cmd-item-${filteredItems[activeIndex].id}`
                : undefined
            }
            aria-autocomplete="list"
          />
        </div>

        {/* Results */}
        <div ref={listRef} className="ui-cmd-list" id="ui-cmd-list" role="listbox">
          {filteredItems.length === 0 ? (
            <div className="ui-cmd-empty">{emptyMessage}</div>
          ) : (
            grouped.map((group, gi) => (
              <div key={gi} className="ui-cmd-group">
                {group.label && (
                  <div className="ui-cmd-group-heading">{group.label}</div>
                )}
                {group.items.map((item) => {
                  flatIdx++
                  const idx = flatIdx
                  const isActive = idx === activeIndex
                  return (
                    <div
                      key={item.id}
                      id={`ui-cmd-item-${item.id}`}
                      className={[
                        'ui-cmd-item',
                        isActive ? 'ui-cmd-item-active' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onPointerMove={() => setActiveIndex(idx)}
                      onClick={() => {
                        item.onSelect()
                        onOpenChange(false)
                      }}
                    >
                      {item.icon && (
                        <span className="ui-cmd-item-icon" aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      <div className="ui-cmd-item-text">
                        <span className="ui-cmd-item-label">{item.label}</span>
                        {item.description && (
                          <span className="ui-cmd-item-desc">{item.description}</span>
                        )}
                      </div>
                      {item.shortcut && item.shortcut.length > 0 && (
                        <span className="ui-cmd-item-shortcut">
                          {item.shortcut.map((k, ki) => (
                            <kbd key={ki} className="ui-cmd-kbd">
                              {k}
                            </kbd>
                          ))}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {footer && <div className="ui-cmd-footer">{footer}</div>}
      </div>
    </>
  )

  return createPortal(palette, document.body)
}

CommandPalette.displayName = 'CommandPalette'
