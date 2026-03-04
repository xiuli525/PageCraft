import React from 'react'
import { useEditor } from '../editor/EditorProvider'
import { LayerItem } from './LayerItem'

export const LayerTree: React.FC = () => {
  const { document } = useEditor()

  if (!document) return null

  return (
    <div
      style={{
        padding: 0,
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#1e1e2e',
        color: '#e5e7eb',
      }}
    >
      <LayerItem nodeId={document.rootId} depth={0} />
    </div>
  )
}
