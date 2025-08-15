<template>
  <div class="page-container" :class="containerClass">
    <!-- 导航栏 -->
    <van-nav-bar
      v-if="showNavBar"
      :title="title"
      :left-text="leftText"
      :left-arrow="leftArrow"
      :right-text="rightText"
      :fixed="navBarFixed"
      :placeholder="navBarFixed"
      @click-left="handleLeftClick"
      @click-right="handleRightClick"
    >
      <template v-if="$slots.left" #left>
        <slot name="left" />
      </template>
      <template v-if="$slots.right" #right>
        <slot name="right" />
      </template>
    </van-nav-bar>

    <!-- 页面内容 -->
    <div class="page-content" :class="contentClass">
      <slot />
    </div>

    <!-- 底部标签栏 -->
    <slot name="tabbar" />

    <!-- 全局加载状态 -->
    <van-overlay v-if="loading" class="loading-overlay">
      <div class="loading-wrapper">
        <van-loading size="24px" vertical>{{ loadingText }}</van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  // 导航栏相关
  title: {
    type: String,
    default: ''
  },
  showNavBar: {
    type: Boolean,
    default: true
  },
  leftText: {
    type: String,
    default: ''
  },
  leftArrow: {
    type: Boolean,
    default: false
  },
  rightText: {
    type: String,
    default: ''
  },
  navBarFixed: {
    type: Boolean,
    default: true
  },

  // 页面相关
  backgroundColor: {
    type: String,
    default: '#f7f8fa'
  },
  padding: {
    type: [String, Number],
    default: 16
  },
  safeAreaTop: {
    type: Boolean,
    default: false
  },
  safeAreaBottom: {
    type: Boolean,
    default: false
  },

  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: '加载中...'
  }
})

const emit = defineEmits(['left-click', 'right-click'])

const router = useRouter()
const instance = getCurrentInstance()

// 计算样式类
const containerClass = computed(() => ({
  'safe-area-top': props.safeAreaTop,
  'safe-area-bottom': props.safeAreaBottom
}))

const contentClass = computed(() => ({
  'has-navbar': props.showNavBar && props.navBarFixed,
  'no-padding': props.padding === 0
}))

// 处理导航栏点击事件
const handleLeftClick = () => {
  emit('left-click')
  const hasListener = !!(instance?.vnode?.props?.onLeftClick || instance?.vnode?.props?.['onLeft-click'])
  if (props.leftArrow && !hasListener) {
    router.back()
  }
}

const handleRightClick = () => {
  emit('right-click')
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: v-bind(backgroundColor);

  &.safe-area-top {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }

  &.safe-area-bottom {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.page-content {
  padding: v-bind(padding + 'px');

  &.has-navbar {
    padding-top: calc(v-bind(padding + 'px') + 46px);
  }

  &.no-padding {
    padding: 0;

    &.has-navbar {
      padding-top: 46px;
    }
  }
}

.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;

  .loading-wrapper {
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: $border-radius-md;

    :deep(.van-loading__text) {
      color: white;
      margin-top: 8px;
    }

    :deep(.van-loading__spinner) {
      color: white;
    }
  }
}
</style>
