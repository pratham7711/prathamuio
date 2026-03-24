import React from 'react'

/** Visual variant for timeline layout */
export type TimelineVariant = 'default' | 'alternate' | 'compact'

/** Size preset for timeline */
export type TimelineSize = 'sm' | 'md' | 'lg'

/** Color for timeline item dot */
export type TimelineColor = 'accent' | 'success' | 'warning' | 'danger' | 'neutral'

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout variant */
  variant?: TimelineVariant
  /** Size preset */
  size?: TimelineSize
  /** Orientation */
  orientation?: 'vertical' | 'horizontal'
  /** Timeline items */
  children: React.ReactNode
}

export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom icon for the dot */
  icon?: React.ReactNode
  /** Color of the dot and connector */
  color?: TimelineColor
  /** Title text */
  title: string
  /** Subtitle text */
  subtitle?: string
  /** Timestamp string */
  timestamp?: string
  /** Whether this item is active/highlighted */
  active?: boolean
  /** Body content */
  children?: React.ReactNode
}

/**
 * Timeline component that displays chronological events.
 * Supports vertical/horizontal orientation, alternate layout, and compact mode.
 */
export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      variant = 'default',
      size = 'md',
      orientation = 'vertical',
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-timeline',
      `ui-timeline-${variant}`,
      `ui-timeline-${size}`,
      `ui-timeline-${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={cls} role="list" {...rest}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement<TimelineItemProps>(child)) return child
          return React.cloneElement(child, {
            ...child.props,
            'data-index': index,
            'data-side': variant === 'alternate' ? (index % 2 === 0 ? 'left' : 'right') : undefined,
          } as Partial<TimelineItemProps> & Record<string, unknown>)
        })}
      </div>
    )
  }
)

Timeline.displayName = 'Timeline'

/**
 * Individual item within a Timeline.
 * Renders a dot, optional icon, title, subtitle, timestamp, and body content.
 */
export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps & { 'data-index'?: number; 'data-side'?: string }>(
  (
    {
      icon,
      color = 'accent',
      title,
      subtitle,
      timestamp,
      active = false,
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-timeline-item',
      `ui-timeline-item-${color}`,
      active && 'ui-timeline-item-active',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={cls} role="listitem" {...rest}>
        <div className="ui-timeline-marker">
          <span className={['ui-timeline-dot', active && 'ui-timeline-dot-active'].filter(Boolean).join(' ')}>
            {icon || <span className="ui-timeline-dot-inner" />}
          </span>
          <span className="ui-timeline-connector" aria-hidden="true" />
        </div>
        <div className="ui-timeline-content">
          <div className="ui-timeline-header">
            <span className="ui-timeline-title">{title}</span>
            {timestamp && <span className="ui-timeline-timestamp">{timestamp}</span>}
          </div>
          {subtitle && <span className="ui-timeline-subtitle">{subtitle}</span>}
          {children && <div className="ui-timeline-body">{children}</div>}
        </div>
      </div>
    )
  }
)

TimelineItem.displayName = 'TimelineItem'
