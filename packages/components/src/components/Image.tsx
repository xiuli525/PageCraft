import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface ImageProps {
  src?: string
  alt?: string
  objectFit?: 'cover' | 'contain' | 'fill'
  borderRadius?: number
  style?: React.CSSProperties
  className?: string
}

const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-size='16' font-family='sans-serif' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo image%3C/text%3E%3C/svg%3E`

export const ImageComponent: React.FC<ImageProps> = ({
  src,
  alt = '',
  objectFit = 'cover',
  borderRadius = 0,
  style,
  className,
}) => {
  const [hasError, setHasError] = React.useState(false)
  const displaySrc = !src || hasError ? PLACEHOLDER_SVG : src

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit,
        borderRadius: `${borderRadius}px`,
        ...style,
      }}
    />
  )
}

export const imageDefinition: ComponentDefinition = {
  type: 'Image',
  displayName: 'Image',
  category: 'Media',
  icon: 'image',
  defaultProps: {
    src: '',
    alt: '',
    objectFit: 'cover',
    borderRadius: 0,
  },
  propSchema: {
    src: { type: 'image' },
    alt: { type: 'text' },
    objectFit: {
      type: 'select',
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
        { label: 'Fill', value: 'fill' },
      ],
    },
    borderRadius: { type: 'number' },
  },
  acceptsChildren: false,
}
