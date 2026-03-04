import React from 'react'

interface DropIndicatorProps {
  style?: React.CSSProperties
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({ style }) => {
  return (
    <div
      style={{
        position: 'absolute',
        height: 2,
        backgroundColor: '#3b82f6', // blue-500
        pointerEvents: 'none',
        zIndex: 50,
        ...style,
      }}
    />
  )
}
