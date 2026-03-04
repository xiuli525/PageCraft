import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface SectionProps {
  padding?: string
  background?: string
  minHeight?: string
  verticalAlign?: 'top' | 'center' | 'bottom'
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

const JUSTIFY_MAP: Record<string, React.CSSProperties['justifyContent']> = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
}

export const SectionComponent: React.FC<SectionProps> = ({
  padding = '48px 24px',
  background = 'transparent',
  minHeight = 'auto',
  verticalAlign = 'top',
  style,
  className,
  children,
}) => {
  const justifyContent = JUSTIFY_MAP[verticalAlign] ?? 'flex-start'

  return (
    <section
      className={className}
      style={{
        width: '100%',
        padding,
        background,
        minHeight,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent,
        ...style,
      }}
    >
      {children}
    </section>
  )
}

export const sectionDefinition: ComponentDefinition = {
  type: 'Section',
  displayName: 'Section',
  category: 'Layout',
  icon: 'layout',
  defaultProps: {
    padding: '48px 24px',
    background: 'transparent',
    minHeight: 'auto',
    verticalAlign: 'top',
  },
  propSchema: {
    padding: { type: 'text' },
    background: { type: 'color' },
    minHeight: { type: 'text' },
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
