import type {
  PluginDefinition,
  PluginContext,
  Disposable,
  CanvasAPI,
  ComponentRegistration,
} from './types.js'
import { createContext } from './create-context.js'

interface LoadedPlugin {
  definition: PluginDefinition
  status: 'registered' | 'active' | 'inactive'
  context: PluginContext | null
}

const DEACTIVATE_TIMEOUT_MS = 5000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms),
    ),
  ])
}

export class PluginLoader {
  private plugins = new Map<string, LoadedPlugin>()

  register(definition: PluginDefinition): void {
    const { id } = definition.manifest
    if (this.plugins.has(id)) {
      throw new Error(`[PageForge SDK] Plugin "${id}" is already registered`)
    }
    this.plugins.set(id, { definition, status: 'registered', context: null })
  }

  async activate(
    pluginId: string,
    config?: Record<string, unknown>,
    canvasOverride?: CanvasAPI,
  ): Promise<void> {
    const loaded = this.plugins.get(pluginId)
    if (!loaded) {
      throw new Error(`[PageForge SDK] Plugin "${pluginId}" is not registered`)
    }
    if (loaded.status === 'active') {
      return
    }

    const ctx = createContext(pluginId, canvasOverride)
    loaded.context = ctx
    loaded.status = 'active'

    await loaded.definition.activate(ctx, config)
  }

  async deactivate(pluginId: string): Promise<void> {
    const loaded = this.plugins.get(pluginId)
    if (!loaded || loaded.status !== 'active') {
      return
    }

    if (loaded.definition.deactivate) {
      try {
        await withTimeout(Promise.resolve(loaded.definition.deactivate()), DEACTIVATE_TIMEOUT_MS)
      } catch (err) {
        console.error(`[PageForge SDK] Plugin "${pluginId}" deactivate() failed:`, err)
      }
    }

    if (loaded.context) {
      for (const disposable of loaded.context.subscriptions) {
        try {
          disposable.dispose()
        } catch (err) {
          console.error(`[PageForge SDK] Error disposing subscription for "${pluginId}":`, err)
        }
      }
      loaded.context.subscriptions.length = 0
    }

    loaded.status = 'inactive'
    loaded.context = null
  }

  async deactivateAll(): Promise<void> {
    const activeIds = Array.from(this.plugins.entries())
      .filter(([, p]) => p.status === 'active')
      .map(([id]) => id)

    await Promise.all(activeIds.map((id) => this.deactivate(id)))
  }

  getPlugin(pluginId: string): LoadedPlugin | undefined {
    return this.plugins.get(pluginId)
  }

  getActivePlugins(): LoadedPlugin[] {
    return Array.from(this.plugins.values()).filter((p) => p.status === 'active')
  }

  getRegisteredComponents(): ComponentRegistration[] {
    const results: ComponentRegistration[] = []
    for (const loaded of this.plugins.values()) {
      if (loaded.status === 'active' && loaded.context) {
        const ctx = loaded.context as ReturnType<typeof createContext>
        if ('_componentRegistry' in ctx) {
          results.push(...ctx._componentRegistry.getAll())
        }
      }
    }
    return results
  }
}

export type { LoadedPlugin, Disposable }
