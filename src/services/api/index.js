/**
 * API服务统一入口
 */

export { userApi } from './user'
export { commonApi } from './common'
export { productApi } from './product'

// 统一导出所有API
export const api = {
  user: () => import('./user').then(m => m.userApi),
  common: () => import('./common').then(m => m.commonApi),
  product: () => import('./product').then(m => m.productApi)
}

// 创建API实例的工厂函数
export const createApiInstance = () => {
  return {
    async user() {
      const { userApi } = await import('./user')
      return userApi
    },

    async common() {
      const { commonApi } = await import('./common')
      return commonApi
    },

    async product() {
      const { productApi } = await import('./product')
      return productApi
    }
  }
}

// 默认API实例
export const apiInstance = createApiInstance()
