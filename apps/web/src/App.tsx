import React, { useState, useCallback, useMemo } from 'react'
import type { PageDocument } from '@pageforge/core'
import { sampleDocument } from './sample-document'

type EditorMode = 'design' | 'preview'
type ViewportSize = 'desktop' | 'tablet' | 'mobile'

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

function renderNode(
  doc: PageDocument,
  nodeId: string,
  selectedId: string | null,
  onSelect: (id: string) => void,
  isPreview: boolean,
): React.ReactNode {
  const node = doc.nodes[nodeId]
  if (!node) return null

  const children = node.children.map((childId) =>
    renderNode(doc, childId, selectedId, onSelect, isPreview),
  )

  const isSelected = selectedId === nodeId && !isPreview
  const isRoot = node.type === 'Root'

  const baseStyle: React.CSSProperties = {
    ...(isSelected ? { outline: '2px solid #667eea', outlineOffset: '2px' } : {}),
    ...(!isPreview && !isRoot ? { cursor: 'pointer' } : {}),
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview || isRoot) return
    e.stopPropagation()
    onSelect(nodeId)
  }

  const p = node.props as Record<string, string>

  switch (node.type) {
    case 'Root':
      return (
        <div key={nodeId} style={{ minHeight: '100%' }}>
          {children}
        </div>
      )

    case 'Section':
      return (
        <section
          key={nodeId}
          onClick={handleClick}
          style={{
            ...baseStyle,
            padding: p.padding,
            background: p.background,
            textAlign: (p.textAlign as React.CSSProperties['textAlign']) ?? undefined,
          }}
        >
          {children}
        </section>
      )

    case 'Container':
      return (
        <div
          key={nodeId}
          onClick={handleClick}
          style={{
            ...baseStyle,
            padding: p.padding,
            borderRadius: p.borderRadius,
            background: p.background,
            textAlign: (p.textAlign as React.CSSProperties['textAlign']) ?? undefined,
          }}
        >
          {children}
        </div>
      )

    case 'Columns': {
      const cols = Number(p.columns) || 3
      return (
        <div
          key={nodeId}
          onClick={handleClick}
          style={{
            ...baseStyle,
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: p.gap ?? '16px',
            maxWidth: p.maxWidth,
            margin: p.margin,
          }}
        >
          {children}
        </div>
      )
    }

    case 'Heading': {
      const Tag =
        `h${Math.min(Math.max(Number(p.level) || 1, 1), 6)}` as keyof JSX.IntrinsicElements
      return (
        <Tag
          key={nodeId}
          onClick={handleClick}
          style={{
            ...baseStyle,
            color: p.color,
            fontSize: p.fontSize,
            textAlign: (p.textAlign as React.CSSProperties['textAlign']) ?? undefined,
            marginBottom: p.marginBottom,
          }}
        >
          {p.text}
        </Tag>
      )
    }

    case 'Text':
      return (
        <p
          key={nodeId}
          onClick={handleClick}
          style={{
            ...baseStyle,
            color: p.color,
            fontSize: p.fontSize,
            maxWidth: p.maxWidth,
            margin: p.margin,
            lineHeight: 1.6,
          }}
        >
          {p.text}
        </p>
      )

    case 'Button': {
      const isLarge = p.size === 'large'
      return (
        <button
          key={nodeId}
          onClick={handleClick}
          style={{
            ...baseStyle,
            padding: isLarge ? '14px 32px' : '10px 20px',
            fontSize: isLarge ? '18px' : '14px',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: p.backgroundColor ?? '#667eea',
            color: p.color ?? '#ffffff',
          }}
        >
          {p.text}
        </button>
      )
    }

    case 'Spacer':
      return (
        <div
          key={nodeId}
          onClick={handleClick}
          style={{ ...baseStyle, height: p.height ?? '24px' }}
        />
      )

    case 'Divider':
      return (
        <hr
          key={nodeId}
          onClick={handleClick}
          style={{ ...baseStyle, border: 'none', borderTop: '1px solid #e0e0e0', margin: '16px 0' }}
        />
      )

    default:
      return (
        <div key={nodeId} onClick={handleClick} style={baseStyle}>
          {children.length > 0 ? children : `[${node.type}]`}
        </div>
      )
  }
}

