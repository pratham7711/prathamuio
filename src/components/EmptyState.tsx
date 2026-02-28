import React from 'react'

export interface EmptyStateProps {
  /** Icon (emoji, SVG, or ReactNode) */
  icon?: React.ReactNode
  /** Heading text */
  title: string
  /** Descriptive text */
  description?: string
  /** Action element (e.g. a Button) */
  action?: React.ReactNode
  className?: string
}

/**
 * Empty state illustration for zero-data screens.
 * Shows icon, title, description, and optional action.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`ui-empty ${className}`} role="status">
      {icon && (
        <div className="ui-empty-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="ui-empty-title">{title}</h3>
      {description && <p className="ui-empty-desc">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
