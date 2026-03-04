import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface SpacerProps {
  height?: number
  style?: React.CSSProperties
  className?: string
}

export const SpacerComponent: React.FC<SpacerProps> = ({ height = 24, style, className }) => {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        height: `${height}px`,
        width: '100%',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

export const spacerDefinition: ComponentDefinition = {
  type: 'Spacer',
  displayName: 'Spacer',
  category: 'Basic',
  icon: 'move-vertical',
  defaultProps: {
    height: 24,
  },
  propSchema: {
    height: { type: 'number' },
  },
  acceptsChildren: false,
}
