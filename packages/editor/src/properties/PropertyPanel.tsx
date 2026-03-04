import React from 'react'
import { useEditor } from '../editor/EditorProvider'
import { PropertyField } from './PropertyField'
import { StyleEditor } from './StyleEditor'

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  color: '#9ca3af',
  padding: '12px 16px 8px',
  borderBottom: '1px solid #e5e7eb',
}

export const PropertyPanel: React.FC = () => {
  const { document, selectedNodeIds, componentMap, actions } = useEditor()

  const selectedId = selectedNodeIds[0]
  const selectedNode = selectedId ? document.nodes[selectedId] : null
  const definition = selectedNode ? componentMap[selectedNode.type] : null

  if (!selectedNode || !definition || !selectedId) {
    return (
      <div
        style={{
          padding: 24,
          color: '#9ca3af',
          fontSize: 13,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 32, opacity: 0.5 }}>🎯</span>
        <span>Select a component to edit its properties</span>
      </div>
    )
  }

  const handlePropChange = (propName: string, value: unknown) => {
    if (!selectedId) return
    actions.updateNode(selectedId, {
      props: { ...selectedNode.props, [propName]: value },
    })
  }

  const handleStyleChange = (styles: Record<string, React.CSSProperties>) => {
    if (!selectedId) return
    actions.updateNode(selectedId, { styles })
  }

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            background: '#eff6ff',
            color: '#3b82f6',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {definition.displayName}
        </span>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{selectedId.slice(0, 8)}</span>
      </div>

      <div style={sectionTitleStyle}>Properties</div>
      <div style={{ padding: 16 }}>
        {Object.entries(definition.propSchema).map(([name, schema]) => (
          <PropertyField
            key={name}
            label={name}
            schema={schema}
            value={selectedNode.props[name]}
            onChange={(v) => handlePropChange(name, v)}
          />
        ))}
      </div>

      <div style={sectionTitleStyle}>Styles</div>
      <div style={{ padding: 16 }}>
        <StyleEditor
          styles={(selectedNode.styles ?? {}) as Record<string, React.CSSProperties>}
          onChange={handleStyleChange}
        />
      </div>
    </div>
  )
}
