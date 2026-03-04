import type { CSSProperties } from 'react'

// ─── Node Identity ───────────────────────────────────────────
export type NodeId = string

// ─── Responsive Styles ───────────────────────────────────────
export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'

export type ResponsiveStyles = Partial<Record<Breakpoint, CSSProperties>>

// ─── Data Binding ────────────────────────────────────────────
export interface DataBinding {
  source: 'variable' | 'expression' | 'api'
  path: string
  fallback?: unknown
}

// ─── Events / Actions ────────────────────────────────────────
export type ActionType =
  | { kind: 'navigate'; url: string; newTab?: boolean }
  | { kind: 'setState'; key: string; value: unknown }
  | { kind: 'runAction'; actionId: string; payload?: Record<string, unknown> }
  | { kind: 'custom'; handler: string }

export interface EventBinding {
  event: string // e.g. "onClick", "onSubmit"
  actions: ActionType[]
}

// ─── Style Token (separate stylesheet) ───────────────────────
export interface StyleToken {
  id: string
  name: string
  selector: string
  style: CSSProperties
  breakpoint?: Breakpoint
}

// ─── Prop Schema ─────────────────────────────────────────────
export type PropSchema =
  | { type: 'text' | 'richtext' | 'number' | 'boolean' | 'color' | 'url' | 'image' }
  | { type: 'select'; options: Array<{ label: string; value: unknown }> }
  | { type: 'slot'; allowedTypes?: string[] }
  | { type: 'object'; fields: Record<string, PropSchema> }
  | { type: 'array'; items: PropSchema }

// ─── Component Definition ────────────────────────────────────
export interface ComponentDefinition {
  type: string
  displayName: string
  category?: string
  icon?: string
  defaultProps?: Record<string, unknown>
  propSchema: Record<string, PropSchema>
  acceptsChildren?: boolean | string[]
}

// ─── Page Node (flat-map element) ────────────────────────────
export interface PageNode {
  id: NodeId
  type: string
  displayName?: string
  props: Record<string, unknown>
  children: NodeId[]
  slots: Record<string, NodeId | NodeId[]>
  parentId: NodeId | null
  slotKey?: string
  styles?: ResponsiveStyles
  classNames?: string[]
  events?: EventBinding[]
  hidden?: boolean
  locked?: boolean
  meta?: Record<string, unknown>
}

// ─── Page Document ───────────────────────────────────────────
export interface PageDocument {
  version: number
  rootId: NodeId
  nodes: Record<NodeId, PageNode>
  styles: StyleToken[]
  meta: {
    title?: string
    description?: string
    breakpoints?: Record<string, number>
  }
  tokens?: {
    colors?: Record<string, string>
    spacing?: Record<string, string>
    typography?: Record<string, CSSProperties>
  }
}

// ─── Document Store State ────────────────────────────────────
export interface DocumentState {
  document: PageDocument
  selectedNodeIds: NodeId[]
  hoveredNodeId: NodeId | null
  clipboard: PageNode[] | null
  undoStack: PageDocument[]
  redoStack: PageDocument[]
}

// ─── Event Types ─────────────────────────────────────────────
export type PageForgeEvents = {
  'node:added': { nodeId: NodeId; parentId: NodeId }
  'node:removed': { nodeId: NodeId }
  'node:updated': { nodeId: NodeId; changes: Partial<PageNode> }
  'node:moved': { nodeId: NodeId; oldParentId: NodeId; newParentId: NodeId }
  'selection:changed': { nodeIds: NodeId[] }
  'document:loaded': { document: PageDocument }
  'document:saved': { document: PageDocument }
  'history:undo': undefined
  'history:redo': undefined
}
