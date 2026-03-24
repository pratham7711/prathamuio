import React from 'react'

/** PricingCard variant */
export type PricingCardVariant = 'default' | 'glass' | 'outlined' | 'featured'
/** PricingCard size */
export type PricingCardSize = 'sm' | 'md' | 'lg'

/** A single feature line in a pricing plan */
export interface PricingFeature {
  /** Feature description */
  text: string
  /** Whether the feature is included in this plan */
  included: boolean
  /** Optional tooltip for extra detail */
  tooltip?: string
}

export interface PricingCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Plan name */
  name: string
  /** Price display (number or string like "Free") */
  price: string | number
  /** Currency symbol */
  currency?: string
  /** Billing period */
  period?: string
  /** Short plan description */
  description?: string
  /** List of features */
  features: PricingFeature[]
  /** Visual variant */
  variant?: PricingCardVariant
  /** Size preset */
  size?: PricingCardSize
  /** Badge text (e.g. "Popular") */
  badge?: string
  /** CTA button text */
  ctaText?: string
  /** CTA button visual style */
  ctaVariant?: 'primary' | 'secondary' | 'ghost' | 'glow'
  /** Callback when CTA is clicked */
  onCtaClick?: () => void
  /** Disable the card and CTA */
  disabled?: boolean
  /** Extra visual emphasis */
  highlighted?: boolean
  /** Custom icon for the plan header */
  icon?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/* ── Inline SVG icons ───────────────────────────────── */

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/**
 * Generic pricing/plan display card for SaaS pricing pages and subscription plans.
 * Supports badges, feature lists with check/x indicators, and configurable CTA.
 */
export const PricingCard = React.forwardRef<HTMLElement, PricingCardProps>(
  (
    {
      name,
      price,
      currency = '$',
      period = '/month',
      description,
      features,
      variant = 'default',
      size = 'md',
      badge,
      ctaText = 'Get Started',
      ctaVariant = 'primary',
      onCtaClick,
      disabled = false,
      highlighted = false,
      icon,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-pricing-card',
      `ui-pricing-card-${variant}`,
      `ui-pricing-card-${size}`,
      highlighted && 'ui-pricing-card-highlighted',
      disabled && 'ui-pricing-card-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const isNumericPrice = typeof price === 'number' || !isNaN(Number(price))

    return (
      <article ref={ref} className={cls} style={style} {...rest}>
        {badge && (
          <span className="ui-pricing-card-badge">{badge}</span>
        )}

        <div className="ui-pricing-card-header">
          {icon && <span className="ui-pricing-card-icon" aria-hidden="true">{icon}</span>}
          <h3 className="ui-pricing-card-name">{name}</h3>
        </div>

        <div className="ui-pricing-card-price">
          {isNumericPrice && <span className="ui-pricing-card-currency">{currency}</span>}
          <span className="ui-pricing-card-amount">{price}</span>
          {isNumericPrice && <span className="ui-pricing-card-period">{period}</span>}
        </div>

        {description && (
          <p className="ui-pricing-card-description">{description}</p>
        )}

        <ul className="ui-pricing-card-features" role="list">
          {features.map((feature, i) => (
            <li
              key={i}
              className={[
                'ui-pricing-card-feature',
                feature.included ? 'ui-pricing-card-feature-included' : 'ui-pricing-card-feature-excluded',
              ]
                .filter(Boolean)
                .join(' ')}
              title={feature.tooltip}
            >
              <span className="ui-pricing-card-feature-icon" aria-hidden="true">
                {feature.included ? <CheckIcon /> : <XIcon />}
              </span>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={[
            'ui-pricing-card-cta',
            `ui-pricing-card-cta-${ctaVariant}`,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onCtaClick}
          disabled={disabled}
        >
          {ctaText}
        </button>
      </article>
    )
  }
)

PricingCard.displayName = 'PricingCard'

/* ── PricingCardGroup ───────────────────────────────── */

export interface PricingCardGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (auto-detected from children count by default) */
  columns?: number
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Lays out PricingCard children in a responsive CSS grid.
 */
export const PricingCardGroup = React.forwardRef<HTMLDivElement, PricingCardGroupProps>(
  ({ columns, children, className, style, ...rest }, ref) => {
    const childCount = React.Children.count(children)
    const cols = columns ?? Math.min(childCount, 4)

    const cls = ['ui-pricing-card-group', className].filter(Boolean).join(' ')

    return (
      <div
        ref={ref}
        className={cls}
        style={{
          '--ui-pricing-cols': cols,
          ...style,
        } as React.CSSProperties}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

PricingCardGroup.displayName = 'PricingCardGroup'
