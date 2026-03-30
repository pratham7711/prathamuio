import React, { useRef, useEffect, useCallback } from 'react'

export type ChartType = 'area' | 'bar' | 'line' | 'pie'
export type ChartVariant = 'accent' | 'success' | 'warning' | 'danger' | 'neutral'

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface ChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Chart type */
  type: ChartType
  /** Data points */
  data: ChartDataPoint[]
  /** Width (auto if not set) */
  width?: number
  /** Height */
  height?: number
  /** Color variant (used when data points don't have individual colors) */
  variant?: ChartVariant
  /** Show value labels on data points */
  showLabels?: boolean
  /** Show X axis labels */
  showXAxis?: boolean
  /** Show Y axis */
  showYAxis?: boolean
  /** Show grid lines */
  showGrid?: boolean
  /** Show tooltip on hover */
  showTooltip?: boolean
  /** Animate on mount */
  animated?: boolean
  /** Title */
  title?: string
  /** Format value for display */
  formatValue?: (value: number) => string
}

const VARIANT_COLORS: Record<ChartVariant, string> = {
  accent: 'var(--ui-accent, #5B5BD6)',
  success: 'var(--ui-success, #10B981)',
  warning: 'var(--ui-warning, #F59E0B)',
  danger: 'var(--ui-danger, #EF4444)',
  neutral: 'var(--ui-text-2, #9097B4)',
}

/**
 * Lightweight SVG chart component. Renders area, bar, line, or pie charts
 * using pure SVG — no external charting library required.
 */
