import React from 'react'

export type NodeId = string

export interface PageNode {
  id: NodeId
  type: string
  displayName?: string
  props: Record<string, unknown>
  children: NodeId[]
  slots: Record<string, NodeId | NodeId[]>
  parentId: NodeId | null
  slotKey?: string
  styles?: Record<string, React.CSSProperties>
  classNames?: string[]
  hidden?: boolean
  locked?: boolean
  meta?: Record<string, unknown>
}

export interface PageDocument {
  version: number
  rootId: NodeId
  nodes: Record<NodeId, PageNode>
  styles: Array<{
    id: string
    name: string
    selector: string
    style: React.CSSProperties
  }>
  meta: {
    title?: string
    description?: string
  }
}

export type PropSchema =
  | { type: 'text' | 'richtext' | 'number' | 'boolean' | 'color' | 'url' | 'image' }
  | { type: 'select'; options: Array<{ label: string; value: unknown }> }
  | { type: 'slot'; allowedTypes?: string[] }
  | { type: 'object'; fields: Record<string, PropSchema> }
  | { type: 'array'; items: PropSchema }

export interface ComponentDefinition {
  type: string
  displayName: string
  category?: string
  icon?: string
  defaultProps?: Record<string, unknown>
  propSchema: Record<string, PropSchema>
  acceptsChildren?: boolean | string[]
}

export type EditorMode = 'design' | 'preview'
export type EditorViewport = 'desktop' | 'tablet' | 'mobile'

/** Map from component type string to React component that renders it */
export type ComponentRendererMap = Map<string, React.ComponentType<Record<string, unknown>>>

export interface EditorConfig {
  initialDocument: PageDocument
  componentDefinitions: ComponentDefinition[]
  /** React components keyed by type name (e.g. 'Text' → TextComponent) */
  componentRenderers?: ComponentRendererMap
  onChange?: (document: PageDocument) => void
  onSave?: (document: PageDocument) => void
}

export interface PanelState {
  isLeftCollapsed: boolean
  isRightCollapsed: boolean
}

export interface EditorActions {
  selectNode: (nodeId: NodeId | null, append?: boolean) => void
  hoverNode: (nodeId: NodeId | null) => void
  setMode: (mode: EditorMode) => void
  setViewport: (viewport: EditorViewport) => void
  setZoom: (zoom: number) => void
  togglePanel: (panel: keyof PanelState) => void
  updateNode: (nodeId: NodeId, updates: Partial<PageNode>) => void
  addNode: (node: PageNode, parentId: NodeId, index?: number) => void
  removeNode: (nodeId: NodeId) => void
  moveNode: (nodeId: NodeId, targetParentId: NodeId, index: number) => void
  undo: () => void
  redo: () => void
  save: () => void
  copySelected: () => void
  pasteNodes: (targetParentId: NodeId) => void
}

export interface EditorState {
  document: PageDocument
  selectedNodeIds: NodeId[]
  hoveredNodeId: NodeId | null
  mode: EditorMode
  viewport: EditorViewport
  zoom: number
  panels: PanelState
  componentMap: Record<string, ComponentDefinition>
  componentRenderers: ComponentRendererMap
  canUndo: boolean
  canRedo: boolean
}

export interface EditorContextValue extends EditorState {
  actions: EditorActions
}
