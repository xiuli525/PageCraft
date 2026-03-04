// Plugin manifest
export interface PluginManifest {
  id: string // reverse-DNS: "com.acme.my-plugin"
  name: string
  version: string // semver
  description: string
  author?: { name: string; email?: string; url?: string }
  permissions?: PluginPermission[]
  engines?: { pageforge: string } // semver range
  icon?: string
  main?: string
  ui?: string
  activateOn?: PluginActivationEvent[]
}

export type PluginPermission = 'read:canvas' | 'write:canvas' | 'network' | 'storage' | 'clipboard'

export type PluginActivationEvent = 'startup' | 'on-canvas-open' | `on-command:${string}`

// Plugin definition (what developers create)
export interface PluginDefinition<TConfig = Record<string, unknown>> {
  manifest: PluginManifest
  activate(ctx: PluginContext, config?: TConfig): void | Promise<void>
  deactivate?(): void | Promise<void>
}

// Disposable pattern (VSCode style)
export interface Disposable {
  dispose(): void
}

// Plugin context (what plugins receive)
export interface PluginContext {
  readonly pluginId: string
  readonly subscriptions: Disposable[]
  readonly canvas: CanvasAPI
  readonly commands: CommandRegistry
  readonly events: PluginEventBus
  readonly storage: PluginStorage
  readonly components: ComponentRegistry
  readonly ui: PluginUIAPI
}

// Canvas API
export interface CanvasAPI {
  getDocument(): PageDocumentSnapshot
  getNode(nodeId: string): PageNodeSnapshot | null
  getSelectedNodes(): string[]
  addNode(parentId: string, type: string, props?: Record<string, unknown>, index?: number): string
  updateNode(
    nodeId: string,
    updates: Partial<{
      props: Record<string, unknown>
      styles: Record<string, unknown>
    }>,
  ): void
  removeNode(nodeId: string): void
  moveNode(nodeId: string, newParentId: string, index?: number): void
  selectNode(nodeId: string): void
  deselectAll(): void
}

// Snapshots (readonly copies)
export interface PageDocumentSnapshot {
  version: number
  rootId: string
  nodes: Readonly<Record<string, PageNodeSnapshot>>
  meta: Readonly<{ title?: string; description?: string }>
}

export interface PageNodeSnapshot {
  readonly id: string
  readonly type: string
  readonly displayName?: string
  readonly props: Readonly<Record<string, unknown>>
  readonly children: readonly string[]
  readonly parentId: string | null
  readonly hidden?: boolean
  readonly locked?: boolean
}

// Command registry
export interface CommandRegistry {
  register(id: string, handler: (...args: unknown[]) => void | Promise<void>): Disposable
  execute(id: string, ...args: unknown[]): Promise<void>
}

// Plugin event bus
export interface PluginEventBus {
  on(event: string, handler: (...args: unknown[]) => void): Disposable
  emit(event: string, ...args: unknown[]): void
}

// Storage
export interface PluginStorage {
  get<T = unknown>(key: string): Promise<T | undefined>
  set(key: string, value: unknown): Promise<void>
  delete(key: string): Promise<void>
  keys(): Promise<string[]>
}

// Component registration
export interface ComponentRegistration {
  type: string
  displayName: string
  category?: string
  icon?: string
  defaultProps?: Record<string, unknown>
  propSchema?: Record<string, PropSchemaEntry>
  render: (props: Record<string, unknown>) => unknown // React element
  acceptsChildren?: boolean
}

export type PropSchemaEntry =
  | { type: 'text' | 'number' | 'boolean' | 'color' | 'url' | 'image' }
  | { type: 'select'; options: Array<{ label: string; value: unknown }> }

export interface ComponentRegistry {
  register(component: ComponentRegistration): Disposable
  unregister(type: string): void
}

// Plugin UI
export interface PluginUIAPI {
  showPanel(options: { title: string; width?: number; html?: string }): Disposable
  showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void
}
