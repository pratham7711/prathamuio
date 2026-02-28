import React, { useState, useRef, useCallback } from 'react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** Tooltip label text */
  content: React.ReactNode
  /** Preferred placement */
  placement?: TooltipPlacement
  /** Show delay in ms */
  delay?: number
  children: React.ReactElement
}

/**
 * Lightweight tooltip using CSS positioning + tiny JS for show/hide delay.
 * No external positioning library — uses absolute CSS offsets.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  delay = 300,
  children,
}) => {
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    timer.current = setTimeout(() => setVisible(true), delay)
  }, [delay])

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setVisible(false)
  }, [])

  return (
    <span
      className="ui-tooltip-root"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          className={`ui-tooltip-box ui-tooltip-${placement}`}
          role="tooltip"
          aria-live="polite"
        >
          {content}
        </span>
      )}
    </span>
  )
}
