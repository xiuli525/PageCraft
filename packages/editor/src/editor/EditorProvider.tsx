import React, { createContext, useContext, useReducer, useCallback } from 'react'
import {
  EditorState,
  EditorActions,
  EditorContextValue,
  EditorConfig,
  PageDocument,
  NodeId,
  EditorMode,
  EditorViewport,
  PanelState,
  PageNode,
  ComponentDefinition,
} from '../types'

const initialState: Omit<EditorState, 'document' | 'componentMap'> = {
  selectedNodeIds: [],
  hoveredNodeId: null,
  mode: 'design',
  viewport: 'desktop',
  zoom: 1,
  panels: {
    isLeftCollapsed: false,
    isRightCollapsed: false,
  },
}

const EditorContext = createContext<EditorContextValue | null>(null)

type Action =
  | { type: 'SELECT_NODE'; nodeId: NodeId | null; append?: boolean }
  | { type: 'HOVER_NODE'; nodeId: NodeId | null }
  | { type: 'SET_MODE'; mode: EditorMode }
  | { type: 'SET_VIEWPORT'; viewport: EditorViewport }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'TOGGLE_PANEL'; panel: keyof PanelState }
  | { type: 'UPDATE_DOCUMENT'; document: PageDocument }

function editorReducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case 'SELECT_NODE':
      if (action.append && action.nodeId) {
        return {
          ...state,
          selectedNodeIds: state.selectedNodeIds.includes(action.nodeId)
            ? state.selectedNodeIds.filter((id) => id !== action.nodeId)
            : [...state.selectedNodeIds, action.nodeId],
        }
      }
      return {
        ...state,
        selectedNodeIds: action.nodeId ? [action.nodeId] : [],
      }
    case 'HOVER_NODE':
      return { ...state, hoveredNodeId: action.nodeId }
    case 'SET_MODE':
      return { ...state, mode: action.mode }
    case 'SET_VIEWPORT':
      return { ...state, viewport: action.viewport }
    case 'SET_ZOOM':
      return { ...state, zoom: action.zoom }
    case 'TOGGLE_PANEL':
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.panel]: !state.panels[action.panel],
        },
      }
    case 'UPDATE_DOCUMENT':
      return { ...state, document: action.document }
    default:
      return state
  }
}

export const EditorProvider: React.FC<{
  config: EditorConfig
  children: React.ReactNode
}> = ({ config, children }) => {
  const componentMap = React.useMemo(() => {
    return config.componentDefinitions.reduce(
      (acc: Record<string, ComponentDefinition>, def: ComponentDefinition) => {
        acc[def.type] = def
        return acc
      },
      {},
    )
  }, [config.componentDefinitions])

  const [state, dispatch] = useReducer(editorReducer, {
    ...initialState,
    document: config.initialDocument,
    componentMap,
  })

  const actions: EditorActions = {
    selectNode: useCallback(
      (nodeId: NodeId | null, append?: boolean) =>
        dispatch({ type: 'SELECT_NODE', nodeId, append }),
      [],
    ),
    hoverNode: useCallback((nodeId: NodeId | null) => dispatch({ type: 'HOVER_NODE', nodeId }), []),
    setMode: useCallback((mode: EditorMode) => dispatch({ type: 'SET_MODE', mode }), []),
    setViewport: useCallback(
      (viewport: EditorViewport) => dispatch({ type: 'SET_VIEWPORT', viewport }),
      [],
    ),
    setZoom: useCallback((zoom: number) => dispatch({ type: 'SET_ZOOM', zoom }), []),
    togglePanel: useCallback(
      (panel: keyof PanelState) => dispatch({ type: 'TOGGLE_PANEL', panel }),
      [],
    ),
    updateNode: useCallback(
      (nodeId: NodeId, updates: Partial<PageNode>) => {
        const newDoc = JSON.parse(JSON.stringify(state.document))
        if (newDoc.nodes[nodeId]) {
          Object.assign(newDoc.nodes[nodeId], updates)
          dispatch({ type: 'UPDATE_DOCUMENT', document: newDoc })
          config.onChange?.(newDoc)
        }
      },
      [state.document, config.onChange],
    ),
    addNode: useCallback(
      (node: PageNode, parentId: NodeId, index?: number) => {
        const newDoc = JSON.parse(JSON.stringify(state.document))
        newDoc.nodes[node.id] = node
        const parent = newDoc.nodes[parentId]
        if (parent) {
          if (typeof index === 'number') {
            parent.children.splice(index, 0, node.id)
          } else {
            parent.children.push(node.id)
          }
          dispatch({ type: 'UPDATE_DOCUMENT', document: newDoc })
          config.onChange?.(newDoc)
        }
      },
      [state.document, config.onChange],
    ),
    removeNode: useCallback(
      (nodeId: NodeId) => {
        const newDoc = JSON.parse(JSON.stringify(state.document))
        const parentId = newDoc.nodes[nodeId]?.parentId
        if (parentId && newDoc.nodes[parentId]) {
          newDoc.nodes[parentId].children = newDoc.nodes[parentId].children.filter(
            (id: string) => id !== nodeId,
          )
        }
        delete newDoc.nodes[nodeId]
        dispatch({ type: 'UPDATE_DOCUMENT', document: newDoc })
        config.onChange?.(newDoc)
      },
      [state.document, config.onChange],
    ),
    moveNode: useCallback(
      (nodeId: NodeId, targetParentId: NodeId, index: number) => {
        const newDoc = JSON.parse(JSON.stringify(state.document))
        const node = newDoc.nodes[nodeId]
        const oldParentId = node.parentId

        if (oldParentId && newDoc.nodes[oldParentId]) {
          newDoc.nodes[oldParentId].children = newDoc.nodes[oldParentId].children.filter(
            (id: string) => id !== nodeId,
          )
        }

        node.parentId = targetParentId
        const targetParent = newDoc.nodes[targetParentId]
        if (targetParent) {
          targetParent.children.splice(index, 0, nodeId)
        }

        dispatch({ type: 'UPDATE_DOCUMENT', document: newDoc })
        config.onChange?.(newDoc)
      },
      [state.document, config.onChange],
    ),
    undo: () => console.log('Undo not implemented'),
    redo: () => console.log('Redo not implemented'),
    save: () => console.log('Save triggered'),
  }

  return <EditorContext.Provider value={{ ...state, actions }}>{children}</EditorContext.Provider>
}

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}
