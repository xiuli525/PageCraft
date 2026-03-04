export type NodeId = string

export interface PageNode {
  id: NodeId
  type: string
  displayName?: string
  props: Record<string, unknown>
  children: NodeId[]
  parentId: NodeId | null
  styles?: Record<string, string | number>
  hidden?: boolean
  locked?: boolean
}

export interface PageDocument {
  version: number
  rootId: NodeId
  nodes: Record<NodeId, PageNode>
  meta: {
    title?: string
    description?: string
  }
}
