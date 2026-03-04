import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useEditor } from '../editor/EditorProvider'

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export const SelectionOverlay: React.FC = () => {
  const { selectedNodeIds, zoom } = useEditor()
  const [overlays, setOverlays] = useState<Record<string, Rect>>({})

  useEffect(() => {
    if (selectedNodeIds.length === 0) {
      setOverlays({})
      return
    }

    const updateOverlays = () => {
      const newOverlays: Record<string, Rect> = {}
      selectedNodeIds.forEach((id) => {
        const element = document.querySelector(`[data-node-id="${id}"]`)
        if (element) {
          const rect = element.getBoundingClientRect()
          newOverlays[id] = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }
        }
      })
      setOverlays(newOverlays)
    }

    updateOverlays()
    window.addEventListener('resize', updateOverlays)
    window.addEventListener('scroll', updateOverlays, true)

    return () => {
      window.removeEventListener('resize', updateOverlays)
      window.removeEventListener('scroll', updateOverlays, true)
    }
  }, [selectedNodeIds, zoom])

  if (selectedNodeIds.length === 0) return null

  return createPortal(
    <>
      {Object.entries(overlays).map(([id, rect]) => (
        <div
          key={id}
          style={{
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            border: '2px solid #3b82f6',
            pointerEvents: 'none',
            zIndex: 100,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -4,
              left: -4,
              width: 8,
              height: 8,
              background: 'white',
              border: '1px solid #3b82f6',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 8,
              height: 8,
              background: 'white',
              border: '1px solid #3b82f6',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              left: -4,
              width: 8,
              height: 8,
              background: 'white',
              border: '1px solid #3b82f6',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 8,
              height: 8,
              background: 'white',
              border: '1px solid #3b82f6',
            }}
          />
        </div>
      ))}
    </>,
    document.body,
  )
}
