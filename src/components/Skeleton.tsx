import React from 'react'

export type SkeletonVariant = 'text' | 'rect' | 'circle'

export interface SkeletonProps {
  /** Shape of the skeleton */
  variant?: SkeletonVariant
  /** Width (CSS string or number in px) */
  width?: string | number
  /** Height (CSS string or number in px) */
  height?: string | number
  className?: string
}

const toPx = (v: string | number | undefined) =>
  typeof v === 'number' ? `${v}px` : v

/**
 * Shimmer placeholder for loading states.
 * Use `text` for single lines, `rect` for blocks, `circle` for avatars.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const defaults: Record<SkeletonVariant, { width: string; height: string }> = {
    text: { width: '100%', height: '14px' },
    rect: { width: '100%', height: '120px' },
    circle: { width: '40px', height: '40px' },
  }

  const cls = [
    'ui-skeleton',
    `ui-skeleton-${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cls}
      aria-hidden="true"
      style={{
        width: toPx(width) ?? defaults[variant].width,
        height: toPx(height) ?? defaults[variant].height,
      }}
    />
  )
}
