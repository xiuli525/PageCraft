import type { ComponentType } from 'react'
import type { ComponentDefinition } from '../schema/types'

export interface PluginManifest {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  activateOn?: Array<'startup' | 'on-canvas-open' | `on-command:${string}`>
}

export interface PluginContext {
  pluginId: string
  registerComponent: (
    definition: ComponentDefinition,
    render: ComponentType<Record<string, unknown>>,
  ) => void
  onDispose: (callback: () => void) => void
}

export interface PluginDefinition {
  manifest: PluginManifest
  activate: (ctx: PluginContext) => void | Promise<void>
  deactivate?: () => void | Promise<void>
}

export type PluginStatus =
  | 'registered'
  | 'activating'
  | 'active'
  | 'deactivating'
  | 'inactive'
  | 'error'

export interface PluginInfo {
  manifest: PluginManifest
  status: PluginStatus
  error?: Error
}
