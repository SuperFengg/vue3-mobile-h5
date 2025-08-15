<template>
  <div class="profile">
    <van-nav-bar
      title="个人设置"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <div class="profile-content">
      <div class="user-info">
        <van-image
          width="60"
          height="60"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          round
        />
        <div class="user-details">
          <h3>{{ userInfo.name }}</h3>
          <p>{{ userInfo.email }}</p>
        </div>
      </div>

      <van-cell-group title="基本设置">
        <van-cell title="主题模式" :value="themeText" is-link @click="showThemeSelector" />
        <van-cell title="语言设置" :value="languageText" is-link @click="showLanguageSelector" />
        <van-cell title="消息通知">
          <template #right-icon>
            <van-switch v-model="settings.notification" />
          </template>
        </van-cell>
        <van-cell title="自动更新">
          <template #right-icon>
            <van-switch v-model="settings.autoUpdate" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group title="其他设置">
        <van-cell title="清除缓存" is-link @click="clearCache" />
        <van-cell title="检查更新" is-link @click="checkUpdate" />
        <van-cell title="意见反馈" is-link @click="showFeedback" />
        <van-cell title="关于我们" is-link @click="$router.push('/about')" />
      </van-cell-group>

      <div class="logout-section">
        <van-button
          type="danger"
          size="large"
          round
          @click="handleLogout"
        >
          退出登录
        </van-button>
      </div>
    </div>

    <!-- 主题选择器 -->
    <van-action-sheet
      v-model:show="showThemeSheet"
      :actions="themeActions"
      cancel-text="取消"
      @select="onThemeSelect"
    />

    <!-- 语言选择器 -->
    <van-action-sheet
      v-model:show="showLanguageSheet"
      :actions="languageActions"
      cancel-text="取消"
      @select="onLanguageSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast, dialog } from '@/config/vant'

const router = useRouter()

// 用户信息
const userInfo = ref({
  name: '演示用户',
  email: 'demo@example.com'
})

// 设置项
const settings = ref({
  theme: 'light',
  language: 'zh-CN',
  notification: true,
  autoUpdate: false
})

// 主题选择器
const showThemeSheet = ref(false)
const themeActions = [
  { name: '浅色模式', value: 'light' },
  { name: '深色模式', value: 'dark' },
  { name: '跟随系统', value: 'auto' }
]

// 语言选择器
const showLanguageSheet = ref(false)
const languageActions = [
  { name: '简体中文', value: 'zh-CN' },
  { name: 'English', value: 'en-US' }
]

// 计算属性
const themeText = computed(() => {
  const theme = themeActions.find(item => item.value === settings.value.theme)
  return theme ? theme.name : '浅色模式'
})

const languageText = computed(() => {
  const language = languageActions.find(item => item.value === settings.value.language)
  return language ? language.name : '简体中文'
})

// 显示主题选择器
const showThemeSelector = () => {
  showThemeSheet.value = true
}

// 显示语言选择器
const showLanguageSelector = () => {
  showLanguageSheet.value = true
}

// 主题选择
const onThemeSelect = (action) => {
  settings.value.theme = action.value
  toast.success(`已切换到${action.name}`)
}

// 语言选择
const onLanguageSelect = (action) => {
  settings.value.language = action.value
  toast.success(`已切换到${action.name}`)
}

// 清除缓存
const clearCache = () => {
  dialog.confirm({
    title: '清除缓存',
    message: '确定要清除所有缓存数据吗？',
  }).then(() => {
    // 模拟清除缓存
    setTimeout(() => {
      toast.success('缓存清除成功')
    }, 1000)
  })
}

// 检查更新
const checkUpdate = () => {
  toast.loading('检查更新中...')
  setTimeout(() => {
    toast.success('当前已是最新版本')
  }, 2000)
}

// 意见反馈
const showFeedback = () => {
  dialog.alert({
    title: '意见反馈',
    message: '感谢您的反馈，我们会认真对待每一条建议！',
  })
}

// 退出登录
const handleLogout = () => {
  dialog.confirm({
    title: '退出登录',
    message: '确定要退出当前账号吗？',
  }).then(() => {
    toast.success('已退出登录')
    // 这里可以清除用户数据并跳转到登录页
    router.push('/')
  })
}
</script>

<style lang="scss" scoped>
.profile {
  min-height: 100vh;
  background-color: $background-color;
}

.profile-content {
  padding-top: 46px; // 为顶部导航栏留出空间
  padding: 46px 16px 16px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: $white;
  border-radius: $border-radius-lg;
  margin-bottom: 20px;

  .user-details {
    margin-left: 16px;
    flex: 1;

    h3 {
      margin: 0 0 4px;
      font-size: $font-size-lg;
      color: $text-color;
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: $font-size-sm;
      color: $text-color-3;
    }
  }
}

.logout-section {
  margin-top: 30px;
  text-align: center;
}

:deep(.van-cell-group) {
  margin-bottom: 16px;
}

:deep(.van-cell-group__title) {
  padding: 16px 16px 8px;
  color: $text-color;
  font-size: $font-size-md;
  font-weight: 600;
}

:deep(.van-cell) {
  border-radius: $border-radius-md;
  margin-bottom: 1px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
