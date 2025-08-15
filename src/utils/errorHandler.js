/**
 * 全局错误处理器
 */

import { toast } from '@/config/vant'

// 错误类型枚举
export const ErrorTypes = {
  VUE_ERROR: 'vue_error',
  PROMISE_REJECTION: 'promise_rejection',
  RESOURCE_ERROR: 'resource_error',
  NETWORK_ERROR: 'network_error',
  API_ERROR: 'api_error',
  ROUTER_ERROR: 'router_error'
}

// 错误收集器
class ErrorCollector {
  constructor() {
    this.errors = []
    this.maxErrors = 100 // 最大错误数量
    this.reportUrl = import.meta.env.VITE_ERROR_REPORT_URL || ''
    this.enableReport = import.meta.env.VITE_ENABLE_ERROR_REPORT === 'true'
  }

  // 添加错误
  addError(error) {
    const errorInfo = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...error
    }

    this.errors.unshift(errorInfo)

    // 限制错误数量
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
    }

    // 上报错误
    if (this.enableReport) {
      this.reportError(errorInfo)
    }

    // 开发环境下打印错误
    if (import.meta.env.DEV) {
      console.error('错误收集:', errorInfo)
    }
  }

  // 上报错误
  async reportError(errorInfo) {
    if (!this.reportUrl) return

    try {
      await fetch(this.reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorInfo)
      })
    } catch (err) {
      console.error('错误上报失败:', err)
    }
  }

  // 获取错误列表
  getErrors() {
    return this.errors
  }

  // 清空错误
  clearErrors() {
    this.errors = []
  }
}

// 创建错误收集器实例
export const errorCollector = new ErrorCollector()

// Vue错误处理
export const handleVueError = (err, vm, info) => {
  const errorInfo = {
    type: ErrorTypes.VUE_ERROR,
    message: err.message,
    stack: formatStack(err),
    componentName: vm?.$options.name || vm?.$options.__name || 'Unknown',
    errorInfo: info,
    props: vm?.$props,
    route: vm?.$route?.path
  }

  errorCollector.addError(errorInfo)

  // 用户友好的错误提示
  if (!import.meta.env.DEV) {
    toast.fail('页面出现异常，请刷新重试')
  }
}

// Promise错误处理
export const handlePromiseRejection = (event) => {
  const errorInfo = {
    type: ErrorTypes.PROMISE_REJECTION,
    message: event.reason?.message || event.reason || 'Promise rejection',
    stack: formatStack(event.reason),
    reason: event.reason
  }

  errorCollector.addError(errorInfo)

  // 阻止默认的控制台错误输出
  event.preventDefault()

  // 用户友好的错误提示
  if (!import.meta.env.DEV) {
    toast.fail('操作失败，请重试')
  }
}

// 资源加载错误处理
export const handleResourceError = (event) => {
  const target = event?.target || event?.srcElement

  // 仅处理具有 src/href 的资源元素错误，避免将 JS 运行时错误误判为资源错误
  const resourceUrl = target?.src || target?.href
  const tagName = target?.tagName

  if (!resourceUrl || !tagName) {
    return
  }

  const errorInfo = {
    type: ErrorTypes.RESOURCE_ERROR,
    message: `Resource load error: ${resourceUrl}`,
    resourceType: tagName,
    resourceUrl,
    outerHTML: target?.outerHTML
  }

  errorCollector.addError(errorInfo)
}

// 网络错误处理
export const handleNetworkError = (error, config = {}) => {
  const errorInfo = {
    type: ErrorTypes.NETWORK_ERROR,
    message: error.message || 'Network error',
    status: error.response?.status,
    statusText: error.response?.statusText,
    url: config.url || error.config?.url,
    method: config.method || error.config?.method,
    data: config.data || error.config?.data,
    headers: config.headers || error.config?.headers
  }

  errorCollector.addError(errorInfo)

  // 根据错误类型显示不同提示
  if (error.code === 'NETWORK_ERROR') {
    toast.fail('网络连接失败，请检查网络')
  } else if (error.response?.status >= 500) {
    toast.fail('服务器异常，请稍后重试')
  } else if (error.response?.status === 401) {
    toast.fail('登录已过期，请重新登录')
  } else if (error.response?.status === 403) {
    toast.fail('没有权限访问')
  } else if (error.response?.status === 404) {
    toast.fail('请求的资源不存在')
  } else {
    toast.fail('请求失败，请重试')
  }
}

// API错误处理
export const handleApiError = (error, showToast = true) => {
  const errorInfo = {
    type: ErrorTypes.API_ERROR,
    message: error.message || 'API error',
    code: error.code,
    status: error.status,
    data: error.data,
    config: error.config
  }

  errorCollector.addError(errorInfo)

  if (showToast) {
    const message = error.message || '请求失败'
    toast.fail(message)
  }

  return errorInfo
}

// 路由错误处理
export const handleRouterError = (error) => {
  const errorInfo = {
    type: ErrorTypes.ROUTER_ERROR,
    message: error.message || 'Router error',
    stack: formatStack(error),
    to: error.to,
    from: error.from
  }

  errorCollector.addError(errorInfo)

  console.error('路由错误:', error)
}

// 设置全局错误处理
export const setupErrorHandler = (app) => {
  // Vue错误处理
  app.config.errorHandler = handleVueError

  // 未捕获的Promise错误
  window.addEventListener('unhandledrejection', handlePromiseRejection)

  // 资源加载错误
  window.addEventListener('error', handleResourceError, true)

  // 全局异常捕获
  window.onerror = (message, source, lineno, colno, error) => {
    const errorInfo = {
      type: 'javascript_error',
      message,
      source,
      lineno,
      colno,
      stack: formatStack(error)
    }

    errorCollector.addError(errorInfo)
  }

  console.log('全局错误处理器已设置')
}

// 手动报告错误
export const reportError = (error, context = {}) => {
  const errorInfo = {
    type: 'manual_error',
    message: error.message || error,
    stack: formatStack(error),
    context
  }

  errorCollector.addError(errorInfo)
}

// 错误边界组件辅助函数
export const createErrorBoundary = (fallbackComponent) => {
  return {
    name: 'ErrorBoundary',
    data() {
      return {
        hasError: false,
        error: null
      }
    },
    errorCaptured(err, vm, info) {
      this.hasError = true
      this.error = err

      handleVueError(err, vm, info)

      // 返回false阻止错误继续传播
      return false
    },
    render() {
      if (this.hasError) {
        return fallbackComponent ? h(fallbackComponent, { error: this.error }) : h('div', '页面出现错误')
      }
      return this.$slots.default()
    }
  }
}

export default {
  setupErrorHandler,
  handleVueError,
  handlePromiseRejection,
  handleResourceError,
  handleNetworkError,
  handleApiError,
  handleRouterError,
  reportError,
  createErrorBoundary,
  errorCollector,
  ErrorTypes
}

// 辅助：格式化堆栈，避免日志中一行显示不全
function formatStack(err) {
  const stack = err?.stack
  if (!stack) return undefined
  // 统一换行，去除多余空格
  return String(stack).replace(/\r\n|\r/g, '\n').trim()
}
