import React, { useState, useRef, useEffect, useCallback } from 'react'

export interface DropdownItem {
  /** Display label */
  label: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Click handler */
  onClick?: () => void
  /** Renders as danger/destructive item */
  danger?: boolean
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Trigger element that opens the menu */
  trigger: React.ReactNode
  /** Menu items */
  items: DropdownItem[]
  /** Menu alignment relative to trigger */
  align?: 'left' | 'right'
}

/**
 * Dropdown menu component. Click trigger to open, click outside or Escape to close.
 * Supports keyboard navigation with arrow keys.
 */
export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      items,
      align = 'left',
      className = '',
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [focusIndex, setFocusIndex] = useState(-1)
    const rootRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const close = useCallback(() => {
      setOpen(false)
      setFocusIndex(-1)
    }, [])

    // Click outside
    useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          close()
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open, close])

    // Escape key
    useEffect(() => {
      if (!open) return
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close()
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [open, close])

    // Focus management for keyboard nav
    useEffect(() => {
      if (!open || focusIndex < 0) return
      const menu = menuRef.current
      if (menu) {
        const btns = menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
        btns[focusIndex]?.focus()
      }
    }, [focusIndex, open])

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen(true)
          setFocusIndex(0)
        }
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusIndex((prev) => (prev + 1) % items.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusIndex((prev) => (prev - 1 + items.length) % items.length)
      } else if (e.key === 'Home') {
        e.preventDefault()
        setFocusIndex(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setFocusIndex(items.length - 1)
      }
    }

    const cls = [
      'ui-dropdown',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={(node) => {
          (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cls}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <div
          className="ui-dropdown-trigger"
          onClick={() => { setOpen(!open); if (!open) setFocusIndex(-1) }}
          aria-haspopup="true"
          aria-expanded={open}
        >
          {trigger}
        </div>
        {open && (
          <div
            ref={menuRef}
            className={`ui-dropdown-menu ui-dropdown-${align}`}
            role="menu"
          >
            {items.map((item, index) => {
              const itemCls = [
                'ui-dropdown-item',
                item.danger ? 'ui-dropdown-item-danger' : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <button
                  key={index}
                  className={itemCls}
                  role="menuitem"
                  tabIndex={focusIndex === index ? 0 : -1}
                  onClick={() => {
                    item.onClick?.()
                    close()
                  }}
                >
                  {item.icon && <span className="ui-dropdown-icon" aria-hidden="true">{item.icon}</span>}
                  {item.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

Dropdown.displayName = 'Dropdown'
