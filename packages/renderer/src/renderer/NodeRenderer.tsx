import * as React from 'react'
import type { NodeRendererProps, PageNode } from '../types'
import { useResponsiveStyles } from './use-responsive-styles'

function renderSlotContent(
  slotValue: string | string[],
  props: NodeRendererProps,
): React.ReactNode {
  if (Array.isArray(slotValue)) {
    return slotValue.map((childId) => <NodeRenderer key={childId} {...props} nodeId={childId} />)
  }
  return <NodeRenderer {...props} nodeId={slotValue} />
}

interface InnerProps {
  node: PageNode
  props: NodeRendererProps
  responsiveStyles: React.CSSProperties
}

function InnerNode({ node, props, responsiveStyles }: InnerProps): React.ReactElement | null {
  const Component = props.componentRegistry.get(node.type)

  if (!Component) {
    return (
      <div
        style={{
          border: '1px dashed #f87171',
          padding: '8px',
          color: '#f87171',
          fontSize: '12px',
        }}
      >
        Unknown component: {node.type}
      </div>
    )
  }

  const slotProps: Record<string, React.ReactNode> = {}
  for (const [slotKey, slotValue] of Object.entries(node.slots)) {
    slotProps[slotKey] = renderSlotContent(slotValue, props)
  }

  const renderedChildren =
    node.children.length > 0
      ? node.children.map((childId) => <NodeRenderer key={childId} {...props} nodeId={childId} />)
      : undefined

  const existingStyle = node.props['style'] as React.CSSProperties | undefined
  const componentProps: Record<string, unknown> = {
    ...node.props,
    ...slotProps,
    style: { ...responsiveStyles, ...existingStyle },
    ...(node.classNames && node.classNames.length > 0
      ? { className: node.classNames.join(' ') }
      : {}),
  }

  return <Component {...componentProps}>{renderedChildren}</Component>
}

export function NodeRenderer(props: NodeRendererProps): React.ReactElement | null {
  const { nodeId, document, selectedNodeId, hoveredNodeId, onNodeClick, onNodeHover, isEditing } =
    props

  const node: PageNode | undefined = document.nodes[nodeId]
  const responsiveStyles = useResponsiveStyles(node?.styles)

  if (!node || node.hidden === true) return null

  const rendered = <InnerNode node={node} props={props} responsiveStyles={responsiveStyles} />

  if (!isEditing) return rendered

  const isSelected = selectedNodeId === nodeId
  const isHovered = hoveredNodeId === nodeId
  const outlineColor = isSelected ? '#2563eb' : isHovered ? '#93c5fd' : 'transparent'

  return (
    <div
      style={{
        position: 'relative',
        outline: `2px solid ${outlineColor}`,
        outlineOffset: '-2px',
        transition: 'outline-color 0.1s ease',
        cursor: 'pointer',
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation()
        onNodeClick?.(nodeId)
      }}
      onMouseEnter={() => onNodeHover?.(nodeId)}
      onMouseLeave={() => onNodeHover?.(null)}
      data-node-id={nodeId}
    >
      {rendered}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: 0,
            background: '#2563eb',
            color: '#fff',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '2px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 9999,
          }}
        >
          {node.displayName ?? node.type}
        </div>
      )}
    </div>
  )
}
