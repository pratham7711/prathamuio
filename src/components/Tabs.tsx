import React from 'react'

export interface TabItem {
  /** Display label */
  label: string
  /** Unique value identifier */
  value: string
  /** Optional icon */
  icon?: React.ReactNode
}

export type TabsVariant = 'pills' | 'underline' | 'solid'

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tab items to render */
  items: TabItem[]
  /** Currently active tab value */
  activeTab: string
  /** Called when a tab is selected */
  onChange: (value: string) => void
  /** Visual style variant */
  variant?: TabsVariant
}

/**
 * Tab navigation component. Supports pills, underline, and solid variants.
 * Fully accessible with keyboard navigation and ARIA attributes.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
      activeTab,
      onChange,
      variant = 'underline',
      className = '',
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-tabs',
      `ui-tabs-${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      let nextIndex = index
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextIndex = (index + 1) % items.length
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        nextIndex = (index - 1 + items.length) % items.length
      } else if (e.key === 'Home') {
        e.preventDefault()
        nextIndex = 0
      } else if (e.key === 'End') {
        e.preventDefault()
        nextIndex = items.length - 1
      } else {
        return
      }
      onChange(items[nextIndex].value)
      const tabList = e.currentTarget.parentElement
      if (tabList) {
        const tabs = tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        tabs[nextIndex]?.focus()
      }
    }

    return (
      <div ref={ref} className={cls} {...rest}>
        <div className="ui-tabs-list" role="tablist">
          {items.map((item, index) => {
            const isActive = item.value === activeTab
            const tabCls = [
              'ui-tab',
              isActive ? 'ui-tab-active' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button
                key={item.value}
                className={tabCls}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onChange(item.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {item.icon && <span className="ui-tab-icon" aria-hidden="true">{item.icon}</span>}
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

Tabs.displayName = 'Tabs'
