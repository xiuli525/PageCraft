import React, { useState, useCallback } from 'react'
import { EditorProvider, useEditor } from './EditorProvider'
import { Canvas } from '../canvas/Canvas'
import { ComponentPalette } from '../sidebar/ComponentPalette'
import { LayerTree } from '../sidebar/LayerTree'
import { PropertyPanel } from '../properties/PropertyPanel'
import { Toolbar } from '../toolbar/Toolbar'
import { DndProvider } from '../dnd/DndProvider'
import { useCanvasDnd } from '../dnd/use-canvas-dnd'
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts'
import type { DragStartEvent } from '@dnd-kit/core'
import type { EditorConfig, NodeId } from '../types'

const LEFT_WIDTH = 240
const RIGHT_WIDTH = 300

const PreviewNode: React.FC<{ nodeId: NodeId }> = ({ nodeId }) => {
  const { document, componentRenderers, componentMap } = useEditor()
  const node = document.nodes[nodeId]

  if (!node || node.hidden) return null

  const definition = componentMap[node.type]
  const acceptsChildren =
    definition?.acceptsChildren === true || Array.isArray(definition?.acceptsChildren)

  const childElements = node.children.map((childId: string) => (
    <PreviewNode key={childId} nodeId={childId} />
  ))

  if (nodeId === document.rootId) {
    return <div style={{ minHeight: '100vh' }}>{childElements}</div>
  }

  const Component = componentRenderers.get(node.type)

  if (Component) {
    if (acceptsChildren) {
      return (
        <Component {...node.props}>{childElements.length > 0 ? childElements : null}</Component>
      )
    }
    return <Component {...node.props} />
  }

  return childElements.length > 0 ? <div>{childElements}</div> : null
}

const PreviewLayout: React.FC = () => {
  const { actions, document } = useEditor()

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
      }}
    >
      <PreviewNode nodeId={document.rootId} />
      <button
        onClick={() => actions.setMode('design')}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          padding: '10px 20px',
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
          zIndex: 9999,
        }}
      >
        ✏ Back to Editor
      </button>
    </div>
  )
}

const overlayPillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 16px',
  background: '#3b82f6',
  color: '#fff',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
}

const EditorLayout: React.FC = () => {
  const { panels, mode, componentMap, document: doc } = useEditor()
  const { onDragEnd } = useCanvasDnd()
  const [dragLabel, setDragLabel] = useState<string | null>(null)

  useKeyboardShortcuts()

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const data = event.active.data.current
      if (data?.type === 'palette-item') {
        const def = componentMap[data.componentType as string]
        setDragLabel(def?.displayName ?? (data.componentType as string))
      } else if (data?.type === 'canvas-node') {
        const node = doc.nodes[event.active.id as string]
        setDragLabel(node?.displayName ?? node?.type ?? 'Component')
      }
    },
    [componentMap, doc.nodes],
  )

  const handleDragEnd = useCallback(
    (event: Parameters<typeof onDragEnd>[0]) => {
      setDragLabel(null)
      onDragEnd(event)
    },
    [onDragEnd],
  )

  if (mode === 'preview') {
    return <PreviewLayout />
  }

  const overlay = dragLabel ? <div style={overlayPillStyle}>{dragLabel}</div> : null

  return (
    <DndProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd} dragOverlay={overlay}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <Toolbar />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {!panels.isLeftCollapsed && (
            <div
              style={{
                width: LEFT_WIDTH,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#1e1e2e',
                color: '#e5e7eb',
                borderRight: '1px solid #374151',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  borderBottom: '1px solid #374151',
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#9ca3af',
                    borderBottom: '1px solid #374151',
                  }}
                >
                  Components
                </div>
                <ComponentPalette />
              </div>

              <div style={{ flex: 1, overflow: 'auto' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#9ca3af',
                    borderBottom: '1px solid #374151',
                  }}
                >
                  Layers
                </div>
                <LayerTree />
              </div>
            </div>
          )}

          <Canvas />

          {!panels.isRightCollapsed && (
            <div
              style={{
                width: RIGHT_WIDTH,
                flexShrink: 0,
                backgroundColor: '#f8f9fa',
                borderLeft: '1px solid #e5e7eb',
                overflow: 'hidden',
              }}
            >
              <PropertyPanel />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  )
}

export interface PageEditorProps {
  config: EditorConfig
}

export const PageEditor: React.FC<PageEditorProps> = ({ config }) => {
  return (
    <EditorProvider config={config}>
      <EditorLayout />
    </EditorProvider>
  )
}
