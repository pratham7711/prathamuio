import React, { useState, useEffect, useCallback, useRef } from 'react'

/** ThemeSwitcher variant */
export type ThemeSwitcherVariant = 'toggle' | 'dropdown' | 'segmented' | 'icon'
/** ThemeSwitcher size */
export type ThemeSwitcherSize = 'sm' | 'md' | 'lg'

/** A theme option */
export interface ThemeOption {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Optional icon element */
  icon?: React.ReactNode
  /** Optional preview colors */
  colors?: { primary: string; bg: string }
}

/* ── Default SVG icons ─────────────────────────────── */

const SunIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const MoonIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M13.5 9.2A5.5 5.5 0 0 1 6.8 2.5 5.5 5.5 0 1 0 13.5 9.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

const SystemIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="2" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 14h5M8 11v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const DEFAULT_OPTIONS: ThemeOption[] = [
  { id: 'dark', label: 'Dark', icon: <MoonIcon /> },
  { id: 'light', label: 'Light', icon: <SunIcon /> },
]

export interface ThemeSwitcherProps {
  /** Controlled current theme id */
  value?: string
  /** Default theme id (uncontrolled) */
  defaultValue?: string
  /** Called when the theme changes */
  onChange?: (themeId: string) => void
  /** Available theme options */
  options?: ThemeOption[]
  /** Visual style */
  variant?: ThemeSwitcherVariant
  /** Size preset */
  size?: ThemeSwitcherSize
  /** Show label text next to icon */
  showLabel?: boolean
  /** Show color preview dots */
  showPreview?: boolean
  /** Apply data-theme attribute to document root */
  applyToDocument?: boolean
  /** localStorage key for persistence */
  storageKey?: string
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * Theme toggle component for switching between themes/color modes.
 * Supports toggle, dropdown, segmented, and icon-cycling variants.
 * Persists choice to localStorage and applies data-theme to the document.
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  options = DEFAULT_OPTIONS,
  variant = 'toggle',
  size = 'md',
  showLabel = false,
  showPreview = false,
  applyToDocument = true,
  storageKey = 'ui-theme',
  className,
  style,
}) => {
  const isControlled = controlledValue !== undefined
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  /* Resolve initial value: controlled > stored > prefers-color-scheme > first option */
  const getInitial = (): string => {
    if (controlledValue) return controlledValue
    if (defaultValue) return defaultValue
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored && options.some((o) => o.id === stored)) return stored
      if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
        const light = options.find((o) => o.id === 'light')
        if (light) return light.id
      }
    }
    return options[0]?.id ?? 'dark'
  }

  const [internalValue, setInternalValue] = useState(getInitial)
  const currentValue = isControlled ? controlledValue! : internalValue
  const currentOption = options.find((o) => o.id === currentValue) ?? options[0]

  const applyTheme = useCallback(
    (id: string) => {
      if (applyToDocument && typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', id)
      }
      if (storageKey && typeof localStorage !== 'undefined') {
        localStorage.setItem(storageKey, id)
      }
    },
    [applyToDocument, storageKey]
  )

  const selectTheme = useCallback(
    (id: string) => {
      if (!isControlled) setInternalValue(id)
      applyTheme(id)
      onChange?.(id)
      setDropdownOpen(false)
    },
    [isControlled, applyTheme, onChange]
  )

  /* Apply on mount and when value changes */
  useEffect(() => {
    applyTheme(currentValue)
  }, [currentValue, applyTheme])

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!dropdownOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [dropdownOpen])

  const cls = [
    'ui-theme-switcher',
    `ui-theme-switcher-${variant}`,
    `ui-theme-switcher-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const renderPreview = (opt: ThemeOption) =>
    showPreview && opt.colors ? (
      <span
        className="ui-theme-switcher-preview"
        style={{ background: opt.colors.primary }}
        aria-hidden="true"
      />
    ) : null

  /* ── Toggle variant ─────────────────────────────── */
  if (variant === 'toggle') {
    const nextIdx = (options.findIndex((o) => o.id === currentValue) + 1) % options.length
    return (
      <button
        className={cls}
        style={style}
        onClick={() => selectTheme(options[nextIdx].id)}
        aria-label={`Switch to ${options[nextIdx].label} theme`}
        type="button"
      >
        <span className="ui-theme-switcher-icon">{currentOption?.icon}</span>
        {showLabel && <span className="ui-theme-switcher-label">{currentOption?.label}</span>}
        {renderPreview(currentOption!)}
      </button>
    )
  }

  /* ── Icon variant (cycle) ───────────────────────── */
  if (variant === 'icon') {
    const nextIdx = (options.findIndex((o) => o.id === currentValue) + 1) % options.length
    return (
      <button
        className={cls}
        style={style}
        onClick={() => selectTheme(options[nextIdx].id)}
        aria-label={`Current theme: ${currentOption?.label}. Switch to ${options[nextIdx].label}`}
        type="button"
      >
        <span className="ui-theme-switcher-icon">{currentOption?.icon}</span>
      </button>
    )
  }

  /* ── Segmented variant ──────────────────────────── */
  if (variant === 'segmented') {
    return (
      <div className={cls} style={style} role="radiogroup" aria-label="Theme selection">
        {options.map((opt) => (
          <button
            key={opt.id}
            className={[
              'ui-theme-switcher-segment',
              opt.id === currentValue ? 'ui-theme-switcher-segment-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => selectTheme(opt.id)}
            role="radio"
            aria-checked={opt.id === currentValue}
            type="button"
          >
            {opt.icon && <span className="ui-theme-switcher-icon">{opt.icon}</span>}
            {showLabel && <span className="ui-theme-switcher-label">{opt.label}</span>}
            {renderPreview(opt)}
          </button>
        ))}
      </div>
    )
  }

  /* ── Dropdown variant ───────────────────────────── */
  return (
    <div className={cls} style={style} ref={dropdownRef}>
      <button
        className="ui-theme-switcher-trigger"
        onClick={() => setDropdownOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        aria-label={`Theme: ${currentOption?.label}`}
        type="button"
      >
        {currentOption?.icon && (
          <span className="ui-theme-switcher-icon">{currentOption.icon}</span>
        )}
        {showLabel && <span className="ui-theme-switcher-label">{currentOption?.label}</span>}
        <svg className="ui-theme-switcher-caret" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {dropdownOpen && (
        <ul className="ui-theme-switcher-menu" role="listbox" aria-label="Theme options">
          {options.map((opt) => (
            <li
              key={opt.id}
              className={[
                'ui-theme-switcher-menu-item',
                opt.id === currentValue ? 'ui-theme-switcher-menu-item-active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="option"
              aria-selected={opt.id === currentValue}
              onClick={() => selectTheme(opt.id)}
            >
              {opt.icon && <span className="ui-theme-switcher-icon">{opt.icon}</span>}
              <span className="ui-theme-switcher-label">{opt.label}</span>
              {renderPreview(opt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

ThemeSwitcher.displayName = 'ThemeSwitcher'
