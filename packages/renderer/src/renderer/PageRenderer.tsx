import * as React from 'react'
import type { PageRendererProps, BreakpointConfig, DesignTokens } from '../types'
import { StyleProvider } from './StyleProvider'
import { NodeRenderer } from './NodeRenderer'

interface PageRendererWithProviderProps extends PageRendererProps {
  viewportWidth?: number
  breakpointConfig?: BreakpointConfig
  designTokens?: DesignTokens
}

export function PageRenderer({
  document,
  componentRegistry,
  selectedNodeId,
  hoveredNodeId,
  onNodeClick,
  onNodeHover,
  isEditing = false,
  viewportWidth,
  breakpointConfig,
  designTokens,
}: PageRendererWithProviderProps): React.ReactElement {
  return (
    <StyleProvider
      viewportWidth={viewportWidth}
      breakpointConfig={breakpointConfig}
      designTokens={designTokens}
    >
      <NodeRenderer
        nodeId={document.rootId}
        document={document}
        componentRegistry={componentRegistry}
        selectedNodeId={selectedNodeId}
        hoveredNodeId={hoveredNodeId}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        isEditing={isEditing}
      />
    </StyleProvider>
  )
}
