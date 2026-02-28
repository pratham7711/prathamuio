import React from 'react'

export type TrendDirection = 'up' | 'down' | 'neutral'

export interface StatCardProps {
  /** Primary metric value (string or number) */
  value: string | number
  /** Metric label */
  label: string
  /** Trend direction */
  trend?: TrendDirection
  /** Trend label (e.g. "+12% this week") */
  trendLabel?: string
  /** Icon (emoji, SVG, or ReactNode) */
  icon?: React.ReactNode
  className?: string
}

const TREND_ICONS: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  neutral: '→',
}

/**
 * Metric card with animated value reveal, trend indicator, and icon slot.
 * The value animates in via CSS on mount (no JS counter — pure CSS keyframes).
 */
export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  trend,
  trendLabel,
  icon,
  className = '',
}) => {
  return (
    <div className={`ui-statcard ${className}`}>
      <div className="ui-statcard-header">
        <span className="ui-statcard-label">{label}</span>
        {icon && <div className="ui-statcard-icon" aria-hidden="true">{icon}</div>}
      </div>

      <div className="ui-statcard-value" aria-label={`${label}: ${value}`}>
        {value}
      </div>

      {trend && (
        <div
          className={`ui-statcard-trend ui-statcard-trend-${trend}`}
          aria-label={`Trend: ${trendLabel ?? trend}`}
        >
          <span aria-hidden="true">{TREND_ICONS[trend]}</span>
          {trendLabel && <span>{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
