import React, { useState, useCallback, useEffect, useRef } from 'react'

/** Visual variant for carousel transitions */
export type CarouselVariant = 'default' | 'fade' | 'card'

/** Size preset for carousel */
export type CarouselSize = 'sm' | 'md' | 'lg'

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** CarouselSlide children */
  children: React.ReactNode
  /** Transition variant */
  variant?: CarouselVariant
  /** Size preset */
  size?: CarouselSize
  /** Enable auto-play */
  autoPlay?: boolean
  /** Auto-play interval in ms */
  autoPlayInterval?: number
  /** Infinite loop */
  loop?: boolean
  /** Show dot indicators */
  showDots?: boolean
  /** Show arrow navigation */
  showArrows?: boolean
  /** Number of slides to show at once (card variant) */
  slidesToShow?: number
  /** Gap between slides in card mode (px) */
  gap?: number
  /** Pause auto-play on hover */
  pauseOnHover?: boolean
  /** Called on slide change */
  onChange?: (index: number) => void
}

export interface CarouselSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Slide content */
  children: React.ReactNode
}

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <polyline points="9 6 15 12 9 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * CarouselSlide wraps individual slide content.
 */
export const CarouselSlide = React.forwardRef<HTMLDivElement, CarouselSlideProps>(
  ({ children, className = '', ...rest }, ref) => {
    const cls = ['ui-carousel-slide', className].filter(Boolean).join(' ')
    return (
      <div ref={ref} className={cls} role="tabpanel" {...rest}>
        {children}
      </div>
    )
  }
)

CarouselSlide.displayName = 'CarouselSlide'

/**
 * Carousel component with slide, fade, and card variants.
 * Supports auto-play, touch/swipe, keyboard navigation, and full ARIA.
 */
export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      autoPlay = false,
      autoPlayInterval = 5000,
      loop = true,
      showDots = true,
      showArrows = true,
      slidesToShow = 1,
      gap = 16,
      pauseOnHover = true,
      onChange,
      className = '',
      ...rest
    },
    ref
  ) => {
    const slides = React.Children.toArray(children).filter(React.isValidElement)
    const totalSlides = slides.length
    const effectiveSlidesToShow = variant === 'card' ? slidesToShow : 1

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const dragStartX = useRef(0)
    const dragDelta = useRef(0)
    const trackRef = useRef<HTMLDivElement>(null)
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const maxIndex = Math.max(0, totalSlides - effectiveSlidesToShow)

    const goTo = useCallback(
      (index: number) => {
        let newIndex = index
        if (loop) {
          if (newIndex > maxIndex) newIndex = 0
          if (newIndex < 0) newIndex = maxIndex
        } else {
          newIndex = Math.max(0, Math.min(newIndex, maxIndex))
        }
        setCurrentIndex(newIndex)
        onChange?.(newIndex)
      },
      [loop, maxIndex, onChange]
    )

    const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
    const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

    // Auto-play
    useEffect(() => {
      if (autoPlay && !isHovered && !isFocused && !isDragging) {
        autoPlayRef.current = setInterval(goNext, autoPlayInterval)
      }
      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      }
    }, [autoPlay, autoPlayInterval, goNext, isHovered, isFocused, isDragging])

    // Keyboard
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          goPrev()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          goNext()
        }
      },
      [goNext, goPrev]
    )

    // Pointer/touch swipe
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
      setIsDragging(true)
      dragStartX.current = e.clientX
      dragDelta.current = 0
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }, [])

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging) return
        dragDelta.current = e.clientX - dragStartX.current
      },
      [isDragging]
    )

    const handlePointerUp = useCallback(() => {
      if (!isDragging) return
      setIsDragging(false)
      const threshold = 50
      if (dragDelta.current > threshold) {
        goPrev()
      } else if (dragDelta.current < -threshold) {
        goNext()
      }
      dragDelta.current = 0
    }, [isDragging, goNext, goPrev])

    const cls = [
      'ui-carousel',
      `ui-carousel-${variant}`,
      `ui-carousel-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const getTrackStyle = (): React.CSSProperties => {
      if (variant === 'fade') {
        return {}
      }
      if (variant === 'card') {
        const slideWidth = `calc((100% - ${gap * (effectiveSlidesToShow - 1)}px) / ${effectiveSlidesToShow})`
        return {
          display: 'flex',
          gap: `${gap}px`,
          transform: `translateX(calc(-${currentIndex} * (${slideWidth} + ${gap}px)))`,
          transition: isDragging ? 'none' : `transform var(--ui-t-slow)`,
        }
      }
      return {
        display: 'flex',
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: isDragging ? 'none' : `transform var(--ui-t-slow)`,
      }
    }

    const getSlideStyle = (): React.CSSProperties => {
      if (variant === 'card') {
        return {
          flex: `0 0 calc((100% - ${gap * (effectiveSlidesToShow - 1)}px) / ${effectiveSlidesToShow})`,
          minWidth: 0,
        }
      }
      return {
        flex: '0 0 100%',
        minWidth: 0,
      }
    }

    return (
      <div
        ref={ref}
        className={cls}
        role="region"
        aria-roledescription="carousel"
        aria-label="Carousel"
        onKeyDown={handleKeyDown}
        onMouseEnter={pauseOnHover ? () => setIsHovered(true) : undefined}
        onMouseLeave={pauseOnHover ? () => setIsHovered(false) : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        {...rest}
      >
        <div className="ui-carousel-viewport">
          <div
            ref={trackRef}
            className="ui-carousel-track"
            style={getTrackStyle()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className={[
                  'ui-carousel-slide-wrapper',
                  variant === 'fade' && i === currentIndex && 'ui-carousel-slide-active',
                  variant === 'fade' && i !== currentIndex && 'ui-carousel-slide-inactive',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={variant === 'fade' ? undefined : getSlideStyle()}
                aria-hidden={variant === 'fade' ? i !== currentIndex : undefined}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {showArrows && totalSlides > effectiveSlidesToShow && (
          <>
            <button
              className="ui-carousel-arrow ui-carousel-arrow-prev"
              onClick={goPrev}
              aria-label="Previous slide"
              type="button"
              disabled={!loop && currentIndex === 0}
            >
              <ArrowLeft />
            </button>
            <button
              className="ui-carousel-arrow ui-carousel-arrow-next"
              onClick={goNext}
              aria-label="Next slide"
              type="button"
              disabled={!loop && currentIndex >= maxIndex}
            >
              <ArrowRight />
            </button>
          </>
        )}

        {showDots && totalSlides > 1 && (
          <div className="ui-carousel-dots" role="tablist" aria-label="Slide navigation">
            {Array.from({ length: variant === 'card' ? maxIndex + 1 : totalSlides }, (_, i) => (
              <button
                key={i}
                className={[
                  'ui-carousel-dot',
                  i === currentIndex && 'ui-carousel-dot-active',
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                type="button"
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

Carousel.displayName = 'Carousel'
