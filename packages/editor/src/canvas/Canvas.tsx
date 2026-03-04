import React from 'react'
import { useEditor } from '../editor/EditorProvider'
import { CanvasNode } from './CanvasNode'
import { SelectionOverlay } from './SelectionOverlay'
import { useCanvasDnd } from '../dnd/use-canvas-dnd'
import { DndProvider } from '../dnd/DndProvider'

export const Canvas: React.FC = () => {
  const { document, actions, mode } = useEditor()
  const { onDragEnd } = useCanvasDnd()

  const handleCanvasClick = () => {
    actions.selectNode(null)
  }

  if (!document) return null

  return (
    <div
      onClick={handleCanvasClick}
      style={{
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 40,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <DndProvider onDragEnd={onDragEnd}>
        <div
          style={{
            backgroundColor: 'white',
            width: '100%',
            maxWidth: 1200,
            minHeight: 800,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}
        >
          <CanvasNode nodeId={document.rootId} />
          {mode === 'design' && <SelectionOverlay />}
        </div>
      </DndProvider>
    </div>
  )
}
