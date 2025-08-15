/**
 * 服务层统一入口
 */

// 导出HTTP请求实例
export { default as request, http, requestCanceler } from './request'

// 导出API服务
export * from './api'

// 导出Mock数据（开发环境使用）
export * from './mock'

// 服务配置
export const serviceConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  enableErrorReport: import.meta.env.VITE_ENABLE_ERROR_REPORT === 'true'
}

// 初始化服务
export const initializeServices = () => {
  console.log('服务层初始化完成', {
    baseURL: serviceConfig.baseURL,
    timeout: serviceConfig.timeout,
    enableMock: serviceConfig.enableMock
  })
}

// 服务健康检查
export const healthCheck = async () => {
  try {
    const { commonApi } = await import('./api/common')
    await commonApi.getConfig()
    return { status: 'healthy', timestamp: Date.now() }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: Date.now()
    }
  }
}
