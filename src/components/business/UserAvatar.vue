<template>
  <div class="user-avatar" :class="avatarClass" @click="handleClick">
    <van-image
      v-if="src"
      :src="src"
      :alt="name"
      fit="cover"
      round
      :lazy-load="lazyLoad"
    >
      <template #loading>
        <van-loading type="spinner" size="16" />
      </template>
      <template #error>
        <div class="avatar-placeholder">
          <van-icon name="user-o" :size="iconSize" />
        </div>
      </template>
    </van-image>

    <div v-else class="avatar-placeholder">
      <span v-if="name" class="avatar-text">{{ avatarText }}</span>
      <van-icon v-else name="user-o" :size="iconSize" />
    </div>

    <!-- 在线状态指示器 -->
    <div
      v-if="showOnlineStatus"
      class="online-status"
      :class="{ online: isOnline }"
    />

    <!-- 角标 -->
    <van-badge
      v-if="badge"
      :content="badge"
      :max="badgeMax"
      :dot="badgeDot"
      class="avatar-badge"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 头像信息
  src: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },

  // 尺寸
  size: {
    type: [String, Number],
    default: 40,
    validator: (value) => {
      if (typeof value === 'string') {
        return ['small', 'medium', 'large'].includes(value)
      }
      return typeof value === 'number'
    }
  },

  // 功能开关
  lazyLoad: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: false
  },
  showOnlineStatus: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },

  // 角标
  badge: {
    type: [String, Number],
    default: ''
  },
  badgeMax: {
    type: Number,
    default: 99
  },
  badgeDot: {
    type: Boolean,
    default: false
  },

  // 样式
  shape: {
    type: String,
    default: 'round', // round | square
    validator: (value) => ['round', 'square'].includes(value)
  },
  backgroundColor: {
    type: String,
    default: '#f0f0f0'
  },
  textColor: {
    type: String,
    default: '#666'
  }
})

const emit = defineEmits(['click'])

// 计算头像尺寸
const avatarSize = computed(() => {
  const sizeMap = {
    small: 32,
    medium: 40,
    large: 56
  }

  if (typeof props.size === 'string') {
    return sizeMap[props.size] || 40
  }

  return props.size
})

// 计算图标尺寸
const iconSize = computed(() => {
  return Math.floor(avatarSize.value * 0.5)
})

// 计算文字尺寸
const textSize = computed(() => {
  return Math.floor(avatarSize.value * 0.4)
})

// 计算状态指示器尺寸
const statusSize = computed(() => {
  return Math.floor(avatarSize.value * 0.25)
})

// 计算头像文字
const avatarText = computed(() => {
  if (!props.name) return ''

  // 如果是中文，取最后一个字符
  if (/[\u4e00-\u9fa5]/.test(props.name)) {
    return props.name.slice(-1)
  }

  // 如果是英文，取首字母
  const words = props.name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  return props.name[0]?.toUpperCase() || ''
})

// 计算样式类
const avatarClass = computed(() => ({
  [`avatar-${props.shape}`]: true,
  'avatar-clickable': props.clickable
}))

// 处理点击事件
const handleClick = () => {
  if (props.clickable) {
    emit('click', {
      src: props.src,
      name: props.name
    })
  }
}
</script>

<style lang="scss" scoped>
.user-avatar {
  position: relative;
  display: inline-block;
  width: v-bind(avatarSize + 'px');
  height: v-bind(avatarSize + 'px');

  &.avatar-clickable {
    cursor: pointer;
  }

  &.avatar-round {
    border-radius: 50%;

    .van-image,
    .avatar-placeholder {
      border-radius: 50%;
    }
  }

  &.avatar-square {
    border-radius: $border-radius-sm;

    .van-image,
    .avatar-placeholder {
      border-radius: $border-radius-sm;
    }
  }

  .van-image {
    width: 100%;
    height: 100%;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    background-color: v-bind(backgroundColor);
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-text {
      font-size: v-bind(textSize + 'px');
      font-weight: 500;
      color: v-bind(textColor);
      line-height: 1;
    }

    .van-icon {
      color: v-bind(textColor);
    }
  }

  .online-status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: v-bind(statusSize + 'px');
    height: v-bind(statusSize + 'px');
    border-radius: 50%;
    background-color: #ccc;
    border: 2px solid $white;

    &.online {
      background-color: #52c41a;
    }
  }

  .avatar-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    transform: none;
  }
}
</style>
