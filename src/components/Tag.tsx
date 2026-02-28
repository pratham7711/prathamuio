import React from 'react'

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Outlined style (transparent background) */
  outlined?: boolean
  /** Make tag clickable */
  clickable?: boolean
  /** Icon shown before label */
  icon?: React.ReactNode
  /** Show remove (×) button */
  removable?: boolean
  /** Called when remove button is clicked */
  onRemove?: () => void
  children?: React.ReactNode
}

/**
 * Compact chip/tag for categories, skills, filters.
 * Supports outlined style, icons, remove button, and click interactions.
 */
export const Tag: React.FC<TagProps> = ({
  outlined = false,
  clickable = false,
  icon,
  removable = false,
  onRemove,
  className = '',
  children,
  onClick,
  ...rest
}) => {
  const cls = [
    'ui-tag',
    outlined ? 'ui-tag-outlined' : '',
    clickable ? 'ui-tag-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={cls}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if ((e.key === 'Enter' || e.key === ' ') && onClick) {
                onClick(e as unknown as React.MouseEvent<HTMLSpanElement>)
              }
            }
          : undefined
      }
      {...rest}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
      {removable && (
        <button
          className="ui-tag-remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          aria-label="Remove tag"
        >
          ×
        </button>
      )}
    </span>
  )
}
