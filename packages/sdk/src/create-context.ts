import type {
  PluginDefinition,
  PluginContext,
  Disposable,
  CanvasAPI,
  CommandRegistry,
  PluginEventBus,
  PluginStorage,
  ComponentRegistry,
  ComponentRegistration,
  PluginUIAPI,
  PageDocumentSnapshot,
  PageNodeSnapshot,
} from './types.js'

interface LoadedPlugin {
  definition: PluginDefinition
  status: 'registered' | 'active' | 'inactive'
  context: PluginContext | null
}

function createDisposable(fn: () => void): Disposable {
  return { dispose: fn }
}

function createNotConnectedCanvasAPI(): CanvasAPI {
  const notConnected = (): never => {
    throw new Error('[PageForge SDK] Canvas API is not connected to a host')
  }
  return {
    getDocument: notConnected,
    getNode: notConnected,
    getSelectedNodes: notConnected,
    addNode: notConnected,
    updateNode: notConnected,
    removeNode: notConnected,
    moveNode: notConnected,
    selectNode: notConnected,
    deselectAll: notConnected,
  }
}

function createInMemoryStorage(): PluginStorage {
  const store = new Map<string, unknown>()
  return {
    get: async <T = unknown>(key: string): Promise<T | undefined> => {
      return store.get(key) as T | undefined
    },
    set: async (key: string, value: unknown): Promise<void> => {
      store.set(key, value)
    },
    delete: async (key: string): Promise<void> => {
      store.delete(key)
    },
    keys: async (): Promise<string[]> => {
      return Array.from(store.keys())
    },
  }
}

function createCommandRegistry(): CommandRegistry {
  const handlers = new Map<string, (...args: unknown[]) => void | Promise<void>>()
  return {
    register(id: string, handler: (...args: unknown[]) => void | Promise<void>): Disposable {
      handlers.set(id, handler)
      return createDisposable(() => handlers.delete(id))
    },
    async execute(id: string, ...args: unknown[]): Promise<void> {
      const handler = handlers.get(id)
      if (!handler) {
        throw new Error(`[PageForge SDK] Command "${id}" is not registered`)
      }
      await handler(...args)
    },
  }
}

function createEventBus(): PluginEventBus {
  const listeners = new Map<string, Set<(...args: unknown[]) => void>>()
  return {
    on(event: string, handler: (...args: unknown[]) => void): Disposable {
      if (!listeners.has(event)) {
        listeners.set(event, new Set())
      }
      listeners.get(event)!.add(handler)
      return createDisposable(() => listeners.get(event)?.delete(handler))
    },
    emit(event: string, ...args: unknown[]): void {
      listeners.get(event)?.forEach((handler) => handler(...args))
    },
  }
}

function createComponentRegistry(): ComponentRegistry & {
  getAll(): ComponentRegistration[]
} {
  const registry = new Map<string, ComponentRegistration>()
  return {
    register(component: ComponentRegistration): Disposable {
      registry.set(component.type, component)
      return createDisposable(() => registry.delete(component.type))
    },
    unregister(type: string): void {
      registry.delete(type)
    },
    getAll(): ComponentRegistration[] {
      return Array.from(registry.values())
    },
  }
}

function createUIAPI(pluginId: string): PluginUIAPI {
  return {
    showPanel(options: { title: string; width?: number; html?: string }): Disposable {
      console.log(`[PageForge SDK][${pluginId}] Show panel: ${options.title}`)
      return createDisposable(() => {
        console.log(`[PageForge SDK][${pluginId}] Dispose panel: ${options.title}`)
      })
    },
    showNotification(
      message: string,
      type: 'info' | 'success' | 'warning' | 'error' = 'info',
    ): void {
      console.log(`[PageForge SDK][${pluginId}][${type}] ${message}`)
    },
  }
}

export function createContext(
  pluginId: string,
  canvasOverride?: CanvasAPI,
): PluginContext & { _componentRegistry: ReturnType<typeof createComponentRegistry> } {
  const subscriptions: Disposable[] = []
  const componentRegistry = createComponentRegistry()

  return {
    pluginId,
    subscriptions,
    canvas: canvasOverride ?? createNotConnectedCanvasAPI(),
    commands: createCommandRegistry(),
    events: createEventBus(),
    storage: createInMemoryStorage(),
    components: componentRegistry,
    ui: createUIAPI(pluginId),
    _componentRegistry: componentRegistry,
  }
}

export type { LoadedPlugin, PageDocumentSnapshot, PageNodeSnapshot }
