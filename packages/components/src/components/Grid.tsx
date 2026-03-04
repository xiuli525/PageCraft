import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface GridProps {
  columns?: number
  gap?: number
  minChildWidth?: string
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

export const GridComponent: React.FC<GridProps> = ({
  columns = 3,
  gap = 16,
  minChildWidth,
  style,
  className,
  children,
}) => {
  const gridTemplateColumns = minChildWidth
    ? `repeat(auto-fill, minmax(${minChildWidth}, 1fr))`
    : `repeat(${columns}, 1fr)`

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap: `${gap}px`,
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export const gridDefinition: ComponentDefinition = {
  type: 'Grid',
  displayName: 'Grid',
  category: 'Layout',
  icon: 'grid',
  defaultProps: {
    columns: 3,
    gap: 16,
    minChildWidth: '',
  },
  propSchema: {
    columns: { type: 'number' },
    gap: { type: 'number' },
    minChildWidth: { type: 'text' },
  },
  acceptsChildren: true,
}
