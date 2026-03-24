import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

/** Popover placement relative to trigger */
export type PopoverPlacement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'top-start' | 'top-end'
  | 'bottom-start' | 'bottom-end'

/** How the popover is triggered */
export type PopoverTrigger = 'click' | 'hover'

/** Size preset for popover */
export type PopoverSize = 'sm' | 'md' | 'lg'

export interface PopoverProps {
  /** Popover body content */
  content: React.ReactNode
  /** Preferred placement relative to trigger */
  placement?: PopoverPlacement
  /** Trigger mode */
  trigger?: PopoverTrigger
  /** Size preset */
  size?: PopoverSize
  /** Optional heading inside popover */
  title?: string
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Distance from trigger in px */
  offset?: number
  /** Show arrow pointing at trigger */
  arrow?: boolean
  /** Additional class for the popover content */
  className?: string
  /** Additional style for the popover content */
  style?: React.CSSProperties
  /** Trigger element */
  children: React.ReactElement
}

/**
 * Popover component with configurable placement, trigger mode, and arrow.
 * Positions via getBoundingClientRect (no external deps). Supports click
 * and hover triggers, keyboard dismiss (Escape), click-outside close,
 * and portal rendering to body.
 */
export const Popover: React.FC<PopoverProps> = ({
  content,
  placement = 'bottom',
  trigger = 'click',
  size = 'md',
  title,
  open: controlledOpen,
  onOpenChange,
  offset = 8,
  arrow = true,
  className = '',
  style,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const triggerRef = useRef<HTMLElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }, [isControlled, onOpenChange])

  // Calculate position
  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current
    const popoverEl = popoverRef.current
    if (!triggerEl || !popoverEl) return

    const rect = triggerEl.getBoundingClientRect()
    const popRect = popoverEl.getBoundingClientRect()
    const base = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right'
    const align = placement.split('-')[1] as 'start' | 'end' | undefined

    let top = 0
    let left = 0

    if (base === 'top') {
      top = rect.top - popRect.height - offset
      left = rect.left + rect.width / 2 - popRect.width / 2
    } else if (base === 'bottom') {
      top = rect.bottom + offset
      left = rect.left + rect.width / 2 - popRect.width / 2
    } else if (base === 'left') {
      top = rect.top + rect.height / 2 - popRect.height / 2
      left = rect.left - popRect.width - offset
    } else if (base === 'right') {
      top = rect.top + rect.height / 2 - popRect.height / 2
      left = rect.right + offset
    }

    // Handle start/end alignment
    if (align === 'start') {
      if (base === 'top' || base === 'bottom') left = rect.left
      if (base === 'left' || base === 'right') top = rect.top
    } else if (align === 'end') {
      if (base === 'top' || base === 'bottom') left = rect.right - popRect.width
      if (base === 'left' || base === 'right') top = rect.bottom - popRect.height
    }

    setPos({ top, left })
  }, [placement, offset])

  // Reposition on open and scroll/resize
  useEffect(() => {
    if (!isOpen) return
    // Use rAF to measure after paint
    const frame = requestAnimationFrame(updatePosition)

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, updatePosition])

  // Click outside to close
  useEffect(() => {
    if (!isOpen || trigger !== 'click') return
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        popoverRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, trigger, setOpen])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, setOpen])

  // Trigger handlers
  const handleTriggerClick = () => {
    if (trigger !== 'click') return
    setOpen(!isOpen)
  }

  const handleMouseEnter = () => {
    if (trigger !== 'hover') return
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current)
    hoverOpenTimer.current = setTimeout(() => setOpen(true), 150)
  }

  const handleMouseLeave = () => {
    if (trigger !== 'hover') return
    if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current)
    hoverCloseTimer.current = setTimeout(() => setOpen(false), 100)
  }

  const handlePopoverEnter = () => {
    if (trigger !== 'hover') return
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current)
  }

  const handlePopoverLeave = () => {
    if (trigger !== 'hover') return
    hoverCloseTimer.current = setTimeout(() => setOpen(false), 100)
  }

  // Clone child to attach ref and handlers
  const childProps = children.props as Record<string, unknown>
  const triggerElement = React.cloneElement(children, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      handleTriggerClick()
      ;(childProps.onClick as ((e: React.MouseEvent) => void) | undefined)?.(e)
    },
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter()
      ;(childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e)
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave()
      ;(childProps.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e)
    },
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen,
  } as Record<string, unknown>)

  const arrowBase = placement.split('-')[0] as string

  const popoverCls = [
    'ui-popover',
    `ui-popover-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {triggerElement}
      {isOpen && createPortal(
        <div
          ref={popoverRef}
          className={popoverCls}
          style={{ top: pos.top, left: pos.left, ...style }}
          role="dialog"
          onMouseEnter={handlePopoverEnter}
          onMouseLeave={handlePopoverLeave}
        >
          {arrow && (
            <span className={`ui-popover-arrow ui-popover-arrow-${arrowBase}`} />
          )}
          {title && <div className="ui-popover-title">{title}</div>}
          <div className="ui-popover-body">{content}</div>
        </div>,
        document.body
      )}
    </>
  )
}

Popover.displayName = 'Popover'
