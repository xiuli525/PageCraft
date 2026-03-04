import React from 'react'
import { EditorProvider, useEditor } from './EditorProvider'
import { Canvas } from '../canvas/Canvas'
import { ComponentPalette } from '../sidebar/ComponentPalette'
import { LayerTree } from '../sidebar/LayerTree'
import { PropertyPanel } from '../properties/PropertyPanel'
import { Toolbar } from '../toolbar/Toolbar'
import type { EditorConfig } from '../types'

const LEFT_WIDTH = 240
const RIGHT_WIDTH = 300

const EditorLayout: React.FC = () => {
  const { panels } = useEditor()

  return (
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
