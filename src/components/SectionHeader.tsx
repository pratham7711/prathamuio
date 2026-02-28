import React from 'react'

export interface SectionHeaderProps {
  /** Small text above the title (e.g. "01 — About") */
  overline?: string
  /** Main heading */
  title: React.ReactNode
  /** Supporting description text */
  subtitle?: React.ReactNode
  /** Center-align content */
  centered?: boolean
  /** HTML heading level for the title (h1–h4) */
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  className?: string
}

/**
 * Overline + Title + Subtitle pattern for section headings.
 * The overline uses `--ui-accent` to provide visual hierarchy.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  overline,
  title,
  subtitle,
  centered = false,
  as: Tag = 'h2',
  className = '',
}) => {
  const cls = [
    'ui-section-header',
    centered ? 'ui-section-header-center' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls}>
      {overline && (
        <span className="ui-section-overline" aria-hidden="true">
          {overline}
        </span>
      )}
      <Tag className="ui-section-title">{title}</Tag>
      {subtitle && <p className="ui-section-subtitle">{subtitle}</p>}
    </div>
  )
}
