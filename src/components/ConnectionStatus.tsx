import React from 'react'

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'unavailable'
export type ConnectionVariant = 'banner' | 'badge'

export interface ConnectionStatusProps {
  /** Current connection state */
  state: ConnectionState
  /** Display variant */
  variant?: ConnectionVariant
  /** Override the default label text */
  label?: string
  className?: string
}

const DEFAULT_LABELS: Record<ConnectionState, string> = {
  connected: 'Connected',
  connecting: 'Connecting…',
  disconnected: 'Disconnected',
  unavailable: 'Unavailable',
}

/**
 * Real-time connection status indicator.
 * - `banner`: full-width top bar (use at top of layout)
 * - `badge`: inline pill (use in toolbars, cards)
 *
 * The connecting state shows a pulsing dot.
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  state,
  variant = 'badge',
  label,
  className = '',
}) => {
  const text = label ?? DEFAULT_LABELS[state]
  const isPulsing = state === 'connecting'

  const cls = [
    variant === 'banner' ? 'ui-conn-banner' : 'ui-conn-badge',
    `ui-conn-${state}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cls}
      role="status"
      aria-live="polite"
      aria-label={`Connection status: ${text}`}
    >
      <span
        className={`ui-conn-dot${isPulsing ? ' ui-conn-dot-pulse' : ''}`}
        aria-hidden="true"
      />
      <span>{text}</span>
    </div>
  )
}
