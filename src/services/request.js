/**
 * HTTP请求封装
 */

import axios from 'axios'
import { handleNetworkError, handleApiError } from '@/utils/errorHandler'
import { useUserStore } from '@/stores'
import { toast } from '@/config/vant'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    // 添加请求ID用于追踪
    config.headers['X-Request-ID'] = Date.now() + Math.random().toString(36).substr(2)

    // 开发环境下打印请求信息
    if (import.meta.env.DEV) {
      console.log('API请求:', {
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data
      })
    }

    return config
  },
  (error) => {
    handleNetworkError(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data, config } = response

    // 开发环境下打印响应信息
    if (import.meta.env.DEV) {
      console.log('API响应:', {
        url: config.url,
        status: response.status,
        data
      })
    }

    // 统一的响应数据结构处理
    if (data && typeof data === 'object') {
      // 假设后端返回格式为 { code, message, data }
      if (data.code !== undefined) {
        if (data.code === 0 || data.code === 200) {
          return data.data !== undefined ? data.data : data
        } else {
          // 业务错误
          const error = new Error(data.message || '请求失败')
          error.code = data.code
          error.data = data
          error.config = config

          handleApiError(error)
          return Promise.reject(error)
        }
      }
    }

    return data
  },
  (error) => {
    const { response, config } = error

    // 处理HTTP状态码错误
    if (response) {
      const { status, data } = response

      switch (status) {
        case 401:
          // 未授权，清除token并跳转登录
          const userStore = useUserStore()
          userStore.logout()
          // 这里可以跳转到登录页
          break
        case 403:
          // 禁止访问
          break
        case 404:
          // 资源不存在
          break
        case 422:
          // 表单验证错误
          if (data && data.errors) {
            const firstError = Object.values(data.errors)[0]
            if (Array.isArray(firstError)) {
              toast.fail(firstError[0])
            }
          }
          break
        case 429:
          // 请求过于频繁
          toast.fail('请求过于频繁，请稍后重试')
          break
        case 500:
        case 502:
        case 503:
        case 504:
          // 服务器错误
          break
        default:
          break
      }

      // 创建标准化的错误对象
      const apiError = new Error(data?.message || error.message || '请求失败')
      apiError.status = status
      apiError.code = data?.code
      apiError.data = data
      apiError.config = config

      handleNetworkError(apiError, config)
      return Promise.reject(apiError)
    } else if (error.request) {
      // 网络错误
      handleNetworkError(error, config)
      return Promise.reject(error)
    } else {
      // 其他错误
      handleNetworkError(error, config)
      return Promise.reject(error)
    }
  }
)

// 请求方法封装
export const http = {
  get(url, params = {}, config = {}) {
    return request.get(url, { params, ...config })
  },

  post(url, data = {}, config = {}) {
    return request.post(url, data, config)
  },

  put(url, data = {}, config = {}) {
    return request.put(url, data, config)
  },

  patch(url, data = {}, config = {}) {
    return request.patch(url, data, config)
  },

  delete(url, config = {}) {
    return request.delete(url, config)
  },

  upload(url, formData, config = {}) {
    return request.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  },

  download(url, params = {}, config = {}) {
    return request.get(url, {
      params,
      responseType: 'blob',
      ...config
    })
  }
}

// 取消请求的工具
export class RequestCanceler {
  constructor() {
    this.pendingRequests = new Map()
  }

  // 添加请求
  addRequest(config) {
    const requestKey = this.getRequestKey(config)
    if (this.pendingRequests.has(requestKey)) {
      // 如果有相同的请求正在进行，取消之前的请求
      this.pendingRequests.get(requestKey).cancel('重复请求')
    }

    const cancelToken = axios.CancelToken.source()
    config.cancelToken = cancelToken.token
    this.pendingRequests.set(requestKey, cancelToken)
  }

  // 移除请求
  removeRequest(config) {
    const requestKey = this.getRequestKey(config)
    if (this.pendingRequests.has(requestKey)) {
      this.pendingRequests.delete(requestKey)
    }
  }

  // 取消所有请求
  cancelAllRequests() {
    this.pendingRequests.forEach((cancelToken) => {
      cancelToken.cancel('页面切换，取消请求')
    })
    this.pendingRequests.clear()
  }

  // 生成请求key
  getRequestKey(config) {
    return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`
  }
}

// 创建请求取消器实例
export const requestCanceler = new RequestCanceler()

// 添加请求取消功能到拦截器
request.interceptors.request.use(
  (config) => {
    requestCanceler.addRequest(config)
    return config
  }
)

request.interceptors.response.use(
  (response) => {
    requestCanceler.removeRequest(response.config)
    return response
  },
  (error) => {
    if (error.config) {
      requestCanceler.removeRequest(error.config)
    }
    return Promise.reject(error)
  }
)

export default request
