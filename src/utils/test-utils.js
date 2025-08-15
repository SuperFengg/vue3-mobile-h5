/**
 * 测试工具函数
 */

import { mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

// 创建测试路由
export function createTestRouter(routes = []) {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      ...routes
    ]
  })
}

// 创建测试 Pinia
export function createTestPinia() {
  return createPinia()
}

// 挂载组件的辅助函数
export function mountComponent(component, options = {}) {
  const {
    props = {},
    slots = {},
    global = {},
    router,
    pinia,
    ...mountOptions
  } = options

  const globalConfig = {
    plugins: [],
    ...global
  }

  // 添加路由
  if (router) {
    globalConfig.plugins.push(router)
  }

  // 添加状态管理
  if (pinia) {
    globalConfig.plugins.push(pinia)
  }

  return mount(component, {
    props,
    slots,
    global: globalConfig,
    ...mountOptions
  })
}

// 等待异步操作完成
export async function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// 模拟用户交互
export const userEvent = {
  // 点击元素
  async click(wrapper, selector) {
    const element = wrapper.find(selector)
    await element.trigger('click')
    await flushPromises()
    return element
  },

  // 输入文本
  async type(wrapper, selector, text) {
    const input = wrapper.find(selector)
    await input.setValue(text)
    await input.trigger('input')
    await flushPromises()
    return input
  },

  // 提交表单
  async submit(wrapper, selector = 'form') {
    const form = wrapper.find(selector)
    await form.trigger('submit')
    await flushPromises()
    return form
  }
}

// 断言辅助函数
export const assertions = {
  // 检查元素是否存在
  toExist(wrapper, selector) {
    const element = wrapper.find(selector)
    expect(element.exists()).toBe(true)
    return element
  },

  // 检查元素是否不存在
  toNotExist(wrapper, selector) {
    const element = wrapper.find(selector)
    expect(element.exists()).toBe(false)
    return element
  },

  // 检查文本内容
  toHaveText(wrapper, selector, text) {
    const element = wrapper.find(selector)
    expect(element.text()).toBe(text)
    return element
  },

  // 检查是否包含文本
  toContainText(wrapper, selector, text) {
    const element = wrapper.find(selector)
    expect(element.text()).toContain(text)
    return element
  },

  // 检查属性值
  toHaveAttribute(wrapper, selector, attr, value) {
    const element = wrapper.find(selector)
    expect(element.attributes(attr)).toBe(value)
    return element
  },

  // 检查类名
  toHaveClass(wrapper, selector, className) {
    const element = wrapper.find(selector)
    expect(element.classes()).toContain(className)
    return element
  }
}

// Mock 工厂函数
export const mockFactory = {
  // 创建 Mock 函数
  fn: vi.fn,

  // 创建 Mock 对象
  object(methods = {}) {
    const mock = {}
    Object.keys(methods).forEach(key => {
      mock[key] = vi.fn(methods[key])
    })
    return mock
  },

  // 创建 Mock API 响应
  apiResponse(data, status = 200) {
    return Promise.resolve({
      status,
      data,
      headers: {},
      config: {}
    })
  },

  // 创建 Mock API 错误
  apiError(message = 'API Error', status = 500) {
    const error = new Error(message)
    error.response = { status, data: { message } }
    return Promise.reject(error)
  }
}

// 测试数据工厂
export const testDataFactory = {
  // 创建用户数据
  user(overrides = {}) {
    return {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://example.com/avatar.jpg',
      ...overrides
    }
  },

  // 创建商品数据
  product(overrides = {}) {
    return {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      description: 'Test product description',
      image: 'https://example.com/product.jpg',
      ...overrides
    }
  },

  // 创建列表数据
  list(factory, count = 5, overrides = {}) {
    return Array.from({ length: count }, (_, index) =>
      factory({ id: index + 1, ...overrides })
    )
  }
}

export default {
  createTestRouter,
  createTestPinia,
  mountComponent,
  flushPromises,
  userEvent,
  assertions,
  mockFactory,
  testDataFactory
}
