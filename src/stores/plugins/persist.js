/**
 * Pinia 状态持久化插件
 */

export function createPersistedState(options = {}) {
  const {
    storage = localStorage,
    key = 'pinia-state',
    paths = [],
    beforeRestore = null,
    afterRestore = null
  } = options

  return (context) => {
    const { store, options: storeOptions } = context

    // 如果store没有配置persist选项，则跳过
    if (!storeOptions.persist) {
      return
    }

    const persistOptions = typeof storeOptions.persist === 'boolean'
      ? {}
      : storeOptions.persist

    const {
      key: storeKey = `${key}-${store.$id}`,
      storage: storeStorage = storage,
      paths: storePaths = paths,
      beforeRestore: storeBeforeRestore = beforeRestore,
      afterRestore: storeAfterRestore = afterRestore
    } = persistOptions

    // 恢复状态
    const restoreState = () => {
      try {
        const savedState = storeStorage.getItem(storeKey)
        if (savedState) {
          const parsedState = JSON.parse(savedState)

          if (storeBeforeRestore) {
            storeBeforeRestore(parsedState, store)
          }

          if (storePaths.length > 0) {
            // 只恢复指定的路径
            storePaths.forEach(path => {
              if (parsedState[path] !== undefined) {
                store.$patch({ [path]: parsedState[path] })
              }
            })
          } else {
            // 恢复所有状态
            store.$patch(parsedState)
          }

          if (storeAfterRestore) {
            storeAfterRestore(parsedState, store)
          }
        }
      } catch (error) {
        console.error(`恢复状态失败 (${storeKey}):`, error)
      }
    }

    // 保存状态
    const saveState = () => {
      try {
        let stateToSave = store.$state

        if (storePaths.length > 0) {
          // 只保存指定的路径
          stateToSave = {}
          storePaths.forEach(path => {
            if (store.$state[path] !== undefined) {
              stateToSave[path] = store.$state[path]
            }
          })
        }

        storeStorage.setItem(storeKey, JSON.stringify(stateToSave))
      } catch (error) {
        console.error(`保存状态失败 (${storeKey}):`, error)
      }
    }

    // 初始化时恢复状态
    restoreState()

    // 监听状态变化并保存
    store.$subscribe((mutation, state) => {
      saveState()
    }, { detached: true })

    // 添加清除方法
    store.$clearPersistedState = () => {
      try {
        storeStorage.removeItem(storeKey)
      } catch (error) {
        console.error(`清除持久化状态失败 (${storeKey}):`, error)
      }
    }
  }
}

// 预设的存储适配器
export const storageAdapters = {
  localStorage: {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: (key) => localStorage.removeItem(key)
  },

  sessionStorage: {
    getItem: (key) => sessionStorage.getItem(key),
    setItem: (key, value) => sessionStorage.setItem(key, value),
    removeItem: (key) => sessionStorage.removeItem(key)
  },

  // 内存存储（用于测试或不支持本地存储的环境）
  memory: (() => {
    const store = new Map()
    return {
      getItem: (key) => store.get(key) || null,
      setItem: (key, value) => store.set(key, value),
      removeItem: (key) => store.delete(key)
    }
  })(),

  // 加密存储适配器
  encrypted: (secretKey) => {
    const encrypt = (text) => {
      // 简单的加密实现，实际项目中应使用更安全的加密算法
      return btoa(text)
    }

    const decrypt = (encryptedText) => {
      try {
        return atob(encryptedText)
      } catch {
        return null
      }
    }

    return {
      getItem: (key) => {
        const encrypted = localStorage.getItem(key)
        return encrypted ? decrypt(encrypted) : null
      },
      setItem: (key, value) => {
        const encrypted = encrypt(value)
        localStorage.setItem(key, encrypted)
      },
      removeItem: (key) => localStorage.removeItem(key)
    }
  }
}
