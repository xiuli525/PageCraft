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
