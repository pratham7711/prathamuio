import React, { useEffect, useRef, useState } from 'react'

export interface NavLink {
  label: string
  href: string
}

export interface NavProps {
  /** Logo content (text, image, or ReactNode) */
  logo?: React.ReactNode
  /** Navigation links */
  links?: NavLink[]
  /** Call-to-action content (e.g. a Button) */
  cta?: React.ReactNode
  /** Class name for outer element */
  className?: string
}

/**
 * Fixed navigation bar that transitions from transparent to frosted-glass on scroll.
 * Includes a mobile hamburger menu with animated open/close.
 */
export const Nav: React.FC<NavProps> = ({
  logo,
  links = [],
  cta,
  className = '',
}) => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Use IntersectionObserver to detect when we're past the top
    const sentinel = document.createElement('div')
    sentinel.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;'
    document.body.prepend(sentinel)

    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )

    // A sentinel div positioned at top of page
    const topSentinel = document.createElement('div')
    topSentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none;'
    document.body.prepend(topSentinel)
    obs.observe(topSentinel)

    // Also listen to scroll for reliability
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
      sentinel.remove()
      topSentinel.remove()
    }
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navCls = [
    'ui-nav',
    scrolled ? 'ui-nav-glass' : 'ui-nav-transparent',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <nav className={navCls} ref={sentinelRef} aria-label="Main navigation">
        <div className="ui-nav-inner">
          <div className="ui-nav-logo">
            {logo ?? <span style={{ color: 'var(--ui-accent)' }}>@pratham/ui</span>}
          </div>

          {links.length > 0 && (
            <ul className="ui-nav-links" role="list">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="ui-nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-sp-4)' }}>
            {cta && <div className="ui-nav-cta">{cta}</div>}
            <button
              className={`ui-nav-hamburger${open ? ' open' : ''}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="ui-nav-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="ui-nav-mobile"
        className={`ui-nav-mobile${open ? ' open' : ''}`}
        aria-hidden={!open}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="ui-nav-link"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
        {cta && <div style={{ paddingTop: 'var(--ui-sp-2)' }}>{cta}</div>}
      </div>
    </>
  )
}
