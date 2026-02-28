import React from 'react'

export interface FooterLink {
  label: string
  href: string
}

export interface FooterProps {
  /** Brand name or logo */
  brand?: React.ReactNode
  /** Short tagline shown under brand */
  tagline?: string
  /** Footer navigation links */
  links?: FooterLink[]
  /** Copyright / bottom slot */
  copyright?: React.ReactNode
  /** Right side of bottom bar (socials, etc.) */
  bottomRight?: React.ReactNode
  className?: string
}

/**
 * Minimal dark footer with brand, links, and copyright.
 */
export const Footer: React.FC<FooterProps> = ({
  brand,
  tagline,
  links = [],
  copyright,
  bottomRight,
  className = '',
}) => {
  const year = new Date().getFullYear()

  return (
    <footer className={`ui-footer ${className}`}>
      <div className="ui-footer-inner">
        <div className="ui-footer-top">
          <div>
            <div className="ui-footer-brand">{brand ?? 'Brand'}</div>
            {tagline && <p className="ui-footer-tagline">{tagline}</p>}
          </div>
          {links.length > 0 && (
            <nav aria-label="Footer links">
              <ul className="ui-footer-links" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="ui-footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="ui-footer-bottom">
          <p className="ui-footer-copy">
            {copyright ?? `© ${year} All rights reserved.`}
          </p>
          {bottomRight && <div>{bottomRight}</div>}
        </div>
      </div>
    </footer>
  )
}
