import React from 'react'

/** KBD variant */
export type KBDVariant = 'default' | 'outlined' | 'ghost' | 'glass'
/** KBD size */
export type KBDSize = 'xs' | 'sm' | 'md' | 'lg'

export interface KBDProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual style of the keyboard key */
  variant?: KBDVariant
  /** Size preset */
  size?: KBDSize
  children?: React.ReactNode
}

/**
 * Keyboard shortcut display component. Shows keyboard keys in a styled
 * inline element with a raised key-cap appearance.
 */
export const KBD = React.forwardRef<HTMLElement, KBDProps>(
  ({ variant = 'default', size = 'sm', className, children, ...rest }, ref) => {
    const cls = [
      'ui-kbd',
      `ui-kbd-${variant}`,
      `ui-kbd-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <kbd ref={ref} className={cls} role="text" {...rest}>
        {children}
      </kbd>
    )
  }
)

KBD.displayName = 'KBD'

/* ── KBDCombo ─────────────────────────────────────── */

export interface KBDComboProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Array of key labels to render */
  keys: string[]
  /** Separator between keys */
  separator?: React.ReactNode
  /** Visual style of each key */
  variant?: KBDVariant
  /** Size preset */
  size?: KBDSize
}

/**
 * Renders a combination of keyboard keys with separators between them.
 */
export const KBDCombo = React.forwardRef<HTMLSpanElement, KBDComboProps>(
  (
    {
      keys,
      separator = '+',
      variant = 'default',
      size = 'sm',
      className,
      ...rest
    },
    ref
  ) => {
    const cls = ['ui-kbd-combo', className].filter(Boolean).join(' ')

    return (
      <span
        ref={ref}
        className={cls}
        role="text"
        aria-label={keys.join(' + ')}
        {...rest}
      >
        {keys.map((key, i) => (
          <React.Fragment key={i}>
            <KBD variant={variant} size={size}>
              {key}
            </KBD>
            {i < keys.length - 1 && (
              <span className="ui-kbd-separator" aria-hidden="true">
                {separator}
              </span>
            )}
          </React.Fragment>
        ))}
      </span>
    )
  }
)

KBDCombo.displayName = 'KBDCombo'

/* ── formatShortcut helper ────────────────────────── */

/**
 * Converts generic key names to platform-specific display strings.
 * 'Meta' becomes Command on Mac and 'Ctrl' on Windows.
 * 'Alt' becomes Option on Mac.
 */
export function formatShortcut(
  keys: string[],
  platform: 'mac' | 'windows' | 'auto' = 'auto'
): string[] {
  const resolved =
    platform === 'auto'
      ? typeof navigator !== 'undefined' &&
        /mac/i.test(navigator.platform)
        ? 'mac'
        : 'windows'
      : platform

  const map: Record<string, Record<string, string>> = {
    mac: { Meta: '\u2318', Alt: '\u2325', Shift: '\u21E7', Control: '\u2303', Ctrl: '\u2303' },
    windows: { Meta: 'Ctrl', '\u2318': 'Ctrl', '\u2325': 'Alt', '\u21E7': 'Shift', '\u2303': 'Ctrl' },
  }

  return keys.map((k) => map[resolved]?.[k] ?? k)
}
