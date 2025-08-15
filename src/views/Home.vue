<template>
  <div class="home">
    <van-nav-bar title="首页" fixed />

    <div class="home-content">
      <div class="welcome-section">
        <h1>欢迎使用 Vue3 Mobile H5</h1>
        <p>基于 Vue3 + Vite + Vant 的移动端H5项目</p>
      </div>

      <div class="feature-grid">
        <van-grid :column-num="2" :gutter="16">
          <van-grid-item
            v-for="feature in features"
            :key="feature.id"
            :icon="feature.icon"
            :text="feature.text"
            @click="handleFeatureClick(feature)"
          />
        </van-grid>
      </div>

      <div class="demo-section">
        <van-cell-group title="组件演示">
          <van-cell
            v-for="demo in demos"
            :key="demo.id"
            :title="demo.title"
            :label="demo.description"
            is-link
            @click="$router.push(demo.path)"
          />
        </van-cell-group>
      </div>

      <div class="theme-section">
        <van-cell-group title="主题设置">
          <ThemeSwitch mode="cell" />
        </van-cell-group>
      </div>

      <div class="state-section">
        <van-cell-group title="状态管理演示">
          <StateDemo />
        </van-cell-group>
      </div>
    </div>

    <van-tabbar v-model="activeTab" @change="onTabChange">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/examples">示例</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/demo">演示</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/profile">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/config/vant'

const router = useRouter()
const activeTab = ref(0)

// 功能特性
const features = ref([
  {
    id: 1,
    icon: 'fire-o',
    text: 'Vue3 最新版',
  },
  {
    id: 2,
    icon: 'diamond-o',
    text: 'Vite 构建',
  },
  {
    id: 3,
    icon: 'gem-o',
    text: 'Vant UI',
  },
  {
    id: 4,
    icon: 'star-o',
    text: '移动端适配',
  },
])

// 演示页面
const demos = ref([
  {
    id: 1,
    title: '基础组件',
    description: '按钮、单元格、图标等基础组件',
    path: '/demo/basic',
  },
  {
    id: 2,
    title: '表单组件',
    description: '输入框、选择器、开关等表单组件',
    path: '/demo/form',
  },
  {
    id: 3,
    title: '反馈组件',
    description: '弹窗、提示、加载等反馈组件',
    path: '/demo/feedback',
  },
  {
    id: 4,
    title: '展示组件',
    description: '列表、卡片、轮播等展示组件',
    path: '/demo/display',
  },
  {
    id: 5,
    title: '综合示例',
    description: '完整的功能演示和最佳实践',
    path: '/examples',
  },
])

// 处理功能点击
const handleFeatureClick = (feature) => {
  toast.success(`点击了 ${feature.text}`)
}

// 处理标签栏切换
const onTabChange = (index) => {
  console.log('切换到标签:', index)
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background-color: $background-color;
  padding-bottom: 50px; // 为底部标签栏留出空间
}

.home-content {
  padding-top: 46px; // 为顶部导航栏留出空间
  padding: 46px 16px 16px;
}

.welcome-section {
  text-align: center;
  padding: 40px 0;
  background: linear-gradient(135deg, $primary-color, #3ba0ff);
  color: white;
  border-radius: $border-radius-lg;
  margin-bottom: 20px;

  h1 {
    font-size: $font-size-xl;
    margin: 0 0 10px;
    font-weight: 600;
  }

  p {
    font-size: $font-size-md;
    margin: 0;
    opacity: 0.9;
  }
}

.feature-grid {
  margin-bottom: 20px;

  :deep(.van-grid-item__content) {
    padding: 20px 16px;
    background-color: $white;
    border-radius: $border-radius-md;
  }

  :deep(.van-grid-item__icon) {
    font-size: 24px;
    color: $primary-color;
  }

  :deep(.van-grid-item__text) {
    margin-top: 8px;
    color: $text-color;
    font-size: $font-size-sm;
  }
}

.demo-section {
  :deep(.van-cell-group__title) {
    padding: 16px 16px 8px;
    color: $text-color;
    font-size: $font-size-md;
    font-weight: 600;
  }

  :deep(.van-cell) {
    margin-bottom: 8px;
    border-radius: $border-radius-md;
    overflow: hidden;
  }
}
</style>
