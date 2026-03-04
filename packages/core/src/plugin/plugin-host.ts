import type { ComponentType } from 'react'
import type { ComponentDefinition } from '../schema/types'
import type { PluginDefinition, PluginContext, PluginStatus, PluginInfo } from './types'

const DEACTIVATION_TIMEOUT = 5000

interface PluginEntry {
  definition: PluginDefinition
  status: PluginStatus
  error?: Error
  disposables: Array<() => void>
  registeredComponents: Map<
    string,
    { definition: ComponentDefinition; render: ComponentType<Record<string, unknown>> }
  >
}

export class PluginHost {
  private plugins = new Map<string, PluginEntry>()
  private componentRegistry = new Map<
    string,
    { definition: ComponentDefinition; render: ComponentType<Record<string, unknown>> }
  >()

  register(definition: PluginDefinition): void {
    const { id } = definition.manifest
    if (this.plugins.has(id)) {
      throw new Error(`Plugin "${id}" is already registered`)
    }
    this.plugins.set(id, {
      definition,
      status: 'registered',
      disposables: [],
      registeredComponents: new Map(),
    })
  }

  async activate(pluginId: string): Promise<void> {
    const entry = this.plugins.get(pluginId)
    if (!entry) throw new Error(`Plugin "${pluginId}" is not registered`)
    if (entry.status === 'active') return

    entry.status = 'activating'

    const ctx: PluginContext = {
      pluginId,
      registerComponent: (definition, render) => {
        entry.registeredComponents.set(definition.type, { definition, render })
        this.componentRegistry.set(definition.type, { definition, render })
      },
      onDispose: (callback) => {
        entry.disposables.push(callback)
      },
    }

    try {
      await entry.definition.activate(ctx)
      entry.status = 'active'
    } catch (err) {
      entry.status = 'error'
      entry.error = err instanceof Error ? err : new Error(String(err))
      throw entry.error
    }
  }

  async deactivate(pluginId: string): Promise<void> {
    const entry = this.plugins.get(pluginId)
    if (!entry) throw new Error(`Plugin "${pluginId}" is not registered`)
    if (entry.status !== 'active') return

    entry.status = 'deactivating'

    try {
      if (entry.definition.deactivate) {
        await Promise.race([
          entry.definition.deactivate(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error(`Plugin "${pluginId}" deactivation timed out`)),
              DEACTIVATION_TIMEOUT,
            ),
          ),
        ])
      }

      for (const dispose of entry.disposables) {
        try {
          dispose()
        } catch {
          /* swallow disposal errors */
        }
      }
      entry.disposables = []

      for (const [type] of entry.registeredComponents) {
        this.componentRegistry.delete(type)
      }
      entry.registeredComponents.clear()

      entry.status = 'inactive'
    } catch (err) {
      entry.status = 'error'
      entry.error = err instanceof Error ? err : new Error(String(err))
    }
  }

  unregister(pluginId: string): void {
    const entry = this.plugins.get(pluginId)
    if (!entry) return
    if (entry.status === 'active') {
      this.deactivate(pluginId).catch(() => {})
    }
    this.plugins.delete(pluginId)
  }

  getPluginInfo(pluginId: string): PluginInfo | undefined {
    const entry = this.plugins.get(pluginId)
    if (!entry) return undefined
    return {
      manifest: entry.definition.manifest,
      status: entry.status,
      error: entry.error,
    }
  }

  getAllPlugins(): PluginInfo[] {
    return Array.from(this.plugins.values()).map((entry) => ({
      manifest: entry.definition.manifest,
      status: entry.status,
      error: entry.error,
    }))
  }

  getComponentRegistry(): Map<
    string,
    { definition: ComponentDefinition; render: ComponentType<Record<string, unknown>> }
  > {
    return new Map(this.componentRegistry)
  }

  async activateAll(): Promise<void> {
    const startupPlugins = Array.from(this.plugins.entries()).filter(
      ([, entry]) =>
        entry.status === 'registered' &&
        (!entry.definition.manifest.activateOn ||
          entry.definition.manifest.activateOn.includes('startup')),
    )
    await Promise.allSettled(startupPlugins.map(([id]) => this.activate(id)))
  }

  async deactivateAll(): Promise<void> {
    const activePlugins = Array.from(this.plugins.entries()).filter(
      ([, entry]) => entry.status === 'active',
    )
    await Promise.allSettled(activePlugins.map(([id]) => this.deactivate(id)))
  }
}
