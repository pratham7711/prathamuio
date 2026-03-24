import React, { useState, useCallback, useRef, useEffect } from 'react'

/** Sidebar variant */
export type SidebarVariant = 'default' | 'glass' | 'floating' | 'compact'
/** Sidebar size */
export type SidebarSize = 'sm' | 'md' | 'lg'

/** A single navigation item in the sidebar */
export interface SidebarItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Optional icon element */
  icon?: React.ReactNode
  /** Navigation URL */
  href?: string
  /** Click handler */
  onClick?: () => void
  /** Nested child items */
  children?: SidebarItem[]
  /** Badge value shown at end of item */
  badge?: string | number
  /** Whether this item is non-interactive */
  disabled?: boolean
  /** Render a horizontal divider instead of an item */
  divider?: boolean
}

export interface SidebarProps {
  /** Navigation items */
  items: SidebarItem[]
  /** Visual style */
  variant?: SidebarVariant
  /** Size preset */
  size?: SidebarSize
  /** Currently active item id */
  activeId?: string
  /** Called when an item is clicked */
  onItemClick?: (item: SidebarItem) => void
  /** Whether the sidebar is collapsed (icon-only mode) */
  collapsed?: boolean
  /** Called when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void
  /** Show the collapse toggle button */
  collapsible?: boolean
  /** Header content (logo/brand) */
  header?: React.ReactNode
  /** Footer content (user profile etc.) */
  footer?: React.ReactNode
  /** Expanded width in px */
  width?: number
  /** Collapsed width in px */
  collapsedWidth?: number
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * Navigation sidebar component. Supports nested items, collapsed icon-only
 * mode with tooltips, multiple variants, badges, dividers, and full
 * keyboard navigation with ARIA tree pattern.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  variant = 'default',
  size = 'md',
  activeId,
  onItemClick,
  collapsed = false,
  onCollapseChange,
  collapsible = true,
  header,
  footer,
  width = 260,
  collapsedWidth = 64,
  className,
  style,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const navRef = useRef<HTMLElement>(null)

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const cls = [
    'ui-sidebar',
    `ui-sidebar-${variant}`,
    `ui-sidebar-${size}`,
    collapsed ? 'ui-sidebar-collapsed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const currentWidth = collapsed ? collapsedWidth : width

  /* Keyboard navigation helpers */
  const handleNavKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const target = e.target as HTMLElement
      if (!target.classList.contains('ui-sidebar-item-btn')) return

      const allBtns = Array.from(
        navRef.current?.querySelectorAll<HTMLElement>('.ui-sidebar-item-btn:not([disabled])') ?? []
      )
      const idx = allBtns.indexOf(target)
      if (idx < 0) return

      let nextIdx = -1
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        nextIdx = idx + 1 < allBtns.length ? idx + 1 : 0
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        nextIdx = idx - 1 >= 0 ? idx - 1 : allBtns.length - 1
      } else if (e.key === 'ArrowRight') {
        const itemId = target.dataset.itemId
        if (itemId && !expandedIds.has(itemId)) {
          e.preventDefault()
          toggleExpanded(itemId)
        }
      } else if (e.key === 'ArrowLeft') {
        const itemId = target.dataset.itemId
        if (itemId && expandedIds.has(itemId)) {
          e.preventDefault()
          toggleExpanded(itemId)
        }
      }

      if (nextIdx >= 0) allBtns[nextIdx]?.focus()
    },
    [expandedIds, toggleExpanded]
  )

  const renderItem = (item: SidebarItem, depth: number = 0) => {
    if (item.divider) {
      return <li key={item.id} className="ui-sidebar-divider" role="separator" />
    }

    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedIds.has(item.id)
    const isActive = activeId === item.id

    const handleClick = () => {
      if (item.disabled) return
      if (hasChildren) toggleExpanded(item.id)
      if (item.onClick) item.onClick()
      if (onItemClick) onItemClick(item)
    }

    const Tag = item.href ? 'a' : 'button'
    const tagProps: Record<string, unknown> = item.href
      ? { href: item.href }
      : { type: 'button' }

    return (
      <li key={item.id} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
        <Tag
          {...tagProps}
          className={[
            'ui-sidebar-item-btn',
            isActive ? 'ui-sidebar-item-active' : '',
            item.disabled ? 'ui-sidebar-item-disabled' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ paddingLeft: collapsed ? undefined : `${16 + depth * 16}px` }}
          data-item-id={hasChildren ? item.id : undefined}
          onClick={handleClick}
          disabled={item.disabled && Tag === 'button' ? true : undefined}
          aria-current={isActive ? 'page' : undefined}
          title={collapsed ? item.label : undefined}
          tabIndex={0}
        >
          {item.icon && (
            <span className="ui-sidebar-item-icon" aria-hidden="true">
              {item.icon}
            </span>
          )}
          {!collapsed && (
            <span className="ui-sidebar-item-label">{item.label}</span>
          )}
          {!collapsed && item.badge != null && (
            <span className="ui-sidebar-item-badge">{item.badge}</span>
          )}
          {!collapsed && hasChildren && (
            <span
              className={[
                'ui-sidebar-item-chevron',
                isExpanded ? 'ui-sidebar-item-chevron-open' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden="true"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </Tag>
        {hasChildren && isExpanded && !collapsed && (
          <ul className="ui-sidebar-submenu" role="group">
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <nav
      ref={navRef}
      className={cls}
      style={{ width: currentWidth, ...style }}
      aria-label="Sidebar navigation"
      onKeyDown={handleNavKeyDown}
    >
      {header && <div className="ui-sidebar-header">{header}</div>}

      <ul className="ui-sidebar-items" role="tree">
        {items.map((item) => renderItem(item, 0))}
      </ul>

      {footer && <div className="ui-sidebar-footer">{footer}</div>}

      {collapsible && (
        <button
          className="ui-sidebar-collapse-btn"
          onClick={() => onCollapseChange?.(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ transform: collapsed ? 'rotate(180deg)' : undefined }}
          >
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </nav>
  )
}

Sidebar.displayName = 'Sidebar'
