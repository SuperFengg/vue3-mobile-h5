/**
 * 主题管理器
 */
import { ref, onMounted, onUnmounted } from 'vue'

// 主题配置
export const themes = {
  light: {
    name: 'light',
    displayName: '浅色主题',
    colors: {
      // 基础颜色
      primary: '#1989fa',
      success: '#07c160',
      warning: '#ff976a',
      danger: '#ee0a24',
      info: '#1989fa',

      // 文本颜色
      textPrimary: '#323233',
      textSecondary: '#646566',
      textTertiary: '#969799',
      textDisabled: '#c8c9cc',

      // 背景颜色
      background: '#f7f8fa',
      backgroundLight: '#fafafa',
      backgroundDark: '#f2f3f5',
      surface: '#ffffff',

      // 边框颜色
      border: '#ebedf0',
      borderLight: '#f2f3f5',
      borderDark: '#dcdee0',

      // 阴影颜色
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowLight: 'rgba(0, 0, 0, 0.05)',
      shadowDark: 'rgba(0, 0, 0, 0.15)'
    }
  },

  dark: {
    name: 'dark',
    displayName: '深色主题',
    colors: {
      // 基础颜色
      primary: '#1989fa',
      success: '#07c160',
      warning: '#ff976a',
      danger: '#ee0a24',
      info: '#1989fa',

      // 文本颜色
      textPrimary: '#f7f8fa',
      textSecondary: '#c8c9cc',
      textTertiary: '#969799',
      textDisabled: '#646566',

      // 背景颜色
      background: '#1a1a1a',
      backgroundLight: '#2a2a2a',
      backgroundDark: '#0f0f0f',
      surface: '#2a2a2a',

      // 边框颜色
      border: '#3a3a3a',
      borderLight: '#4a4a4a',
      borderDark: '#2a2a2a',

      // 阴影颜色
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowLight: 'rgba(0, 0, 0, 0.2)',
      shadowDark: 'rgba(0, 0, 0, 0.4)'
    }
  }
}

// 主题管理器类
class ThemeManager {
  constructor() {
    this.currentTheme = 'light'
    this.listeners = new Set()
    this.mediaQuery = null

    this.init()
  }

  // 初始化
  init() {
    // 从本地存储恢复主题
    const savedTheme = localStorage.getItem('app-theme')
    if (savedTheme && themes[savedTheme]) {
      this.currentTheme = savedTheme
    } else {
      // 检测系统主题偏好
      this.currentTheme = this.getSystemTheme()
    }

    // 应用主题
    this.applyTheme(this.currentTheme)

    // 监听系统主题变化
    this.watchSystemTheme()
  }

  // 获取系统主题
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }

  // 监听系统主题变化
  watchSystemTheme() {
    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.mediaQuery.addEventListener('change', (e) => {
        if (this.currentTheme === 'auto') {
          const systemTheme = e.matches ? 'dark' : 'light'
          this.applyTheme(systemTheme)
          this.notifyListeners(systemTheme)
        }
      })
    }
  }

  // 设置主题
  setTheme(themeName) {
    if (!themes[themeName] && themeName !== 'auto') {
      console.warn(`主题 "${themeName}" 不存在`)
      return
    }

    this.currentTheme = themeName

    // 保存到本地存储
    localStorage.setItem('app-theme', themeName)

    // 应用主题
    let actualTheme = themeName
    if (themeName === 'auto') {
      actualTheme = this.getSystemTheme()
    }

    this.applyTheme(actualTheme)
    this.notifyListeners(actualTheme)
  }

  // 应用主题
  applyTheme(themeName) {
    const theme = themes[themeName]
    if (!theme) return

    const root = document.documentElement

    // 设置主题类名
    root.className = root.className.replace(/theme-\w+/g, '')
    root.classList.add(`theme-${themeName}`)

    // 设置CSS变量
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${this.kebabCase(key)}`, value)
    })

    // 设置meta标签（用于状态栏颜色等）
    this.updateMetaThemeColor(theme.colors.primary)
  }

  // 更新meta主题颜色
  updateMetaThemeColor(color) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.name = 'theme-color'
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.content = color
  }

  // 获取当前主题
  getCurrentTheme() {
    return this.currentTheme
  }

  // 获取当前主题配置
  getCurrentThemeConfig() {
    const actualTheme = this.currentTheme === 'auto' ? this.getSystemTheme() : this.currentTheme
    return themes[actualTheme]
  }

  // 切换主题
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }

  // 添加主题变化监听器
  addListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // 通知监听器
  notifyListeners(theme) {
    this.listeners.forEach(callback => {
      try {
        callback(theme, themes[theme])
      } catch (error) {
        console.error('主题监听器执行错误:', error)
      }
    })
  }

  // 驼峰转短横线
  kebabCase(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase()
  }

  // 获取主题颜色
  getThemeColor(colorName, themeName = null) {
    const theme = themeName ? themes[themeName] : this.getCurrentThemeConfig()
    return theme?.colors[colorName]
  }

  // 销毁
  destroy() {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.watchSystemTheme)
    }
    this.listeners.clear()
  }
}

// 创建主题管理器实例
export const themeManager = new ThemeManager()

// Vue插件
export const ThemePlugin = {
  install(app) {
    app.config.globalProperties.$theme = themeManager
    app.provide('theme', themeManager)
  }
}

// Composition API
export const useTheme = () => {
  const currentTheme = ref(themeManager.getCurrentTheme())
  const currentThemeConfig = ref(themeManager.getCurrentThemeConfig())

  let unsubscribe = null

  onMounted(() => {
    unsubscribe = themeManager.addListener((theme, config) => {
      currentTheme.value = theme
      currentThemeConfig.value = config
    })
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  return {
    currentTheme,
    currentThemeConfig,
    setTheme: themeManager.setTheme.bind(themeManager),
    toggleTheme: themeManager.toggleTheme.bind(themeManager),
    getThemeColor: themeManager.getThemeColor.bind(themeManager),
    themes
  }
}

export default themeManager
