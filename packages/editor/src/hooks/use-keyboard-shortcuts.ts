import { useEffect } from 'react'
import { useEditor } from '../editor/EditorProvider'

export function useKeyboardShortcuts() {
  const { actions, selectedNodeIds, document, canUndo, canRedo } = useEditor()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }

      const isMod = e.metaKey || e.ctrlKey

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeIds.length > 0) {
          e.preventDefault()
          selectedNodeIds.forEach((id) => actions.removeNode(id))
        }
        return
      }

      if (isMod && e.key === 'z' && !e.shiftKey) {
        if (canUndo) {
          e.preventDefault()
          actions.undo()
        }
        return
      }

      if (isMod && e.key === 'z' && e.shiftKey) {
        if (canRedo) {
          e.preventDefault()
          actions.redo()
        }
        return
      }

      if (isMod && e.key === 'y') {
        if (canRedo) {
          e.preventDefault()
          actions.redo()
        }
        return
      }

      if (isMod && e.key === 'c') {
        if (selectedNodeIds.length > 0) {
          e.preventDefault()
          actions.copySelected()
        }
        return
      }

      if (isMod && e.key === 'v') {
        e.preventDefault()
        const firstSelected = selectedNodeIds[0]
        const targetParent = firstSelected
          ? (document.nodes[firstSelected]?.parentId ?? document.rootId)
          : document.rootId
        actions.pasteNodes(targetParent)
        return
      }

      if (e.key === 'Escape') {
        actions.selectNode(null)
        return
      }

      if (isMod && e.key === 'a') {
        e.preventDefault()
        const allIds = Object.keys(document.nodes).filter((id) => id !== document.rootId)
        if (allIds.length > 0 && allIds[0] !== undefined) {
          actions.selectNode(allIds[0])
          allIds.slice(1).forEach((id) => actions.selectNode(id, true))
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [actions, selectedNodeIds, document, canUndo, canRedo])
}
