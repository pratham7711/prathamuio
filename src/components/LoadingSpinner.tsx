import React from 'react'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface LoadingSpinnerProps {
  /** Size preset */
  size?: SpinnerSize
  /** Accessible label */
  label?: string
  className?: string
}

/**
 * Animated loading spinner using CSS border trick.
 * Uses `--ui-accent` for the active border color.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading…',
  className = '',
}) => {
  return (
    <span
      className={`ui-spinner ui-spinner-${size} ${className}`}
      role="status"
      aria-label={label}
    />
  )
}
