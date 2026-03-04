import type { PluginDefinition } from './types.js'

export function definePlugin<TConfig = Record<string, unknown>>(
  definition: PluginDefinition<TConfig>,
): PluginDefinition<TConfig> {
  if (!definition.manifest?.id) {
    throw new Error('[PageForge SDK] Plugin manifest must have an "id" field')
  }
  if (!definition.manifest?.name) {
    throw new Error('[PageForge SDK] Plugin manifest must have a "name" field')
  }
  if (!definition.manifest?.version) {
    throw new Error('[PageForge SDK] Plugin manifest must have a "version" field')
  }
  if (typeof definition.activate !== 'function') {
    throw new Error(
      `[PageForge SDK] Plugin "${definition.manifest.id}" must have an activate() function`,
    )
  }
  return Object.freeze(definition)
}
