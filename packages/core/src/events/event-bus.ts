import mitt from 'mitt'
import type { PageForgeEvents } from '../schema/types'

export type EventHandler<T> = (data: T) => void

export function createEventBus() {
  const emitter = mitt<PageForgeEvents>()

  return {
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    emit: emitter.emit.bind(emitter),
    clear: emitter.all.clear.bind(emitter.all),
  }
}

export type EventBus = ReturnType<typeof createEventBus>
