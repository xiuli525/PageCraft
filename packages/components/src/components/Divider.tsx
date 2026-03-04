import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface DividerProps {
  color?: string
  thickness?: number
  style?: 'solid' | 'dashed' | 'dotted'
  margin?: string
  containerStyle?: React.CSSProperties
  className?: string
}

export const DividerComponent: React.FC<DividerProps> = ({
  color = '#e5e7eb',
  thickness = 1,
  style: borderStyle = 'solid',
  margin = '16px 0',
  containerStyle,
  className,
}) => {
  return (
    <hr
      className={className}
      style={{
        border: 'none',
        borderTop: `${thickness}px ${borderStyle} ${color}`,
        margin,
        width: '100%',
        ...containerStyle,
      }}
    />
  )
}

export const dividerDefinition: ComponentDefinition = {
  type: 'Divider',
  displayName: 'Divider',
  category: 'Basic',
  icon: 'minus',
  defaultProps: {
    color: '#e5e7eb',
    thickness: 1,
    style: 'solid',
    margin: '16px 0',
  },
  propSchema: {
    color: { type: 'color' },
    thickness: { type: 'number' },
    style: {
      type: 'select',
      options: [
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
      ],
    },
    margin: { type: 'text' },
  },
  acceptsChildren: false,
}
