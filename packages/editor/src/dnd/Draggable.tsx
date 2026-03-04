import React from 'react'
import { useDraggable } from '@dnd-kit/core'

interface DraggableProps {
  id: string
  data?: Record<string, unknown>
  children: React.ReactNode
  disabled?: boolean
}

export const Draggable: React.FC<DraggableProps> = ({ id, data, children, disabled }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
    disabled,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        touchAction: 'none',
      }}
    >
      {children}
    </div>
  )
}
