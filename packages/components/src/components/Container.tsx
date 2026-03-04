import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface ContainerProps {
  padding?: string
  background?: string
  borderRadius?: number
  maxWidth?: string
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

export const ContainerComponent: React.FC<ContainerProps> = ({
  padding = '16px',
  background = 'transparent',
  borderRadius = 0,
  maxWidth = '100%',
  style,
  className,
  children,
}) => {
  return (
    <div
      className={className}
      style={{
        padding,
        background,
        borderRadius: `${borderRadius}px`,
        maxWidth,
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export const containerDefinition: ComponentDefinition = {
  type: 'Container',
  displayName: 'Container',
  category: 'Layout',
  icon: 'box',
  defaultProps: {
    padding: '16px',
    background: 'transparent',
    borderRadius: 0,
    maxWidth: '100%',
  },
  propSchema: {
    padding: { type: 'text' },
    background: { type: 'color' },
    borderRadius: { type: 'number' },
    maxWidth: { type: 'text' },
  },
  acceptsChildren: true,
}
