/**
 * User Store 测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import { testDataFactory, mockFactory } from '@/utils/test-utils'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

describe('User Store', () => {
  let userStore

  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserStore()
    vi.clearAllMocks()
  })

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      expect(userStore.userInfo).toBeNull()
      expect(userStore.token).toBe('')
      expect(userStore.permissions).toEqual([])
      expect(userStore.isLoggedIn).toBe(false)
      expect(userStore.userName).toBe('未登录')
    })
  })

  describe('用户信息管理', () => {
    it('应该正确设置用户信息', () => {
      const userData = testDataFactory.user()

      userStore.setUserInfo(userData)

      expect(userStore.userInfo).toEqual(userData)
      expect(userStore.userName).toBe(userData.name)
    })

    it('应该正确设置token', () => {
      const token = 'test-token'

      userStore.setToken(token)

      expect(userStore.token).toBe(token)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user-token', token)
    })

    it('应该在清除token时移除localStorage', () => {
      userStore.setToken('')

      expect(userStore.token).toBe('')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user-token')
    })
  })

  describe('登录功能', () => {
    it('应该成功登录', async () => {
      const credentials = {
        username: 'demo',
        password: '123456'
      }

      const result = await userStore.login(credentials)

      expect(result.success).toBe(true)
      expect(userStore.isLoggedIn).toBe(true)
      expect(userStore.token).toBeTruthy()
      expect(userStore.userInfo).toBeTruthy()
    })

    it('应该处理登录失败', async () => {
      const credentials = {
        username: 'wrong',
        password: 'wrong'
      }

      const result = await userStore.login(credentials)

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
      expect(userStore.isLoggedIn).toBe(false)
    })
  })

  describe('退出登录', () => {
    it('应该正确清除用户数据', () => {
      // 先设置一些数据
      userStore.setToken('test-token')
      userStore.setUserInfo(testDataFactory.user())
      userStore.setPermissions(['read', 'write'])

      // 退出登录
      userStore.logout()

      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.permissions).toEqual([])
      expect(userStore.isLoggedIn).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user-token')
    })
  })

  describe('权限管理', () => {
    it('应该正确检查权限', () => {
      userStore.setPermissions(['read', 'write'])

      expect(userStore.hasPermission.value('read')).toBe(true)
      expect(userStore.hasPermission.value('write')).toBe(true)
      expect(userStore.hasPermission.value('admin')).toBe(false)
    })
  })

  describe('偏好设置', () => {
    it('应该正确更新用户偏好', () => {
      const preferences = {
        theme: 'dark',
        language: 'en-US'
      }

      userStore.updatePreferences(preferences)

      expect(userStore.preferences.theme).toBe('dark')
      expect(userStore.preferences.language).toBe('en-US')
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user-preferences',
        JSON.stringify(userStore.preferences)
      )
    })
  })
})
