import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface LinkProps {
  url?: string
  target?: '_self' | '_blank'
  content?: string
  color?: string
  underline?: boolean
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

export const LinkComponent: React.FC<LinkProps> = ({
  url = '#',
  target = '_self',
  content = 'Click here',
  color = '#2563eb',
  underline = true,
  style,
  className,
  children,
}) => {
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined

  return (
    <a
      href={url}
      target={target}
      rel={rel}
      className={className}
      style={{
        color,
        textDecoration: underline ? 'underline' : 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children ?? content}
    </a>
  )
}

export const linkDefinition: ComponentDefinition = {
  type: 'Link',
  displayName: 'Link',
  category: 'Basic',
  icon: 'link',
  defaultProps: {
    url: '#',
    target: '_self',
    content: 'Click here',
    color: '#2563eb',
    underline: true,
  },
  propSchema: {
    url: { type: 'url' },
    target: {
      type: 'select',
      options: [
        { label: 'Same tab', value: '_self' },
        { label: 'New tab', value: '_blank' },
      ],
    },
    content: { type: 'text' },
    color: { type: 'color' },
    underline: { type: 'boolean' },
  },
  acceptsChildren: true,
}
