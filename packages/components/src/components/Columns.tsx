import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface ColumnsProps {
  columns?: number
  gap?: number
  verticalAlign?: 'top' | 'center' | 'bottom'
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

const VERTICAL_ALIGN_MAP: Record<string, React.CSSProperties['alignItems']> = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
}

export const ColumnsComponent: React.FC<ColumnsProps> = ({
  columns = 2,
  gap = 16,
  verticalAlign = 'top',
  style,
  className,
  children,
}) => {
  const alignItems = VERTICAL_ALIGN_MAP[verticalAlign] ?? 'flex-start'
  const childrenArray = React.Children.toArray(children)

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: `${gap}px`,
        alignItems,
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {childrenArray.map((child, i) => (
        <div
          key={i}
          style={{
            flex: `0 0 calc(${100 / columns}% - ${(gap * (columns - 1)) / columns}px)`,
            minWidth: 0,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const columnsDefinition: ComponentDefinition = {
  type: 'Columns',
  displayName: 'Columns',
  category: 'Layout',
  icon: 'columns',
  defaultProps: {
    columns: 2,
    gap: 16,
    verticalAlign: 'top',
  },
  propSchema: {
    columns: { type: 'number' },
    gap: { type: 'number' },
    verticalAlign: {
      type: 'select',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
    },
  },
  acceptsChildren: true,
}
