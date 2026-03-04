import * as React from 'react'

export type NodeId = string

export interface ResponsiveStyles {
  base?: React.CSSProperties
  sm?: React.CSSProperties
  md?: React.CSSProperties
  lg?: React.CSSProperties
  xl?: React.CSSProperties
}

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

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'

export interface BreakpointConfig {
  sm: number
  md: number
  lg: number
  xl: number
}

export const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

export interface DesignTokens {
  colors?: Record<string, string>
  spacing?: Record<string, string | number>
  typography?: Record<string, string | number>
  [key: string]: Record<string, string | number> | undefined
}

export interface StyleContextValue {
  breakpoint: Breakpoint
  viewportWidth: number
  breakpointConfig: BreakpointConfig
  designTokens: DesignTokens
}

export interface PageRendererProps {
  document: PageDocument
  componentRegistry: Map<string, React.ComponentType<Record<string, unknown>>>
  selectedNodeId?: string | null
  hoveredNodeId?: string | null
  onNodeClick?: (nodeId: string) => void
  onNodeHover?: (nodeId: string | null) => void
  isEditing?: boolean
}

export interface NodeRendererProps {
  nodeId: NodeId
  document: PageDocument
  componentRegistry: Map<string, React.ComponentType<Record<string, unknown>>>
  selectedNodeId?: string | null
  hoveredNodeId?: string | null
  onNodeClick?: (nodeId: string) => void
  onNodeHover?: (nodeId: string | null) => void
  isEditing?: boolean
}
