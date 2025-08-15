/**
 * UserAvatar 组件测试
 */

import { describe, it, expect, vi } from 'vitest'
import { mountComponent, assertions, testDataFactory } from '@/utils/test-utils'
import UserAvatar from '@/components/business/UserAvatar.vue'

describe('UserAvatar', () => {
  const defaultProps = {
    src: 'https://example.com/avatar.jpg',
    name: 'Test User',
    size: 40
  }

  it('应该正确渲染头像', () => {
    const wrapper = mountComponent(UserAvatar, {
      props: defaultProps
    })

    assertions.toExist(wrapper, '.user-avatar')
    assertions.toExist(wrapper, '.van-image')
  })

  it('应该显示用户名首字母当没有头像时', () => {
    const wrapper = mountComponent(UserAvatar, {
      props: {
        name: 'John Doe',
        size: 40
      }
    })

    assertions.toExist(wrapper, '.avatar-placeholder')
    assertions.toHaveText(wrapper, '.avatar-text', 'JD')
  })

  it('应该显示中文名字的最后一个字符', () => {
    const wrapper = mountComponent(UserAvatar, {
      props: {
        name: '张三',
        size: 40
      }
    })

    assertions.toHaveText(wrapper, '.avatar-text', '三')
  })

  it('应该响应点击事件当可点击时', async () => {
    const wrapper = mountComponent(UserAvatar, {
      props: {
        ...defaultProps,
        clickable: true
      }
    })

    await wrapper.find('.user-avatar').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0][0]).toEqual({
      src: defaultProps.src,
      name: defaultProps.name
    })
  })

  it('应该显示在线状态指示器', () => {
    const wrapper = mountComponent(UserAvatar, {
      props: {
        ...defaultProps,
        showOnlineStatus: true,
        isOnline: true
      }
    })

    assertions.toExist(wrapper, '.online-status')
    assertions.toHaveClass(wrapper, '.online-status', 'online')
  })

  it('应该显示角标', () => {
    const wrapper = mountComponent(UserAvatar, {
      props: {
        ...defaultProps,
        badge: '5'
      }
    })

    assertions.toExist(wrapper, '.avatar-badge')
  })

  it('应该根据尺寸属性设置正确的大小', () => {
    const wrapper = mountComponent(UserAvatar, {
      props: {
        ...defaultProps,
        size: 'large'
      }
    })

    const avatar = wrapper.find('.user-avatar')
    expect(avatar.element.style.width).toBe('56px')
    expect(avatar.element.style.height).toBe('56px')
  })
})
