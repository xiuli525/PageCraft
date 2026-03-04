import React from 'react'
import { Draggable } from '../dnd/Draggable'
import { ComponentDefinition } from '../types'
import * as Icons from 'lucide-react'

interface PaletteItemProps {
  definition: ComponentDefinition
}

export const PaletteItem: React.FC<PaletteItemProps> = ({ definition }) => {
  const Icon =
    definition.icon && (Icons as any)[definition.icon] ? (Icons as any)[definition.icon] : Icons.Box

  return (
    <Draggable
      id={`palette-${definition.type}`}
      data={{ type: 'palette-item', componentType: definition.type }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          backgroundColor: '#2d2d3b',
          borderRadius: 4,
          cursor: 'grab',
          color: '#e5e7eb',
          gap: 8,
          border: '1px solid #3f3f46',
        }}
      >
        <Icon size={20} />
        <span style={{ fontSize: 12 }}>{definition.displayName}</span>
      </div>
    </Draggable>
  )
}
