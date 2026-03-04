import { DragEndEvent } from '@dnd-kit/core'
import { useEditor } from '../editor/EditorProvider'
import { PageNode } from '../types'

export const useCanvasDnd = () => {
  const { actions, componentMap } = useEditor()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    if (active.data.current?.type === 'palette-item') {
      const componentType = active.data.current.componentType as string
      const definition = componentMap[componentType]

      if (definition) {
        const newNode: PageNode = {
          id: `node-${Date.now()}`,
          type: componentType,
          props: definition.defaultProps || {},
          children: [],
          slots: {},
          parentId: over.id as string,
        }

        actions.addNode(newNode, over.id as string)
      }
    } else if (active.data.current?.type === 'canvas-node') {
      const nodeId = active.id as string
      const targetId = over.id as string

      if (nodeId !== targetId) {
        actions.moveNode(nodeId, targetId, 0)
      }
    }
  }

  return {
    onDragEnd: handleDragEnd,
  }
}
