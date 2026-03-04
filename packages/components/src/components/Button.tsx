import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface ButtonProps {
  label?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  url?: string
  fullWidth?: boolean
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: {
    background: '#2563eb',
    color: '#ffffff',
    border: '2px solid #2563eb',
  },
  secondary: {
    background: '#6b7280',
    color: '#ffffff',
    border: '2px solid #6b7280',
  },
  outline: {
    background: 'transparent',
    color: '#2563eb',
    border: '2px solid #2563eb',
  },
  ghost: {
    background: 'transparent',
    color: '#374151',
    border: '2px solid transparent',
  },
}

const SIZE_STYLES: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '14px' },
  md: { padding: '10px 20px', fontSize: '16px' },
  lg: { padding: '14px 28px', fontSize: '18px' },
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  label = 'Click me',
  variant = 'primary',
  size = 'md',
  url,
  fullWidth = false,
  style,
  className,
  onClick,
}) => {
  const variantStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES['primary']
  const sizeStyle = SIZE_STYLES[size] ?? SIZE_STYLES['md']

  const baseStyle: React.CSSProperties = {
    ...variantStyle,
    ...sizeStyle,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    width: fullWidth ? '100%' : undefined,
    boxSizing: 'border-box',
    transition: 'opacity 0.15s ease',
    ...style,
  }

  if (url) {
    return (
      <a href={url} className={className} style={baseStyle}>
        {label}
      </a>
    )
  }

  return (
    <button className={className} style={baseStyle} onClick={onClick} type="button">
      {label}
    </button>
  )
}

export const buttonDefinition: ComponentDefinition = {
  type: 'Button',
  displayName: 'Button',
  category: 'Basic',
  icon: 'square',
  defaultProps: {
    label: 'Click me',
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
  propSchema: {
    label: { type: 'text' },
    variant: {
      type: 'select',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
      ],
    },
    size: {
      type: 'select',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
    url: { type: 'url' },
    fullWidth: { type: 'boolean' },
  },
  acceptsChildren: false,
}
