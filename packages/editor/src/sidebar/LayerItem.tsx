import React from 'react'
import { useEditor } from '../editor/EditorProvider'
import { ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock, Box } from 'lucide-react'
import { Draggable } from '../dnd/Draggable'
import { Droppable } from '../dnd/Droppable'

interface LayerItemProps {
  nodeId: string
  depth: number
}

export const LayerItem: React.FC<LayerItemProps> = ({ nodeId, depth }) => {
  const { document, selectedNodeIds, actions } = useEditor()
  const [expanded, setExpanded] = React.useState(true)

  const node = document.nodes[nodeId]
  if (!node) return null

  const isSelected = selectedNodeIds.includes(nodeId)
  const hasChildren = node.children.length > 0

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    actions.selectNode(nodeId, e.metaKey || e.ctrlKey)
  }

  const handleToggleHidden = (e: React.MouseEvent) => {
    e.stopPropagation()
    actions.updateNode(nodeId, { hidden: !node.hidden })
  }

  const handleToggleLocked = (e: React.MouseEvent) => {
    e.stopPropagation()
    actions.updateNode(nodeId, { locked: !node.locked })
  }

  return (
    <div>
      <Draggable id={`layer-${nodeId}`} data={{ type: 'layer-item', nodeId }}>
        <Droppable id={`layer-drop-${nodeId}`} data={{ type: 'layer-item', nodeId }}>
          <div
            onClick={handleSelect}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px',
              paddingLeft: depth * 16 + 8,
              backgroundColor: isSelected ? '#3b82f6' : 'transparent',
              color: isSelected ? 'white' : '#d1d5db',
              cursor: 'pointer',
              fontSize: 13,
              borderBottom: '1px solid #2d2d3b',
            }}
          >
            <div
              onClick={handleToggleExpand}
              style={{
                marginRight: 4,
                opacity: hasChildren ? 1 : 0,
                cursor: hasChildren ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>

            <Box size={14} style={{ marginRight: 8, opacity: 0.7 }} />

            <span
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {node.displayName || node.type}
            </span>

            <div
              style={{
                display: 'flex',
                gap: 4,
                opacity: isSelected || node.hidden || node.locked ? 1 : 0.3,
              }}
            >
              <div onClick={handleToggleHidden}>
                {node.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </div>
              <div onClick={handleToggleLocked}>
                {node.locked ? <Lock size={14} /> : <Unlock size={14} />}
              </div>
            </div>
          </div>
        </Droppable>
      </Draggable>

      {expanded && hasChildren && (
        <div>
          {node.children.map((childId) => (
            <LayerItem key={childId} nodeId={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
