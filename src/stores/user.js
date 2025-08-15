import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref(null)
  const token = ref('')
  const permissions = ref([])
  const preferences = ref({
    notification: true,
    autoUpdate: false,
    language: 'zh-CN',
    theme: 'light'
  })

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)
  const userName = computed(() => userInfo.value?.name || '未登录')
  const userAvatar = computed(() => userInfo.value?.avatar || '')
  const hasPermission = computed(() => (permission) => {
    return permissions.value.includes(permission)
  })

  // Actions
  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const setToken = (newToken) => {
    token.value = newToken
    // 持久化存储
    if (newToken) {
      localStorage.setItem('user-token', newToken)
    } else {
      localStorage.removeItem('user-token')
    }
  }

  const setPermissions = (newPermissions) => {
    permissions.value = newPermissions
  }

  const updatePreferences = (newPreferences) => {
    preferences.value = { ...preferences.value, ...newPreferences }
    // 持久化存储
    localStorage.setItem('user-preferences', JSON.stringify(preferences.value))
  }

  const login = async (credentials) => {
    try {
      // 模拟登录API调用
      const response = await mockLogin(credentials)

      setToken(response.token)
      setUserInfo(response.userInfo)
      setPermissions(response.permissions || [])

      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setToken('')
    setUserInfo(null)
    setPermissions([])

    // 清除其他相关存储
    localStorage.removeItem('user-token')
    localStorage.removeItem('user-info')
  }

  const updateProfile = async (profileData) => {
    try {
      // 模拟更新用户信息API调用
      const response = await mockUpdateProfile(profileData)

      setUserInfo(response.userInfo)

      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const initializeUser = () => {
    // 从本地存储恢复用户信息
    const savedToken = localStorage.getItem('user-token')
    if (savedToken) {
      setToken(savedToken)
    }

    const savedUserInfo = localStorage.getItem('user-info')
    if (savedUserInfo) {
      try {
        setUserInfo(JSON.parse(savedUserInfo))
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }

    const savedPreferences = localStorage.getItem('user-preferences')
    if (savedPreferences) {
      try {
        updatePreferences(JSON.parse(savedPreferences))
      } catch (error) {
        console.error('解析用户偏好失败:', error)
      }
    }
  }

  return {
    // State
    userInfo,
    token,
    permissions,
    preferences,

    // Getters
    isLoggedIn,
    userName,
    userAvatar,
    hasPermission,

    // Actions
    setUserInfo,
    setToken,
    setPermissions,
    updatePreferences,
    login,
    logout,
    updateProfile,
    initializeUser
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token', 'userInfo', 'preferences']
  }
})

// 模拟API函数
const mockLogin = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'demo' && credentials.password === '123456') {
        resolve({
          token: 'mock-jwt-token-' + Date.now(),
          userInfo: {
            id: 1,
            name: '演示用户',
            email: 'demo@example.com',
            avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
            phone: '138****8888'
          },
          permissions: ['read', 'write']
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 1000)
  })
}

const mockUpdateProfile = (profileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        userInfo: {
          id: 1,
          ...profileData
        }
      })
    }, 1000)
  })
}
