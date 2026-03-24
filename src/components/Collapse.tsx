import React, { useState, useCallback, useId } from 'react'

/** Visual variant for the collapse */
export type CollapseVariant = 'default' | 'bordered' | 'ghost' | 'card'

/** Size preset for the collapse */
export type CollapseSize = 'sm' | 'md' | 'lg'

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled open state */
  open?: boolean
  /** Initial open state for uncontrolled mode */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Visual style variant */
  variant?: CollapseVariant
  /** Size preset */
  size?: CollapseSize
  /** Custom trigger content (replaces default header bar) */
  trigger?: React.ReactNode
  /** Title text used as trigger if no custom trigger provided */
  title?: string
  /** Custom expand/collapse icon */
  icon?: React.ReactNode
  /** Disable toggle interaction */
  disabled?: boolean
  /** Enable smooth height animation (default true) */
  animate?: boolean
  /** Collapsible content */
  children?: React.ReactNode
}

const DefaultArrow: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Collapsible content section. Simpler than Accordion — no group management.
 * Supports controlled and uncontrolled modes, smooth CSS height animation,
 * keyboard navigation (Enter/Space), and full ARIA attributes.
 */
export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      variant = 'default',
      size = 'md',
      trigger,
      title,
      icon,
      disabled = false,
      animate = true,
      children,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const isOpen = isControlled ? controlledOpen : internalOpen

    const uid = useId()
    const triggerId = `ui-collapse-trigger-${uid}`
    const panelId = `ui-collapse-panel-${uid}`

    const toggle = useCallback(() => {
      if (disabled) return
      const next = !isOpen
      if (!isControlled) {
        setInternalOpen(next)
      }
      onOpenChange?.(next)
    }, [disabled, isOpen, isControlled, onOpenChange])

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    }

    const cls = [
      'ui-collapse',
      `ui-collapse-${variant}`,
      `ui-collapse-${size}`,
      isOpen ? 'ui-collapse-open' : '',
      disabled ? 'ui-collapse-disabled' : '',
      animate ? 'ui-collapse-animate' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={cls} style={style} {...rest}>
        <button
          id={triggerId}
          className="ui-collapse-trigger"
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          disabled={disabled}
          onClick={toggle}
          onKeyDown={handleKeyDown}
        >
          {trigger || (
            <>
              <span className="ui-collapse-title">{title}</span>
              <span className={['ui-collapse-icon', isOpen ? 'ui-collapse-icon-open' : ''].filter(Boolean).join(' ')}>
                {icon || <DefaultArrow />}
              </span>
            </>
          )}
        </button>
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className={['ui-collapse-content', isOpen ? 'ui-collapse-content-open' : ''].filter(Boolean).join(' ')}
        >
          <div className="ui-collapse-content-inner">
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Collapse.displayName = 'Collapse'
