import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface TextProps {
  content?: string
  align?: 'left' | 'center' | 'right'
  fontSize?: number
  fontWeight?: number
  color?: string
  style?: React.CSSProperties
  className?: string
}

export const TextComponent: React.FC<TextProps> = ({
  content = 'Enter text here',
  align = 'left',
  fontSize = 16,
  fontWeight = 400,
  color = '#000000',
  style,
  className,
}) => {
  return (
    <p
      className={className}
      style={{
        textAlign: align,
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        margin: 0,
        ...style,
      }}
    >
      {content}
    </p>
  )
}

export const textDefinition: ComponentDefinition = {
  type: 'Text',
  displayName: 'Text',
  category: 'Basic',
  icon: 'type',
  defaultProps: {
    content: 'Enter text here',
    align: 'left',
    fontSize: 16,
    fontWeight: 400,
    color: '#000000',
  },
  propSchema: {
    content: { type: 'text' },
    align: {
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    fontSize: { type: 'number' },
    fontWeight: { type: 'number' },
    color: { type: 'color' },
  },
  acceptsChildren: false,
}
