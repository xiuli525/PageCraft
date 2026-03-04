import React from 'react'
import { useEditor } from '../editor/EditorProvider'
import type { EditorViewport } from '../types'

const viewportOptions: Array<{ value: EditorViewport; label: string; width: string }> = [
  { value: 'desktop', label: '🖥', width: '100%' },
  { value: 'tablet', label: '📱', width: '768px' },
  { value: 'mobile', label: '📲', width: '375px' },
]

const zoomOptions = [50, 75, 100, 125, 150, 200]

const btnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 10px',
  border: '1px solid #e5e7eb',
  borderRadius: 6,
  background: '#fff',
  cursor: 'pointer',
  fontSize: 13,
  color: '#374151',
  lineHeight: 1,
  minWidth: 32,
}

const activeBtnStyle: React.CSSProperties = {
  ...btnStyle,
  background: '#3b82f6',
  color: '#fff',
  borderColor: '#3b82f6',
}

export const Toolbar: React.FC = () => {
  const { mode, viewport, zoom, actions } = useEditor()

  return (
    <div
      style={{
        height: 48,
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        <button style={btnStyle} onClick={actions.undo} title="Undo (Ctrl+Z)">
          ↩
        </button>
        <button style={btnStyle} onClick={actions.redo} title="Redo (Ctrl+Shift+Z)">
          ↪
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {viewportOptions.map((opt) => (
          <button
            key={opt.value}
            style={viewport === opt.value ? activeBtnStyle : btnStyle}
            onClick={() => actions.setViewport(opt.value)}
            title={opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select
          value={zoom * 100}
          onChange={(e) => actions.setZoom(Number(e.target.value) / 100)}
          style={{
            padding: '5px 8px',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: 13,
            color: '#374151',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          {zoomOptions.map((z) => (
            <option key={z} value={z}>
              {z}%
            </option>
          ))}
        </select>

        <button
          style={mode === 'preview' ? activeBtnStyle : btnStyle}
          onClick={() => actions.setMode(mode === 'design' ? 'preview' : 'design')}
        >
          {mode === 'design' ? '👁 Preview' : '✏ Design'}
        </button>

        <button
          style={{ ...btnStyle, background: '#3b82f6', color: '#fff', borderColor: '#3b82f6' }}
          onClick={actions.save}
        >
          💾 Save
        </button>
      </div>
    </div>
  )
}
