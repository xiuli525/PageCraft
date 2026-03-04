import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface HeadingProps {
  content?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  align?: string
  color?: string
  style?: React.CSSProperties
  className?: string
}

const HEADING_SIZES: Record<number, string> = {
  1: '2.25rem',
  2: '1.875rem',
  3: '1.5rem',
  4: '1.25rem',
  5: '1.125rem',
  6: '1rem',
}

export const HeadingComponent: React.FC<HeadingProps> = ({
  content = 'Heading',
  level = 2,
  align = 'left',
  color = '#000000',
  style,
  className,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  const fontSize = HEADING_SIZES[level] ?? '1.5rem'
  return (
    <Tag
      className={className}
      style={{
        textAlign: align as React.CSSProperties['textAlign'],
        color,
        fontSize,
        fontWeight: 700,
        margin: 0,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {content}
    </Tag>
  )
}

export const headingDefinition: ComponentDefinition = {
  type: 'Heading',
  displayName: 'Heading',
  category: 'Basic',
  icon: 'heading',
  defaultProps: {
    content: 'Your Heading',
    level: 2,
    align: 'left',
    color: '#000000',
  },
  propSchema: {
    content: { type: 'text' },
    level: {
      type: 'select',
      options: [
        { label: 'H1', value: 1 },
        { label: 'H2', value: 2 },
        { label: 'H3', value: 3 },
        { label: 'H4', value: 4 },
        { label: 'H5', value: 5 },
        { label: 'H6', value: 6 },
      ],
    },
    align: {
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    color: { type: 'color' },
  },
  acceptsChildren: false,
}
