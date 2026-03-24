import React, { useState, useEffect, useCallback, useRef } from 'react'

/** Visual variant for the back-to-top button */
export type BackToTopVariant = 'default' | 'pill' | 'circle' | 'ghost'

/** Size preset for the back-to-top button */
export type BackToTopSize = 'sm' | 'md' | 'lg'

export interface BackToTopProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual style variant */
  variant?: BackToTopVariant
  /** Size preset */
  size?: BackToTopSize
  /** Scroll distance in px before showing (default 300) */
  showAfter?: number
  /** Enable smooth scroll (default true) */
  smooth?: boolean
  /** Custom icon (default up arrow) */
  icon?: React.ReactNode
  /** Text label (shown in pill variant) */
  label?: string
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  /** Position offset in px */
  offset?: { bottom?: number; right?: number; left?: number }
  /** Scroll container (default window) */
  target?: HTMLElement | Window
}

const DefaultArrow: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Floating button that appears on scroll and smoothly scrolls to top.
 * Supports multiple variants, configurable show threshold, custom icons,
 * and flexible positioning. Uses passive scroll listeners with throttle.
 */
export const BackToTop = React.forwardRef<HTMLButtonElement, BackToTopProps>(
  (
    {
      variant = 'default',
      size = 'md',
      showAfter = 300,
      smooth = true,
      icon,
      label,
      position = 'bottom-right',
      offset,
      target,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false)
    const throttleRef = useRef(false)

    const handleScroll = useCallback(() => {
      if (throttleRef.current) return
      throttleRef.current = true
      requestAnimationFrame(() => {
        const scrollTarget = target || window
        const scrollTop =
          scrollTarget instanceof Window
            ? window.pageYOffset || document.documentElement.scrollTop
            : (scrollTarget as HTMLElement).scrollTop
        setVisible(scrollTop > showAfter)
        throttleRef.current = false
      })
    }, [showAfter, target])

    useEffect(() => {
      const scrollTarget = target || window
      scrollTarget.addEventListener('scroll', handleScroll, { passive: true })
      // Check initial scroll position
      handleScroll()
      return () => {
        scrollTarget.removeEventListener('scroll', handleScroll)
      }
    }, [handleScroll, target])

    const scrollToTop = useCallback(() => {
      const scrollTarget = target || window
      if (scrollTarget instanceof Window) {
        window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
      } else {
        (scrollTarget as HTMLElement).scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
      }
    }, [smooth, target])

    const cls = [
      'ui-back-to-top',
      `ui-back-to-top-${variant}`,
      `ui-back-to-top-${size}`,
      `ui-back-to-top-${position}`,
      visible ? 'ui-back-to-top-visible' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const positionStyle: React.CSSProperties = {
      ...(offset?.bottom !== undefined && { bottom: offset.bottom }),
      ...(offset?.right !== undefined && { right: offset.right }),
      ...(offset?.left !== undefined && { left: offset.left }),
      ...style,
    }

    return (
      <button
        ref={ref}
        className={cls}
        style={positionStyle}
        onClick={scrollToTop}
        aria-label={label || 'Scroll to top'}
        role="button"
        type="button"
        {...rest}
      >
        <span className="ui-back-to-top-icon">{icon || <DefaultArrow />}</span>
        {variant === 'pill' && label && (
          <span className="ui-back-to-top-label">{label}</span>
        )}
      </button>
    )
  }
)

BackToTop.displayName = 'BackToTop'
