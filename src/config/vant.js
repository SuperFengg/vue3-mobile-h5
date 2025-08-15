/**
 * Vant 组件库配置
 */

import { Locale, ConfigProvider } from 'vant'

// 导入中文语言包
import zhCN from 'vant/es/locale/lang/zh-CN'

// 设置语言
Locale.use('zh-CN', zhCN)

// Toast 全局配置
import { showToast, showLoadingToast, showSuccessToast, showFailToast } from 'vant'

// 配置 Toast 默认选项
const toastDefaultOptions = {
  duration: 2000,
  forbidClick: true,
}

// 封装常用的 Toast 方法
export const toast = {
  // 普通提示
  show: (message, options = {}) => {
    return showToast({
      message,
      ...toastDefaultOptions,
      ...options,
    })
  },

  // 成功提示
  success: (message, options = {}) => {
    return showSuccessToast({
      message,
      ...toastDefaultOptions,
      ...options,
    })
  },

  // 失败提示
  fail: (message, options = {}) => {
    return showFailToast({
      message,
      ...toastDefaultOptions,
      ...options,
    })
  },

  // 加载提示
  loading: (message = '加载中...', options = {}) => {
    return showLoadingToast({
      message,
      forbidClick: true,
      duration: 0, // 不自动关闭
      ...options,
    })
  },
}

// Dialog 全局配置
import { showDialog, showConfirmDialog } from 'vant'

export const dialog = {
  // 确认对话框
  confirm: (options = {}) => {
    return showConfirmDialog({
      title: '提示',
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      ...options,
    })
  },

  // 普通对话框
  alert: (options = {}) => {
    return showDialog({
      title: '提示',
      confirmButtonText: '确定',
      ...options,
    })
  },
}

// Notify 全局配置
import { showNotify } from 'vant'

export const notify = {
  // 成功通知
  success: (message, options = {}) => {
    return showNotify({
      type: 'success',
      message,
      duration: 3000,
      ...options,
    })
  },

  // 警告通知
  warning: (message, options = {}) => {
    return showNotify({
      type: 'warning',
      message,
      duration: 3000,
      ...options,
    })
  },

  // 错误通知
  danger: (message, options = {}) => {
    return showNotify({
      type: 'danger',
      message,
      duration: 3000,
      ...options,
    })
  },

  // 普通通知
  primary: (message, options = {}) => {
    return showNotify({
      type: 'primary',
      message,
      duration: 3000,
      ...options,
    })
  },
}

// ImagePreview 全局配置
import { showImagePreview } from 'vant'

export const imagePreview = {
  show: (images, options = {}) => {
    return showImagePreview({
      images,
      closeable: true,
      ...options,
    })
  },
}

// 导出所有配置
export default {
  toast,
  dialog,
  notify,
  imagePreview,
}

// 可选：导出一个函数，按需在根组件包裹 ConfigProvider 以覆盖主题变量
export const installVantConfigProvider = (app) => {
  app.use(ConfigProvider)
}
