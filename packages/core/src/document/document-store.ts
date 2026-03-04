import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { NodeId, PageNode, PageDocument, DocumentState } from '../schema/types'
import { createEmptyDocument, collectNodeTree, isAncestor } from './operations'
import { generateId } from '../utils/id'

const MAX_HISTORY = 50

export interface DocumentActions {
  loadDocument: (doc: PageDocument) => void
  addNode: (parentId: NodeId, node: PageNode, index?: number) => void
  removeNode: (nodeId: NodeId) => void
  updateNode: (nodeId: NodeId, updates: Partial<Omit<PageNode, 'id'>>) => void
  moveNode: (nodeId: NodeId, newParentId: NodeId, index?: number) => void
  selectNode: (nodeId: NodeId | null, append?: boolean) => void
  hoverNode: (nodeId: NodeId | null) => void
  copySelected: () => void
  pasteNodes: (targetParentId: NodeId) => void
  undo: () => void
  redo: () => void
}

export type DocumentStore = DocumentState & DocumentActions

function pushHistory(state: DocumentState) {
  state.undoStack.push(JSON.parse(JSON.stringify(state.document)))
  if (state.undoStack.length > MAX_HISTORY) {
    state.undoStack.shift()
  }
  state.redoStack = []
}

export const createDocumentStore = (initialDocument?: PageDocument) =>
  create<DocumentStore>()(
    immer((set) => ({
      document: initialDocument ?? createEmptyDocument(),
      selectedNodeIds: [],
      hoveredNodeId: null,
      clipboard: null,
      undoStack: [],
      redoStack: [],

      loadDocument: (doc) =>
        set((state) => {
          state.document = doc
          state.selectedNodeIds = []
          state.hoveredNodeId = null
          state.undoStack = []
          state.redoStack = []
        }),

      addNode: (parentId, node, index) =>
        set((state) => {
          pushHistory(state)
          const parent = state.document.nodes[parentId]
          if (!parent) return

          const newNode = { ...node, parentId }
          state.document.nodes[newNode.id] = newNode

          if (index !== undefined && index >= 0) {
            parent.children.splice(index, 0, newNode.id)
          } else {
            parent.children.push(newNode.id)
          }
        }),

      removeNode: (nodeId) =>
        set((state) => {
          const node = state.document.nodes[nodeId]
          if (!node || !node.parentId) return

          pushHistory(state)

          const removeRecursive = (id: NodeId) => {
            const n = state.document.nodes[id]
            if (!n) return
            for (const childId of n.children) {
              removeRecursive(childId)
            }
            delete state.document.nodes[id]
          }

          const parent = state.document.nodes[node.parentId]
          if (parent) {
            parent.children = parent.children.filter((id) => id !== nodeId)
          }

          removeRecursive(nodeId)
          state.selectedNodeIds = state.selectedNodeIds.filter((id) => id !== nodeId)
        }),

      updateNode: (nodeId, updates) =>
        set((state) => {
          const node = state.document.nodes[nodeId]
          if (!node) return
          pushHistory(state)
          Object.assign(node, updates)
        }),

      moveNode: (nodeId, newParentId, index) =>
        set((state) => {
          const node = state.document.nodes[nodeId]
          if (!node || !node.parentId) return
          if (isAncestor(state.document, nodeId, newParentId)) return
          if (nodeId === newParentId) return

          pushHistory(state)

          const oldParent = state.document.nodes[node.parentId]
          if (oldParent) {
            oldParent.children = oldParent.children.filter((id) => id !== nodeId)
          }

          const newParent = state.document.nodes[newParentId]
          if (!newParent) return

          node.parentId = newParentId
          if (index !== undefined && index >= 0) {
            newParent.children.splice(index, 0, nodeId)
          } else {
            newParent.children.push(nodeId)
          }
        }),

      selectNode: (nodeId, append) =>
        set((state) => {
          if (nodeId === null) {
            state.selectedNodeIds = []
          } else if (append) {
            const idx = state.selectedNodeIds.indexOf(nodeId)
            if (idx >= 0) {
              state.selectedNodeIds.splice(idx, 1)
            } else {
              state.selectedNodeIds.push(nodeId)
            }
          } else {
            state.selectedNodeIds = [nodeId]
          }
        }),

      hoverNode: (nodeId) =>
        set((state) => {
          state.hoveredNodeId = nodeId
        }),

      copySelected: () =>
        set((state) => {
          const nodes = state.selectedNodeIds
            .map((id) => state.document.nodes[id])
            .filter((n): n is PageNode => n !== undefined)
          state.clipboard = JSON.parse(JSON.stringify(nodes))
        }),

      pasteNodes: (targetParentId) =>
        set((state) => {
          if (!state.clipboard?.length) return
          const parent = state.document.nodes[targetParentId]
          if (!parent) return

          pushHistory(state)

          for (const original of state.clipboard) {
            const tree = collectNodeTree(
              { ...state.document, nodes: { ...state.document.nodes } },
              original.id,
            )

            const idMap = new Map<NodeId, NodeId>()
            for (const id of Object.keys(tree)) {
              idMap.set(id, generateId())
            }

            for (const [oldId, newId] of idMap) {
              const oldNode = tree[oldId]
              if (!oldNode) continue
              const newNode: PageNode = {
                ...JSON.parse(JSON.stringify(oldNode)),
                id: newId,
                parentId:
                  oldId === original.id
                    ? targetParentId
                    : (idMap.get(oldNode.parentId!) ?? targetParentId),
                children: oldNode.children.map((cid) => idMap.get(cid) ?? cid),
              }
              state.document.nodes[newId] = newNode
            }

            const newRootId = idMap.get(original.id)
            if (newRootId) {
              parent.children.push(newRootId)
            }
          }
        }),

      undo: () =>
        set((state) => {
          const prev = state.undoStack.pop()
          if (!prev) return
          state.redoStack.push(JSON.parse(JSON.stringify(state.document)))
          state.document = prev
        }),

      redo: () =>
        set((state) => {
          const next = state.redoStack.pop()
          if (!next) return
          state.undoStack.push(JSON.parse(JSON.stringify(state.document)))
          state.document = next
        }),
    })),
  )
