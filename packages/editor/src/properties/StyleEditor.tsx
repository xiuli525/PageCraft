import React, { useState } from 'react'

type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'

interface StyleEditorProps {
  styles: Record<string, React.CSSProperties>
  onChange: (styles: Record<string, React.CSSProperties>) => void
}

const breakpoints: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl']

const styleFields: Array<{
  key: string
  label: string
  type: 'text' | 'number' | 'select'
  options?: string[]
}> = [
  { key: 'width', label: 'Width', type: 'text' },
  { key: 'height', label: 'Height', type: 'text' },
  { key: 'maxWidth', label: 'Max Width', type: 'text' },
  { key: 'minHeight', label: 'Min Height', type: 'text' },
  { key: 'padding', label: 'Padding', type: 'text' },
  { key: 'margin', label: 'Margin', type: 'text' },
  { key: 'backgroundColor', label: 'Background', type: 'text' },
  { key: 'borderRadius', label: 'Border Radius', type: 'text' },
  {
    key: 'display',
    label: 'Display',
    type: 'select',
    options: ['block', 'flex', 'grid', 'inline', 'inline-flex', 'none'],
  },
  {
    key: 'flexDirection',
    label: 'Flex Direction',
    type: 'select',
    options: ['row', 'column', 'row-reverse', 'column-reverse'],
  },
  { key: 'gap', label: 'Gap', type: 'text' },
  {
    key: 'justifyContent',
    label: 'Justify',
    type: 'select',
    options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
  },
  {
    key: 'alignItems',
    label: 'Align',
    type: 'select',
    options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
  },
]

const tabStyle: React.CSSProperties = {
  padding: '4px 8px',
  border: 'none',
  background: 'transparent',
  color: '#6b7280',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  borderBottom: '2px solid transparent',
}

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  color: '#3b82f6',
  borderBottomColor: '#3b82f6',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  border: '1px solid #d1d5db',
  borderRadius: 4,
  fontSize: 12,
  color: '#111827',
  background: '#fff',
  boxSizing: 'border-box',
}

export const StyleEditor: React.FC<StyleEditorProps> = ({ styles, onChange }) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('base')

  const currentStyles = (styles[activeBreakpoint] ?? {}) as Record<string, unknown>

  const handleChange = (key: string, value: string) => {
    const updated = { ...styles }
    const bp = updated[activeBreakpoint] ?? {}
    if (value === '') {
      const { [key]: _, ...rest } = bp as Record<string, unknown>
      updated[activeBreakpoint] = rest as React.CSSProperties
    } else {
      updated[activeBreakpoint] = { ...bp, [key]: value } as React.CSSProperties
    }
    onChange(updated)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: 12,
        }}
      >
        {breakpoints.map((bp) => (
          <button
            key={bp}
            style={activeBreakpoint === bp ? activeTabStyle : tabStyle}
            onClick={() => setActiveBreakpoint(bp)}
          >
            {bp.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {styleFields.map((field) => (
          <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label
              style={{ fontSize: 11, color: '#6b7280', width: 80, flexShrink: 0, fontWeight: 500 }}
            >
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                style={inputStyle}
                value={String(currentStyles[field.key] ?? '')}
                onChange={(e) => handleChange(field.key, e.target.value)}
              >
                <option value="">—</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                style={inputStyle}
                value={String(currentStyles[field.key] ?? '')}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder="auto"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