export const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  (
    {
      type,
      data,
      width: propWidth,
      height = 200,
      variant = 'accent',
      showLabels = false,
      showXAxis = true,
      showYAxis = false,
      showGrid = true,
      showTooltip = true,
      animated = true,
      title,
      formatValue = (v) => v.toLocaleString(),
      className = '',
      ...rest
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = React.useState(propWidth ?? 400)
    const [tooltip, setTooltip] = React.useState<{ x: number; y: number; label: string; value: string } | null>(null)

    useEffect(() => {
      if (propWidth) return
      const el = containerRef.current
      if (!el) return
      const obs = new ResizeObserver((entries) => {
        for (const entry of entries) setContainerWidth(entry.contentRect.width)
      })
      obs.observe(el)
      return () => obs.disconnect()
    }, [propWidth])

    const w = propWidth ?? containerWidth
    const baseColor = VARIANT_COLORS[variant]

    const cls = ['ui-chart', `ui-chart-${type}`, animated ? 'ui-chart-animated' : '', className].filter(Boolean).join(' ')

    if (data.length === 0) {
      return (
        <div ref={ref} className={cls} {...rest}>
          <div className="ui-chart-empty">No data</div>
        </div>
      )
    }

    const maxVal = Math.max(...data.map(d => d.value), 1)
    const padding = { top: 20, right: 20, bottom: showXAxis ? 40 : 10, left: showYAxis ? 50 : 10 }
    const chartW = w - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom

    const handleMouseMove = useCallback((e: React.MouseEvent, point: ChartDataPoint) => {
      if (!showTooltip) return
      const rect = (e.currentTarget as HTMLElement).closest('.ui-chart')?.getBoundingClientRect()
      if (!rect) return
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top - 30, label: point.label, value: formatValue(point.value) })
    }, [showTooltip, formatValue])

    const handleMouseLeave = useCallback(() => setTooltip(null), [])

    const renderBarChart = () => {
      const barWidth = Math.min(40, chartW / data.length * 0.6)
      const gap = (chartW - barWidth * data.length) / (data.length + 1)

      return (
        <g>
          {data.map((d, i) => {
            const x = padding.left + gap + i * (barWidth + gap)
            const barH = (d.value / maxVal) * chartH
            const y = padding.top + chartH - barH
            const color = d.color ?? baseColor
            return (
              <g key={i} onMouseMove={(e) => handleMouseMove(e as unknown as React.MouseEvent, d)} onMouseLeave={handleMouseLeave}>
                <rect x={x} y={y} width={barWidth} height={barH} rx={3} fill={color} opacity={0.85} className="ui-chart-bar" />
                {showLabels && <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="ui-chart-label">{formatValue(d.value)}</text>}
                {showXAxis && <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" className="ui-chart-axis-label">{d.label}</text>}
              </g>
            )
          })}
        </g>
      )
    }

    const renderLineOrArea = () => {
      const stepX = chartW / Math.max(data.length - 1, 1)
      const points = data.map((d, i) => ({
        x: padding.left + i * stepX,
        y: padding.top + chartH - (d.value / maxVal) * chartH,
        ...d,
      }))

      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
      const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`

      return (
        <g>
          {type === 'area' && <path d={areaD} fill={baseColor} opacity={0.12} className="ui-chart-area" />}
          <path d={pathD} fill="none" stroke={baseColor} strokeWidth={2} strokeLinejoin="round" className="ui-chart-line" />
          {points.map((p, i) => (
            <g key={i} onMouseMove={(e) => handleMouseMove(e as unknown as React.MouseEvent, data[i])} onMouseLeave={handleMouseLeave}>
              <circle cx={p.x} cy={p.y} r={4} fill={baseColor} className="ui-chart-dot" />
              {showLabels && <text x={p.x} y={p.y - 10} textAnchor="middle" className="ui-chart-label">{formatValue(p.value)}</text>}
              {showXAxis && <text x={p.x} y={height - 8} textAnchor="middle" className="ui-chart-axis-label">{data[i].label}</text>}
            </g>
          ))}
        </g>
      )
    }

    const renderPie = () => {
      const total = data.reduce((s, d) => s + d.value, 0)
      const cx = w / 2
      const cy = height / 2
      const r = Math.min(cx, cy) - 20
      let startAngle = -Math.PI / 2

      return (
        <g>
          {data.map((d, i) => {
            const angle = (d.value / total) * 2 * Math.PI
            const endAngle = startAngle + angle
            const x1 = cx + r * Math.cos(startAngle)
            const y1 = cy + r * Math.sin(startAngle)
            const x2 = cx + r * Math.cos(endAngle)
            const y2 = cy + r * Math.sin(endAngle)
            const largeArc = angle > Math.PI ? 1 : 0
            const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
            const color = d.color ?? `hsl(${(i * 360) / data.length}, 70%, 55%)`
            startAngle = endAngle
            return (
              <path
                key={i}
                d={pathD}
                fill={color}
                stroke="var(--ui-bg-0, #fff)"
                strokeWidth={2}
                className="ui-chart-slice"
                onMouseMove={(e) => handleMouseMove(e as unknown as React.MouseEvent, d)}
                onMouseLeave={handleMouseLeave}
              />
            )
          })}
        </g>
      )
    }

    const renderGrid = () => {
      if (!showGrid || type === 'pie') return null
      const lines = 4
      return (
        <g>
          {Array.from({ length: lines + 1 }).map((_, i) => {
            const y = padding.top + (chartH / lines) * i
            return <line key={i} x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="var(--ui-border, rgba(255,255,255,0.08))" strokeDasharray="4 4" />
          })}
        </g>
      )
    }

    return (
      <div ref={(node) => { (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node; if (typeof ref === 'function') ref(node); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node }} className={cls} {...rest}>
        {title && <div className="ui-chart-title">{title}</div>}
        <svg width={w} height={height} className="ui-chart-svg">
          {renderGrid()}
          {type === 'bar' && renderBarChart()}
          {(type === 'line' || type === 'area') && renderLineOrArea()}
          {type === 'pie' && renderPie()}
        </svg>
        {tooltip && (
          <div className="ui-chart-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            <span className="ui-chart-tooltip-label">{tooltip.label}</span>
            <span className="ui-chart-tooltip-value">{tooltip.value}</span>
          </div>
        )}
      </div>
    )
  }
)
Chart.displayName = 'Chart'
