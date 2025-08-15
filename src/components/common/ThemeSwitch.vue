<template>
  <div class="theme-switch">
    <van-cell
      v-if="showAsCell"
      :title="title"
      :value="currentThemeText"
      is-link
      @click="showPicker = true"
    />

    <van-button
      v-else-if="showAsButton"
      :type="buttonType"
      :size="buttonSize"
      :round="buttonRound"
      @click="showPicker = true"
    >
      <van-icon :name="currentThemeIcon" />
      {{ showText ? currentThemeText : '' }}
    </van-button>

    <van-switch
      v-else-if="showAsSwitch"
      v-model="isDarkMode"
      :size="switchSize"
      @change="handleSwitchChange"
    />

    <div v-else class="theme-options">
      <div
        v-for="theme in availableThemes"
        :key="theme.name"
        class="theme-option"
        :class="{ active: currentTheme === theme.name }"
        @click="setTheme(theme.name)"
      >
        <van-icon :name="theme.icon" />
        <span>{{ theme.displayName }}</span>
      </div>
    </div>

    <!-- 主题选择器弹出层 -->
    <van-action-sheet
      v-model:show="showPicker"
      :actions="themeActions"
      cancel-text="取消"
      @select="handleThemeSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useTheme } from '@/utils/theme'

const props = defineProps({
  // 显示模式
  mode: {
    type: String,
    default: 'picker', // picker | cell | button | switch | options
    validator: (value) => ['picker', 'cell', 'button', 'switch', 'options'].includes(value)
  },

  // 标题
  title: {
    type: String,
    default: '主题模式'
  },

  // 按钮相关
  buttonType: {
    type: String,
    default: 'default'
  },
  buttonSize: {
    type: String,
    default: 'normal'
  },
  buttonRound: {
    type: Boolean,
    default: false
  },
  showText: {
    type: Boolean,
    default: true
  },

  // 开关相关
  switchSize: {
    type: String,
    default: '24px'
  },

  // 可用主题
  themes: {
    type: Array,
    default: () => ['light', 'dark', 'auto']
  }
})

const emit = defineEmits(['change'])

// 使用主题管理器
const { currentTheme, setTheme, toggleTheme, themes: allThemes } = useTheme()

// 状态
const showPicker = ref(false)

// 计算属性
const showAsCell = computed(() => props.mode === 'cell')
const showAsButton = computed(() => props.mode === 'button')
const showAsSwitch = computed(() => props.mode === 'switch')
const showAsOptions = computed(() => props.mode === 'options')

const availableThemes = computed(() => {
  const themeMap = {
    light: { name: 'light', displayName: '浅色', icon: 'sun-o' },
    dark: { name: 'dark', displayName: '深色', icon: 'moon-o' },
    auto: { name: 'auto', displayName: '跟随系统', icon: 'setting-o' }
  }

  return props.themes.map(themeName => themeMap[themeName]).filter(Boolean)
})

const currentThemeText = computed(() => {
  const theme = availableThemes.value.find(t => t.name === currentTheme.value)
  return theme ? theme.displayName : '未知'
})

const currentThemeIcon = computed(() => {
  const theme = availableThemes.value.find(t => t.name === currentTheme.value)
  return theme ? theme.icon : 'setting-o'
})

const isDarkMode = computed({
  get() {
    return currentTheme.value === 'dark'
  },
  set(value) {
    // 开关模式下只在 light 和 dark 之间切换
    setTheme(value ? 'dark' : 'light')
  }
})

const themeActions = computed(() => {
  return availableThemes.value.map(theme => ({
    name: theme.displayName,
    value: theme.name,
    icon: theme.icon
  }))
})

// 方法
const handleThemeSelect = (action) => {
  setTheme(action.value)
  emit('change', action.value)
}

const handleSwitchChange = (value) => {
  const newTheme = value ? 'dark' : 'light'
  emit('change', newTheme)
}
</script>

<style lang="scss" scoped>
.theme-switch {
  .theme-options {
    display: flex;
    gap: 12px;
    padding: 16px;

    .theme-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-radius: $border-radius-md;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 80px;

      &:hover {
        border-color: var(--color-primary);
      }

      &.active {
        border-color: var(--color-primary);
        background-color: var(--color-primary);
        color: white;
      }

      .van-icon {
        font-size: 20px;
      }

      span {
        font-size: $font-size-sm;
        text-align: center;
      }
    }
  }
}
</style>
