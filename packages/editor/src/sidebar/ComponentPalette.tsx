import React from 'react'
import { useEditor } from '../editor/EditorProvider'
import { PaletteItem } from './PaletteItem'
import { ComponentDefinition } from '../types'

export const ComponentPalette: React.FC = () => {
  const { componentMap } = useEditor()

  // Group by category
  const categories: Record<string, ComponentDefinition[]> = {}

  Object.values(componentMap).forEach((def) => {
    const category = def.category || 'Uncategorized'
    if (!categories[category]) categories[category] = []
    categories[category].push(def)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {Object.entries(categories).map(([category, items]) => (
        <div key={category}>
          <h3
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              color: '#9ca3af',
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            {category}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {items.map((def) => (
              <PaletteItem key={def.type} definition={def} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
