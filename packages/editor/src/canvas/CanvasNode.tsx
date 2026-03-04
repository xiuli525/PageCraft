import React from 'react'
import { useEditor } from '../editor/EditorProvider'
import { Draggable } from '../dnd/Draggable'
import { Droppable } from '../dnd/Droppable'

interface CanvasNodeProps {
  nodeId: string
}

export const CanvasNode: React.FC<CanvasNodeProps> = ({ nodeId }) => {
  const { document, selectedNodeIds, hoveredNodeId, actions } = useEditor()
  const node = document.nodes[nodeId]

  if (!node) return null

  const isSelected = selectedNodeIds.includes(nodeId)
  const isHovered = hoveredNodeId === nodeId

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

  const children = node.children.map((childId: string) => (
    <CanvasNode key={childId} nodeId={childId} />
  ))

  const isRoot = nodeId === document.rootId

  const content = (
    <div
      data-node-id={nodeId}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...(node.props.style as React.CSSProperties),
        outline: isHovered && !isSelected ? '1px dashed #3b82f6' : undefined,
        minHeight: node.children.length === 0 && !isRoot ? 20 : undefined,
        padding: node.children.length === 0 && !isRoot ? 10 : undefined,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {node.type === 'text' ? (node.props.content as string) : children}
    </div>
  )

  let wrapped = (
    <Droppable id={nodeId} data={{ type: 'canvas-node', node }}>
      {content}
    </Droppable>
  )

  if (!isRoot) {
    wrapped = (
      <Draggable id={nodeId} data={{ type: 'canvas-node', node }}>
        {wrapped}
      </Draggable>
    )
  }

  return wrapped
}
