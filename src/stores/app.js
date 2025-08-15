import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // 应用状态
  const loading = ref(false)
  const theme = ref('light')
  const language = ref('zh-CN')
  const networkStatus = ref('online')

  // 设备信息
  const deviceInfo = ref({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isWeChat: false,
    screenWidth: 0,
    screenHeight: 0,
    pixelRatio: 1
  })

  // 应用配置
  const appConfig = ref({
    title: 'Vue3 Mobile H5 App',
    version: '1.0.0',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
    enableDebug: import.meta.env.DEV
  })

  // 计算属性
  const isDarkMode = computed(() => theme.value === 'dark')
  const isOnline = computed(() => networkStatus.value === 'online')
  const isMobileDevice = computed(() => deviceInfo.value.isMobile)

  // Actions
  const setLoading = (status) => {
    loading.value = status
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
    // 更新HTML根元素的主题类
    document.documentElement.setAttribute('data-theme', newTheme)
    // 持久化存储
    localStorage.setItem('app-theme', newTheme)
  }

  const setLanguage = (newLanguage) => {
    language.value = newLanguage
    // 持久化存储
    localStorage.setItem('app-language', newLanguage)
  }

  const setNetworkStatus = (status) => {
    networkStatus.value = status
  }

  const updateDeviceInfo = (info) => {
    deviceInfo.value = { ...deviceInfo.value, ...info }
  }

  const initializeApp = () => {
    // 从本地存储恢复设置
    const savedTheme = localStorage.getItem('app-theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }

    const savedLanguage = localStorage.getItem('app-language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // 检测设备信息
    const userAgent = navigator.userAgent
    updateDeviceInfo({
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/.test(userAgent),
      isWeChat: /MicroMessenger/i.test(userAgent),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1
    })

    // 监听网络状态
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline')
    }

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
    updateNetworkStatus()

    // 监听窗口大小变化
    const updateScreenSize = () => {
      updateDeviceInfo({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      })
    }

    window.addEventListener('resize', updateScreenSize)
  }

  return {
    // State
    loading,
    theme,
    language,
    networkStatus,
    deviceInfo,
    appConfig,

    // Getters
    isDarkMode,
    isOnline,
    isMobileDevice,

    // Actions
    setLoading,
    setTheme,
    setLanguage,
    setNetworkStatus,
    updateDeviceInfo,
    initializeApp
  }
}, {
  persist: {
    key: 'app-store',
    storage: localStorage,
    paths: ['theme', 'language']
  }
})
