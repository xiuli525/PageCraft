import React from 'react'
import { useDroppable } from '@dnd-kit/core'

interface DroppableProps {
  id: string
  data?: Record<string, unknown>
  children: React.ReactNode
  disabled?: boolean
  style?: React.CSSProperties
}

export const Droppable: React.FC<DroppableProps> = ({ id, data, children, disabled, style }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data,
    disabled,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        outline: isOver ? '2px solid blue' : undefined,
      }}
    >
      {children}
    </div>
  )
}
