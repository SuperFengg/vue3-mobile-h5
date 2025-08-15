<template>
  <div class="state-demo">
    <van-cell-group title="应用状态">
      <van-cell title="主题模式" :value="theme" />
      <van-cell title="语言设置" :value="language" />
      <van-cell title="网络状态" :value="networkStatus" />
      <van-cell title="设备类型" :value="deviceInfo.isMobile ? '移动设备' : '桌面设备'" />
    </van-cell-group>

    <van-cell-group title="用户状态">
      <van-cell title="登录状态" :value="isLoggedIn ? '已登录' : '未登录'" />
      <van-cell title="用户名" :value="userName" />
      <van-cell title="权限" :value="permissions.join(', ') || '无'" />
    </van-cell-group>

    <van-cell-group title="计数器演示">
      <van-cell title="当前计数" :value="count" />
      <van-cell title="双倍计数" :value="doubleCount" />
      <van-cell>
        <template #title>
          <van-button size="small" @click="increment">增加</van-button>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="操作">
      <van-cell title="切换主题" is-link @click="toggleTheme" />
      <van-cell title="切换语言" is-link @click="toggleLanguage" />
      <van-cell title="模拟登录" is-link @click="handleLogin" />
      <van-cell title="退出登录" is-link @click="handleLogout" />
    </van-cell-group>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore, useUserStore, useCounterStore } from '@/stores'
import { toast } from '@/config/vant'

// 使用 stores
const appStore = useAppStore()
const userStore = useUserStore()
const counterStore = useCounterStore()

// 响应式引用
const { theme, language, networkStatus, deviceInfo } = storeToRefs(appStore)
const { isLoggedIn, userName, permissions } = storeToRefs(userStore)
const { count, doubleCount } = storeToRefs(counterStore)

// 方法
const { setTheme, setLanguage } = appStore
const { login, logout } = userStore
const { increment } = counterStore

// 切换主题
const toggleTheme = () => {
  const newTheme = theme.value === 'light' ? 'dark' : 'light'
  setTheme(newTheme)
  toast.success(`已切换到${newTheme === 'light' ? '浅色' : '深色'}模式`)
}

// 切换语言
const toggleLanguage = () => {
  const newLanguage = language.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  setLanguage(newLanguage)
  toast.success(`已切换到${newLanguage === 'zh-CN' ? '中文' : '英文'}`)
}

// 模拟登录
const handleLogin = async () => {
  try {
    toast.loading('登录中...')
    const result = await login({
      username: 'demo',
      password: '123456'
    })

    if (result.success) {
      toast.success('登录成功')
    } else {
      toast.fail(result.error)
    }
  } catch (error) {
    toast.fail('登录失败')
  }
}

// 退出登录
const handleLogout = () => {
  logout()
  toast.success('已退出登录')
}
</script>

<style lang="scss" scoped>
.state-demo {
  :deep(.van-cell-group) {
    margin-bottom: 16px;
  }

  :deep(.van-cell-group__title) {
    padding: 16px 16px 8px;
    color: $text-color;
    font-size: $font-size-md;
    font-weight: 600;
  }
}
</style>
