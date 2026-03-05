import React from 'react'
import { useEditor } from '../editor/EditorProvider'
import { Draggable } from '../dnd/Draggable'
import { Droppable } from '../dnd/Droppable'

interface CanvasNodeProps {
  nodeId: string
}

export const CanvasNode: React.FC<CanvasNodeProps> = ({ nodeId }) => {
  const { document, selectedNodeIds, hoveredNodeId, actions, componentMap, componentRenderers } =
    useEditor()
  const node = document.nodes[nodeId]

  if (!node || node.hidden) return null

  const isSelected = selectedNodeIds.includes(nodeId)
  const isHovered = hoveredNodeId === nodeId
  const isRoot = nodeId === document.rootId
  const definition = componentMap[node.type]
  const acceptsChildren =
    definition?.acceptsChildren === true || Array.isArray(definition?.acceptsChildren)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    actions.selectNode(nodeId, e.metaKey || e.ctrlKey)
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation()
    actions.hoverNode(nodeId)
  }

  const handleMouseLeave = () => {
    actions.hoverNode(null)
  }

  const childElements = node.children.map((childId: string) => (
    <CanvasNode key={childId} nodeId={childId} />
  ))

  const Component = componentRenderers.get(node.type)

  let renderedContent: React.ReactNode

  if (isRoot) {
    renderedContent = (
      <div data-node-id={nodeId} style={{ minHeight: '100%' }}>
        {childElements}
      </div>
    )
  } else if (Component) {
    const componentProps = { ...node.props }

    if (acceptsChildren) {
      renderedContent = (
        <div
          data-node-id={nodeId}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            outline: isHovered && !isSelected ? '1px dashed #3b82f6' : undefined,
            position: 'relative',
            minHeight: node.children.length === 0 ? 40 : undefined,
          }}
        >
          <Component {...componentProps}>
            {childElements.length > 0 ? (
              childElements
            ) : (
              <div
                style={{
                  padding: 16,
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: 13,
                  border: '1px dashed #d1d5db',
                  borderRadius: 4,
                  margin: 4,
                }}
              >
                Drop components here
              </div>
            )}
          </Component>
        </div>
      )
    } else {
      renderedContent = (
        <div
          data-node-id={nodeId}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            outline: isHovered && !isSelected ? '1px dashed #3b82f6' : undefined,
            position: 'relative',
          }}
        >
          <Component {...componentProps} />
        </div>
      )
    }
  } else {
    renderedContent = (
      <div
        data-node-id={nodeId}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          outline: isHovered && !isSelected ? '1px dashed #3b82f6' : undefined,
          position: 'relative',
          padding: 8,
          minHeight: 20,
        }}
      >
        {childElements.length > 0 ? childElements : `[${node.type}]`}
      </div>
    )
  }

  if (isRoot) {
    return (
      <Droppable id={nodeId} data={{ type: 'canvas-node', node }}>
        {renderedContent}
      </Droppable>
    )
  }

  let wrapped = renderedContent

  if (acceptsChildren) {
    wrapped = (
      <Droppable id={nodeId} data={{ type: 'canvas-node', node }}>
        {wrapped}
      </Droppable>
    )
  }

  wrapped = (
    <Draggable id={nodeId} data={{ type: 'canvas-node', node }}>
      {wrapped}
    </Draggable>
  )

  return wrapped
}
