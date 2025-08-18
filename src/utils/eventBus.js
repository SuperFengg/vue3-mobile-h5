import { inject, getCurrentInstance, onBeforeUnmount } from 'vue'

const eventBusKey = Symbol('eventBus')

function createEventBus() {
  const eventNameToHandlers = new Map()

  function on(eventName, handler) {
    if (!eventNameToHandlers.has(eventName)) {
      eventNameToHandlers.set(eventName, new Set())
    }
    eventNameToHandlers.get(eventName).add(handler)
    return () => off(eventName, handler)
  }

  function once(eventName, handler) {
    const wrapped = (...args) => {
      try {
        handler(...args)
      } finally {
        off(eventName, wrapped)
      }
    }
    return on(eventName, wrapped)
  }

  function off(eventName, handler) {
    if (!eventNameToHandlers.has(eventName)) return
    if (!handler) {
      eventNameToHandlers.delete(eventName)
      return
    }
    const handlers = eventNameToHandlers.get(eventName)
    handlers.delete(handler)
    if (handlers.size === 0) {
      eventNameToHandlers.delete(eventName)
    }
  }

  function emit(eventName, ...args) {
    const handlers = eventNameToHandlers.get(eventName)
    if (!handlers || handlers.size === 0) return // 复制快照，避免回调里增删影响本次循环
    ;[...handlers].forEach(handler => {
      try {
        handler(...args)
      } catch (error) {
        // 避免事件回调未捕获错误导致应用崩溃
        // 如需统一处理，可在此接入全局错误上报
        console.error('[EventBus] handler error for event:', eventName, error)
      }
    })
  }

  function clear() {
    eventNameToHandlers.clear()
  }

  return { on, once, off, emit, clear }
}

// 单例事件总线
const eventBus = createEventBus()

// 插件：注入全局属性 $bus，并提供依赖注入
export const EventBusPlugin = {
  install(app) {
    app.config.globalProperties.$bus = eventBus
    app.provide(eventBusKey, eventBus)
  },
}

// 组合式 API：获取事件总线，并提供自动解绑的注册方法
export function useEventBus() {
  const injected = inject(eventBusKey, eventBus)
  const vm = getCurrentInstance()

  function onEvent(eventName, handler) {
    const offFn = injected.on(eventName, handler)
    if (vm) {
      onBeforeUnmount(() => offFn())
    }
    return offFn
  }

  function onceEvent(eventName, handler) {
    const offFn = injected.once(eventName, handler)
    if (vm) {
      onBeforeUnmount(() => offFn())
    }
    return offFn
  }

  return {
    ...injected,
    onEvent,
    onceEvent,
  }
}

export { eventBusKey, eventBus }
