import React, { useState, useCallback, useMemo, useEffect } from 'react'

/** Gallery layout variant */
export type GalleryVariant = 'grid' | 'masonry' | 'carousel' | 'list'
/** Gallery size */
export type GallerySize = 'sm' | 'md' | 'lg'

/** A single gallery item */
export interface GalleryItem {
  /** Unique identifier */
  id: string
  /** Full-size image source */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Optional thumbnail (falls back to src) */
  thumbnail?: string
  /** Caption displayed on hover overlay */
  caption?: string
  /** Category for filtering */
  category?: string
}

export interface GalleryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Gallery items */
  items: GalleryItem[]
  /** Layout variant */
  variant?: GalleryVariant
  /** Size preset */
  size?: GallerySize
  /** Number of columns (number or responsive object) */
  columns?: number | { sm?: number; md?: number; lg?: number }
  /** Gap between items */
  gap?: 'sm' | 'md' | 'lg'
  /** Enable lightbox on click */
  lightbox?: boolean
  /** Show category filter tabs */
  filterable?: boolean
  /** Categories for filter tabs (auto-detected if not provided) */
  categories?: string[]
  /** Show caption overlay on hover */
  overlay?: boolean
  /** Image aspect ratio */
  aspectRatio?: '1:1' | '4:3' | '16:9' | 'auto'
  /** Callback when an item is clicked */
  onItemClick?: (item: GalleryItem) => void
  className?: string
  style?: React.CSSProperties
}

/* ── Inline SVG icons ───────────────────────────────── */

const ZoomIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 6.5v5M6.5 9h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Aspect ratio map ───────────────────────────────── */

const ASPECT_MAP: Record<string, string> = {
  '1:1': '1 / 1',
  '4:3': '4 / 3',
  '16:9': '16 / 9',
  'auto': 'auto',
}

/**
 * Image gallery with grid/masonry/carousel/list layouts, lightbox preview,
 * and optional category filtering. Fully accessible with keyboard navigation.
 */
export const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  (
    {
      items,
      variant = 'grid',
      size = 'md',
      columns = 3,
      gap = 'md',
      lightbox = true,
      filterable = false,
      categories,
      overlay = true,
      aspectRatio = 'auto',
      onItemClick,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    // Auto-detect categories from items
    const allCategories = useMemo(() => {
      if (categories) return categories
      const cats = new Set<string>()
      items.forEach((item) => {
        if (item.category) cats.add(item.category)
      })
      return Array.from(cats)
    }, [categories, items])

    // Filter items by active category
    const filteredItems = useMemo(() => {
      if (!activeCategory) return items
      return items.filter((item) => item.category === activeCategory)
    }, [items, activeCategory])

    const handleItemClick = useCallback(
      (item: GalleryItem, index: number) => {
        onItemClick?.(item)
        if (lightbox) setLightboxIndex(index)
      },
      [onItemClick, lightbox]
    )

    const handleLightboxClose = useCallback(() => {
      setLightboxIndex(null)
    }, [])

    const handleLightboxPrev = useCallback(() => {
      setLightboxIndex((prev) =>
        prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null
      )
    }, [filteredItems.length])

    const handleLightboxNext = useCallback(() => {
      setLightboxIndex((prev) =>
        prev !== null ? (prev + 1) % filteredItems.length : null
      )
    }, [filteredItems.length])

    // Keyboard navigation for lightbox
    useEffect(() => {
      if (lightboxIndex === null) return
      const handler = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            handleLightboxClose()
            break
          case 'ArrowLeft':
            handleLightboxPrev()
            break
          case 'ArrowRight':
            handleLightboxNext()
            break
        }
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [lightboxIndex, handleLightboxClose, handleLightboxPrev, handleLightboxNext])

    // Lock body scroll when lightbox open
    useEffect(() => {
      if (lightboxIndex !== null) {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
      }
    }, [lightboxIndex])

    // Build column CSS variables
    const colStyle = useMemo(() => {
      if (typeof columns === 'number') {
        return {
          '--ui-gallery-cols-sm': columns,
          '--ui-gallery-cols-md': columns,
          '--ui-gallery-cols-lg': columns,
        }
      }
      return {
        '--ui-gallery-cols-sm': columns.sm ?? 1,
        '--ui-gallery-cols-md': columns.md ?? 2,
        '--ui-gallery-cols-lg': columns.lg ?? 3,
      }
    }, [columns])

    const cls = [
      'ui-gallery',
      `ui-gallery-${variant}`,
      `ui-gallery-${size}`,
      `ui-gallery-gap-${gap}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const aspectStyle = aspectRatio !== 'auto' ? { '--ui-gallery-aspect': ASPECT_MAP[aspectRatio] } : {}

    return (
      <div ref={ref} className={cls} style={{ ...colStyle, ...aspectStyle, ...style } as React.CSSProperties} {...rest}>
        {/* Filter tabs */}
        {filterable && allCategories.length > 0 && (
          <div className="ui-gallery-filters" role="tablist" aria-label="Filter by category">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === null}
              className={['ui-gallery-filter', activeCategory === null && 'ui-gallery-filter-active'].filter(Boolean).join(' ')}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={['ui-gallery-filter', activeCategory === cat && 'ui-gallery-filter-active'].filter(Boolean).join(' ')}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery grid */}
        <div className="ui-gallery-grid" role="list">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="ui-gallery-item"
              role="listitem"
              onClick={() => handleItemClick(item, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleItemClick(item, index)
                }
              }}
              tabIndex={0}
              aria-label={item.caption ?? item.alt}
            >
              <img
                src={item.thumbnail ?? item.src}
                alt={item.alt}
                className="ui-gallery-img"
                loading="lazy"
              />
              {overlay && (item.caption || lightbox) && (
                <div className="ui-gallery-overlay" aria-hidden="true">
                  {item.caption && <span className="ui-gallery-caption">{item.caption}</span>}
                  {lightbox && (
                    <span className="ui-gallery-zoom">
                      <ZoomIcon />
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <div
            className="ui-gallery-lightbox"
            role="dialog"
            aria-label="Image preview"
            aria-modal="true"
            onClick={handleLightboxClose}
          >
            <div className="ui-gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="ui-gallery-lightbox-close"
                onClick={handleLightboxClose}
                aria-label="Close lightbox"
              >
                <CloseIcon />
              </button>

              {filteredItems.length > 1 && (
                <button
                  type="button"
                  className="ui-gallery-lightbox-nav ui-gallery-lightbox-prev"
                  onClick={handleLightboxPrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft />
                </button>
              )}

              <img
                src={filteredItems[lightboxIndex].src}
                alt={filteredItems[lightboxIndex].alt}
                className="ui-gallery-lightbox-img"
              />

              {filteredItems[lightboxIndex].caption && (
                <p className="ui-gallery-lightbox-caption">
                  {filteredItems[lightboxIndex].caption}
                </p>
              )}

              {filteredItems.length > 1 && (
                <button
                  type="button"
                  className="ui-gallery-lightbox-nav ui-gallery-lightbox-next"
                  onClick={handleLightboxNext}
                  aria-label="Next image"
                >
                  <ChevronRight />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)

Gallery.displayName = 'Gallery'
