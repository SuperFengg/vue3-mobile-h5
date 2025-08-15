/**
 * Pinia Store 入口文件
 */

import { createPinia } from 'pinia'
import { createPersistedState } from './plugins/persist'

// 创建 Pinia 实例
export const pinia = createPinia()

// 注册持久化插件
pinia.use(createPersistedState({
  key: 'vue3-mobile-h5',
  storage: localStorage
}))

// 引入各个 Store 的 hook（供本模块内部使用）
import { useAppStore } from './app'
import { useUserStore } from './user'
import { useDataStore } from './data'
import { useCounterStore } from './counter'

// 对外导出 Store hooks
export { useAppStore, useUserStore, useDataStore, useCounterStore }

// 初始化所有 store
export const initializeStores = () => {
  const appStore = useAppStore()
  const userStore = useUserStore()

  // 初始化应用状态
  appStore.initializeApp()

  // 初始化用户状态
  userStore.initializeUser()

  console.log('所有 Store 初始化完成')
}

export default pinia
