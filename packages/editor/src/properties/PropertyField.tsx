import React from 'react'
import { PropSchema } from '../types'

interface PropertyFieldProps {
  label: string
  value: unknown
  schema: PropSchema
  onChange: (value: unknown) => void
}

export const PropertyField: React.FC<PropertyFieldProps> = ({ label, value, schema, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let newValue: unknown = e.target.value
    if (e.target.type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked
    } else if (e.target.type === 'number') {
      newValue = parseFloat(e.target.value)
    }
    onChange(newValue)
  }

  let input = <div style={{ color: 'red' }}>Unknown type</div>

  switch (schema.type) {
    case 'text':
    case 'url':
    case 'image':
      input = (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={handleChange}
          style={{ width: '100%', padding: 4, borderRadius: 4, border: '1px solid #d1d5db' }}
        />
      )
      break
    case 'number':
      input = (
        <input
          type="number"
          value={(value as number) || 0}
          onChange={handleChange}
          style={{ width: '100%', padding: 4, borderRadius: 4, border: '1px solid #d1d5db' }}
        />
      )
      break
    case 'boolean':
      input = <input type="checkbox" checked={!!value} onChange={handleChange} />
      break
    case 'color':
      input = (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="color"
            value={(value as string) || '#000000'}
            onChange={handleChange}
            style={{ border: 'none', padding: 0, width: 24, height: 24, cursor: 'pointer' }}
          />
          <input
            type="text"
            value={(value as string) || ''}
            onChange={handleChange}
            style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #d1d5db' }}
          />
        </div>
      )
      break
    case 'select':
      input = (
        <select
          value={(value as string) || ''}
          onChange={handleChange}
          style={{ width: '100%', padding: 4, borderRadius: 4, border: '1px solid #d1d5db' }}
        >
          {schema.options.map((opt) => (
            <option key={opt.value as string} value={opt.value as string}>
              {opt.label}
            </option>
          ))}
        </select>
      )
      break
    default:
      input = <div style={{ fontSize: 12, color: '#9ca3af' }}>Complex type not supported</div>
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: 'block',
          fontSize: 12,
          marginBottom: 4,
          fontWeight: 500,
          color: '#374151',
        }}
      >
        {label}
      </label>
      {input}
    </div>
  )
}
