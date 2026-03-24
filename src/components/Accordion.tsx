import React, { useState, useCallback, useId, createContext, useContext } from 'react'

/** Visual variant for the accordion */
export type AccordionVariant = 'default' | 'bordered' | 'separated' | 'ghost'

/** Size preset for the accordion */
export type AccordionSize = 'sm' | 'md' | 'lg'

export interface AccordionItemProps {
  /** Header label */
  title: string
  /** Content rendered when expanded */
  children?: React.ReactNode
  /** Whether this item starts expanded */
  defaultOpen?: boolean
  /** Disable toggle interaction */
  disabled?: boolean
  /** Custom expand/collapse icon */
  icon?: React.ReactNode
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: AccordionVariant
  /** Size preset */
  size?: AccordionSize
  /** Allow multiple items to be open simultaneously */
  allowMultiple?: boolean
  /** Accordion items (AccordionItem children) */
  children?: React.ReactNode
}

interface AccordionContextValue {
  openItems: Set<number>
  toggle: (index: number) => void
  registerDefault: (index: number) => void
  focusItem: (index: number) => void
  itemCount: number
  setItemCount: React.Dispatch<React.SetStateAction<number>>
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

const DefaultArrow: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Individual accordion panel. Must be used as a child of `Accordion`.
 * Supports keyboard navigation and smooth CSS height animation.
 */
export const AccordionItem: React.FC<AccordionItemProps & { _index?: number }> = ({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  icon,
  _index = 0,
}) => {
  const ctx = useContext(AccordionContext)
  const uid = useId()
  const triggerId = `ui-acc-trigger-${uid}`
  const panelId = `ui-acc-panel-${uid}`

  // Register default open on first render
  React.useEffect(() => {
    if (defaultOpen && ctx) {
      ctx.registerDefault(_index)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isOpen = ctx ? ctx.openItems.has(_index) : false

  const handleClick = () => {
    if (disabled || !ctx) return
    ctx.toggle(_index)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!ctx) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      ctx.focusItem(_index + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      ctx.focusItem(_index - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      ctx.focusItem(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      ctx.focusItem(ctx.itemCount - 1)
    }
  }

  return (
    <div className="ui-accordion-item">
      <button
        id={triggerId}
        className="ui-accordion-trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-accordion-trigger={_index}
        type="button"
      >
        <span>{title}</span>
        <span className={['ui-accordion-icon', isOpen ? 'ui-accordion-icon-open' : ''].filter(Boolean).join(' ')}>
          {icon || <DefaultArrow />}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={['ui-accordion-content', isOpen ? 'ui-accordion-content-open' : ''].filter(Boolean).join(' ')}
      >
        <div className="ui-accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  )
}

AccordionItem.displayName = 'AccordionItem'

/**
 * Compound accordion component. Wraps `AccordionItem` children and manages
 * open/close state. Supports single or multiple open items, keyboard
 * navigation (arrow keys, Home, End), and smooth CSS height animation.
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      variant = 'default',
      size = 'md',
      allowMultiple = false,
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set())
    const [itemCount, setItemCount] = useState(0)
    const rootRef = React.useRef<HTMLDivElement>(null)

    const registerDefault = useCallback((index: number) => {
      setOpenItems((prev) => {
        const next = new Set(prev)
        next.add(index)
        return next
      })
    }, [])

    const toggle = useCallback((index: number) => {
      setOpenItems((prev) => {
        const next = new Set(allowMultiple ? prev : [])
        if (prev.has(index)) {
          next.delete(index)
        } else {
          next.add(index)
        }
        return next
      })
    }, [allowMultiple])

    const focusItem = useCallback((index: number) => {
      const root = rootRef.current
      if (!root) return
      const triggers = root.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]')
      const count = triggers.length
      if (count === 0) return
      const targetIndex = ((index % count) + count) % count
      triggers[targetIndex]?.focus()
    }, [])

    // Inject _index prop into AccordionItem children
    const items = React.Children.toArray(children)
    const indexedChildren = items.map((child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<{ _index: number }>, { _index: index })
      }
      return child
    })

    // Track item count
    React.useEffect(() => {
      setItemCount(items.length)
    }, [items.length])

    const cls = [
      'ui-accordion',
      `ui-accordion-${variant}`,
      `ui-accordion-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <AccordionContext.Provider value={{ openItems, toggle, registerDefault, focusItem, itemCount, setItemCount }}>
        <div
          ref={(node) => {
            (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          }}
          className={cls}
          {...rest}
        >
          {indexedChildren}
        </div>
      </AccordionContext.Provider>
    )
  }
)

Accordion.displayName = 'Accordion'