function PropertyPanel({
  doc,
  nodeId,
  onChange,
}: {
  doc: PageDocument
  nodeId: string | null
  onChange: (doc: PageDocument) => void
}) {
  if (!nodeId) {
    return (
      <div style={{ padding: 20, color: '#888', textAlign: 'center', fontSize: 14 }}>
        Select an element to edit its properties
      </div>
    )
  }

  const node = doc.nodes[nodeId]
  if (!node) return null

  const updateProp = (key: string, value: string) => {
    const updated = {
      ...doc,
      nodes: {
        ...doc.nodes,
        [nodeId]: {
          ...node,
          props: { ...node.props, [key]: value },
        },
      },
    }
    onChange(updated)
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>TYPE</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#333' }}>
        {node.type}
      </div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>PROPERTIES</div>
      {Object.entries(node.props).map(([key, value]) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#555', marginBottom: 4 }}>
            {key}
          </label>
          <input
            type="text"
            value={String(value ?? '')}
            onChange={(e) => updateProp(key, e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: 6,
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      ))}
    </div>
  )
}

function LayerTree({
  doc,
  nodeId,
  selectedId,
  onSelect,
  depth,
}: {
  doc: PageDocument
  nodeId: string
  selectedId: string | null
  onSelect: (id: string) => void
  depth: number
}) {
  const node = doc.nodes[nodeId]
  if (!node) return null

  const isRoot = node.type === 'Root'
  const isSelected = selectedId === nodeId

  return (
    <div>
      <div
        onClick={(e) => {
          e.stopPropagation()
          if (!isRoot) onSelect(nodeId)
        }}
        style={{
          padding: '4px 8px',
          paddingLeft: depth * 16 + 8,
          fontSize: 13,
          cursor: isRoot ? 'default' : 'pointer',
          background: isSelected ? '#667eea22' : 'transparent',
          color: isSelected ? '#667eea' : '#ccc',
          borderLeft: isSelected ? '2px solid #667eea' : '2px solid transparent',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {node.displayName ?? node.type}
      </div>
      {node.children.map((childId) => (
        <LayerTree
          key={childId}
          doc={doc}
          nodeId={childId}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

export function App() {
  const [doc, setDoc] = useState<PageDocument>(sampleDocument)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [mode, setMode] = useState<EditorMode>('design')
  const [viewport, setViewport] = useState<ViewportSize>('desktop')

  const isPreview = mode === 'preview'

  const handleSelect = useCallback((id: string) => {
    setSelectedNodeId(id)
  }, [])

  const handleCanvasClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  const viewportWidth = useMemo(() => VIEWPORT_WIDTHS[viewport], [viewport])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f0f5' }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          height: 48,
          background: '#1e1e2e',
          borderBottom: '1px solid #2a2a3e',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#667eea' }}>⬡ PageForge</span>
          <span style={{ fontSize: 13, color: '#888' }}>{doc.meta.title}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['desktop', 'tablet', 'mobile'] as ViewportSize[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                background: viewport === v ? '#667eea' : 'transparent',
                color: viewport === v ? '#fff' : '#888',
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setMode('design')}
            style={{
              padding: '6px 16px',
              fontSize: 13,
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              background: mode === 'design' ? '#667eea' : 'transparent',
              color: mode === 'design' ? '#fff' : '#888',
            }}
          >
            Design
          </button>
          <button
            onClick={() => setMode('preview')}
            style={{
              padding: '6px 16px',
              fontSize: 13,
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              background: mode === 'preview' ? '#667eea' : 'transparent',
              color: mode === 'preview' ? '#fff' : '#888',
            }}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Layers */}
        {!isPreview && (
          <div
            style={{
              width: 240,
              background: '#1e1e2e',
              borderRight: '1px solid #2a2a3e',
              overflow: 'auto',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                fontSize: 11,
                fontWeight: 600,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Layers
            </div>
            <LayerTree
              doc={doc}
              nodeId={doc.rootId}
              selectedId={selectedNodeId}
              onSelect={handleSelect}
              depth={0}
            />
          </div>
        )}

        {/* Canvas */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            padding: isPreview ? 0 : 24,
            overflow: 'auto',
            background: isPreview ? '#ffffff' : '#e8e8f0',
          }}
          onClick={handleCanvasClick}
        >
          <div
            style={{
              width: viewportWidth,
              maxWidth: '100%',
              background: '#ffffff',
              boxShadow: isPreview ? 'none' : '0 4px 24px rgba(0,0,0,0.12)',
              borderRadius: isPreview ? 0 : 8,
              overflow: 'auto',
              transition: 'width 0.3s ease',
            }}
          >
            {renderNode(doc, doc.rootId, selectedNodeId, handleSelect, isPreview)}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        {!isPreview && (
          <div
            style={{
              width: 280,
              background: '#f8f9fa',
              borderLeft: '1px solid #e0e0e0',
              overflow: 'auto',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                fontSize: 11,
                fontWeight: 600,
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              Properties
            </div>
            <PropertyPanel doc={doc} nodeId={selectedNodeId} onChange={setDoc} />
          </div>
        )}
      </div>
    </div>
  )
}
