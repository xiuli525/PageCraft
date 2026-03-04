import type { NodeId, PageNode, PageDocument } from '../schema/types'
import { generateId, ROOT_ID } from '../utils/id'

export function createNode(
  type: string,
  props: Record<string, unknown> = {},
  overrides: Partial<PageNode> = {},
): PageNode {
  return {
    id: generateId(),
    type,
    props,
    children: [],
    slots: {},
    parentId: null,
    ...overrides,
  }
}

export function createRootNode(): PageNode {
  return {
    id: ROOT_ID,
    type: 'Root',
    displayName: 'Root',
    props: {},
    children: [],
    slots: {},
    parentId: null,
  }
}

export function createEmptyDocument(title = 'Untitled'): PageDocument {
  const root = createRootNode()
  return {
    version: 1,
    rootId: ROOT_ID,
    nodes: { [ROOT_ID]: root },
    styles: [],
    meta: { title },
  }
}

export function findNode(doc: PageDocument, nodeId: NodeId): PageNode | undefined {
  return doc.nodes[nodeId]
}

export function getChildren(doc: PageDocument, nodeId: NodeId): PageNode[] {
  const node = doc.nodes[nodeId]
  if (!node) return []
  return node.children.map((id) => doc.nodes[id]).filter((n): n is PageNode => n !== undefined)
}

export function getAncestors(doc: PageDocument, nodeId: NodeId): PageNode[] {
  const ancestors: PageNode[] = []
  let current = doc.nodes[nodeId]
  while (current?.parentId) {
    const parent = doc.nodes[current.parentId]
    if (!parent) break
    ancestors.push(parent)
    current = parent
  }
  return ancestors
}

export function getDescendants(doc: PageDocument, nodeId: NodeId): PageNode[] {
  const descendants: PageNode[] = []
  const stack = [nodeId]
  while (stack.length > 0) {
    const id = stack.pop()!
    const node = doc.nodes[id]
    if (!node) continue
    if (id !== nodeId) descendants.push(node)
    for (let i = node.children.length - 1; i >= 0; i--) {
      const childId = node.children[i]
      if (childId !== undefined) stack.push(childId)
    }
  }
  return descendants
}

export function isAncestor(doc: PageDocument, ancestorId: NodeId, descendantId: NodeId): boolean {
  let current = doc.nodes[descendantId]
  while (current?.parentId) {
    if (current.parentId === ancestorId) return true
    current = doc.nodes[current.parentId]
  }
  return false
}

export function collectNodeTree(doc: PageDocument, nodeId: NodeId): Record<NodeId, PageNode> {
  const collected: Record<NodeId, PageNode> = {}
  const stack = [nodeId]
  while (stack.length > 0) {
    const id = stack.pop()!
    const node = doc.nodes[id]
    if (!node) continue
    collected[id] = node
    stack.push(...node.children)
  }
  return collected
}
