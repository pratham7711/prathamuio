import React, { useState } from 'react'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  /** Image source URL */
  src?: string
  /** Alt text for image */
  alt?: string
  /** Name used to generate initials when src is missing/broken */
  name?: string
  /** Size preset */
  size?: AvatarSize
  /** Show online indicator dot */
  online?: boolean
  className?: string
}

/** Generate 1–2 letter initials from a name */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * User avatar with image + initials fallback and optional online indicator.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  online = false,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false)
  const showImg = src && !imgError

  return (
    <span className={`ui-avatar ui-avatar-${size} ${className}`}>
      {showImg ? (
        <img
          src={src}
          alt={alt ?? name}
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-label={name}>{name ? getInitials(name) : '?'}</span>
      )}
      {online && <span className="ui-avatar-dot" aria-label="Online" />}
    </span>
  )
}
