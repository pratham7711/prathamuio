import React, { useState, useCallback } from 'react'

/** Visual variant for the thumbnail */
export type ThumbnailVariant = 'default' | 'rounded' | 'circle' | 'glass'

/** Size preset for the thumbnail */
export type ThumbnailSize = 'sm' | 'md' | 'lg' | 'xl'

/** Aspect ratio for the thumbnail */
export type ThumbnailAspectRatio = '1:1' | '4:3' | '16:9' | '3:2' | 'auto'

export interface ThumbnailProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Image source URL */
  src: string
  /** Alt text for the image */
  alt: string
  /** Visual style variant */
  variant?: ThumbnailVariant
  /** Size preset */
  size?: ThumbnailSize
  /** Aspect ratio of the image */
  aspectRatio?: ThumbnailAspectRatio
  /** Overlay content shown on hover */
  overlay?: React.ReactNode
  /** Caption text below image */
  caption?: string
  /** Click handler */
  onClick?: () => void
  /** Enable scale-on-hover effect (default true) */
  zoom?: boolean
  /** Fallback content shown if image fails to load */
  fallback?: React.ReactNode
  /** Image loading strategy */
  loading?: 'lazy' | 'eager'
}

export interface ThumbnailGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns or 'auto-fill' */
  columns?: number | 'auto-fill'
  /** Gap between thumbnails */
  gap?: 'sm' | 'md' | 'lg'
  /** Thumbnail children */
  children?: React.ReactNode
}

const PlaceholderIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
  </svg>
)

/**
 * Image thumbnail with overlay, aspect ratio control, and hover effects.
 * Supports fallback state for broken images, captions via figcaption,
 * and smooth zoom-on-hover animation.
 */
export const Thumbnail = React.forwardRef<HTMLElement, ThumbnailProps>(
  (
    {
      src,
      alt,
      variant = 'default',
      size = 'md',
      aspectRatio = 'auto',
      overlay,
      caption,
      onClick,
      zoom = true,
      fallback,
      loading = 'lazy',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const [hasError, setHasError] = useState(false)

    const handleError = useCallback(() => {
      setHasError(true)
    }, [])

    const arCls = aspectRatio !== 'auto' ? `ui-thumbnail-ar-${aspectRatio.replace(':', '-')}` : ''

    const cls = [
      'ui-thumbnail',
      `ui-thumbnail-${variant}`,
      `ui-thumbnail-${size}`,
      arCls,
      zoom ? 'ui-thumbnail-zoom' : '',
      onClick ? 'ui-thumbnail-clickable' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const imageContent = hasError ? (
      <div className="ui-thumbnail-fallback">
        {fallback || <PlaceholderIcon />}
      </div>
    ) : (
      <img
        className="ui-thumbnail-img"
        src={src}
        alt={alt}
        loading={loading}
        onError={handleError}
      />
    )

    return (
      <figure
        ref={ref}
        className={cls}
        style={style}
        role="img"
        aria-label={alt}
        onClick={onClick}
        {...rest}
      >
        <div className="ui-thumbnail-frame">
          {imageContent}
          {overlay && !hasError && (
            <div className="ui-thumbnail-overlay" aria-hidden="true">
              {overlay}
            </div>
          )}
        </div>
        {caption && <figcaption className="ui-thumbnail-caption">{caption}</figcaption>}
      </figure>
    )
  }
)

Thumbnail.displayName = 'Thumbnail'

/**
 * Grid container for Thumbnail components. Uses CSS grid with auto-fill
 * or a fixed column count.
 */
export const ThumbnailGroup = React.forwardRef<HTMLDivElement, ThumbnailGroupProps>(
  (
    {
      columns = 'auto-fill',
      gap = 'md',
      children,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-thumbnail-group',
      `ui-thumbnail-group-gap-${gap}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const gridStyle: React.CSSProperties = {
      ...style,
      ...(typeof columns === 'number'
        ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
        : {}),
    }

    return (
      <div ref={ref} className={cls} role="group" style={gridStyle} {...rest}>
        {children}
      </div>
    )
  }
)

ThumbnailGroup.displayName = 'ThumbnailGroup'
