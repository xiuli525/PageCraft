import React, { createContext, useContext, useMemo, useCallback, useSyncExternalStore } from 'react'
import { createDocumentStore } from '@pageforge/core'
import type {
  EditorState,
  EditorActions,
  EditorContextValue,
  EditorConfig,
  NodeId,
  EditorMode,
  EditorViewport,
  PanelState,
  PageNode,
  ComponentDefinition,
  ComponentRendererMap,
} from '../types'

interface UIState {
  mode: EditorMode
  viewport: EditorViewport
  zoom: number
  panels: PanelState
}

const EditorContext = createContext<EditorContextValue | null>(null)

export const EditorProvider: React.FC<{
  config: EditorConfig
  children: React.ReactNode
}> = ({ config, children }) => {
  const store = useMemo(() => createDocumentStore(config.initialDocument), [config.initialDocument])

  const componentMap = useMemo(() => {
    return config.componentDefinitions.reduce(
      (acc: Record<string, ComponentDefinition>, def: ComponentDefinition) => {
        acc[def.type] = def
        return acc
      },
      {},
    )
  }, [config.componentDefinitions])

  const componentRenderers: ComponentRendererMap = useMemo(
    () => config.componentRenderers ?? new Map(),
    [config.componentRenderers],
  )

  const [uiState, setUIState] = React.useState<UIState>({
    mode: 'design',
    viewport: 'desktop',
    zoom: 1,
    panels: {
      isLeftCollapsed: false,
      isRightCollapsed: false,
    },
  })

  const subscribe = useCallback((callback: () => void) => store.subscribe(callback), [store])

  const getSnapshot = useCallback(() => store.getState(), [store])

  const docState = useSyncExternalStore(subscribe, getSnapshot)

  const actions: EditorActions = useMemo(
    () => ({
      selectNode: (nodeId: NodeId | null, append?: boolean) => {
        store.getState().selectNode(nodeId, append)
      },
      hoverNode: (nodeId: NodeId | null) => {
        store.getState().hoverNode(nodeId)
      },
      setMode: (mode: EditorMode) => {
        setUIState((prev) => ({ ...prev, mode }))
      },
      setViewport: (viewport: EditorViewport) => {
        setUIState((prev) => ({ ...prev, viewport }))
      },
      setZoom: (zoom: number) => {
        setUIState((prev) => ({ ...prev, zoom }))
      },
      togglePanel: (panel: keyof PanelState) => {
        setUIState((prev) => ({
          ...prev,
          panels: { ...prev.panels, [panel]: !prev.panels[panel] },
        }))
      },
      updateNode: (nodeId: NodeId, updates: Partial<PageNode>) => {
        store.getState().updateNode(nodeId, updates)
        const newDoc = store.getState().document
        config.onChange?.(newDoc)
      },
      addNode: (node: PageNode, parentId: NodeId, index?: number) => {
        store.getState().addNode(parentId, node, index)
        const newDoc = store.getState().document
        config.onChange?.(newDoc)
      },
      removeNode: (nodeId: NodeId) => {
        store.getState().removeNode(nodeId)
        const newDoc = store.getState().document
        config.onChange?.(newDoc)
      },
      moveNode: (nodeId: NodeId, targetParentId: NodeId, index: number) => {
        store.getState().moveNode(nodeId, targetParentId, index)
        const newDoc = store.getState().document
        config.onChange?.(newDoc)
      },
      undo: () => {
        store.getState().undo()
        const newDoc = store.getState().document
        config.onChange?.(newDoc)
      },
      redo: () => {
        store.getState().redo()
        const newDoc = store.getState().document
        config.onChange?.(newDoc)
      },
      save: () => {
        const doc = store.getState().document
        config.onSave?.(doc)
      },
      copySelected: () => {
        store.getState().copySelected()
      },
      pasteNodes: (targetParentId: NodeId) => {
        store.getState().pasteNodes(targetParentId)
        const newDoc = store.getState().document
        config.onChange?.(newDoc)
      },
    }),
    [store, config],
  )

  const editorState: EditorState = useMemo(
    () => ({
      document: docState.document,
      selectedNodeIds: docState.selectedNodeIds,
      hoveredNodeId: docState.hoveredNodeId,
      mode: uiState.mode,
      viewport: uiState.viewport,
      zoom: uiState.zoom,
      panels: uiState.panels,
      componentMap,
      componentRenderers,
      canUndo: docState.undoStack.length > 0,
      canRedo: docState.redoStack.length > 0,
    }),
    [docState, uiState, componentMap, componentRenderers],
  )

  const contextValue: EditorContextValue = useMemo(
    () => ({ ...editorState, actions }),
    [editorState, actions],
  )

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>
}

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}
