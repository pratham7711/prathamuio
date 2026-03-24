import React from 'react'

/** Visual variant for the media object */
export type MediaObjectVariant = 'default' | 'card' | 'bordered' | 'glass'

/** Size preset for the media object */
export type MediaObjectSize = 'sm' | 'md' | 'lg'

export interface MediaObjectProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Media content (image, icon, avatar) rendered in the media slot */
  media: React.ReactNode
  /** Position of media relative to content */
  mediaPosition?: 'left' | 'right' | 'top'
  /** Vertical alignment of media and content */
  align?: 'start' | 'center' | 'end'
  /** Visual style variant */
  variant?: MediaObjectVariant
  /** Size preset */
  size?: MediaObjectSize
  /** Title text */
  title?: string
  /** Subtitle text */
  subtitle?: string
  /** Action buttons rendered at end */
  actions?: React.ReactNode
  /** Body content (replaces title/subtitle if provided) */
  children?: React.ReactNode
}

/**
 * Classic media object pattern — media (image/icon/avatar) beside text content.
 * Supports left, right, and top media positions, multiple visual variants,
 * and an actions slot. Uses article role for card variant.
 */
export const MediaObject = React.forwardRef<HTMLDivElement, MediaObjectProps>(
  (
    {
      media,
      mediaPosition = 'left',
      align = 'start',
      variant = 'default',
      size = 'md',
      title,
      subtitle,
      actions,
      children,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const isCard = variant === 'card' || variant === 'glass'

    const cls = [
      'ui-media-object',
      `ui-media-object-${variant}`,
      `ui-media-object-${size}`,
      `ui-media-object-${mediaPosition}`,
      `ui-media-object-align-${align}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const content = children || (
      <>
        {title && <div className="ui-media-object-title">{title}</div>}
        {subtitle && <div className="ui-media-object-subtitle">{subtitle}</div>}
      </>
    )

    return (
      <div
        ref={ref}
        className={cls}
        style={style}
        role={isCard ? 'article' : undefined}
        {...rest}
      >
        <div className="ui-media-object-media">{media}</div>
        <div className="ui-media-object-body">
          {content}
        </div>
        {actions && <div className="ui-media-object-actions">{actions}</div>}
      </div>
    )
  }
)

MediaObject.displayName = 'MediaObject'
