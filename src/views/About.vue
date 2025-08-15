<template>
  <div class="about">
    <van-nav-bar
      title="关于"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <div class="about-content">
      <div class="logo-section">
        <van-image
          width="80"
          height="80"
          src="/favicon.ico"
          round
        />
        <h2>Vue3 Mobile H5</h2>
        <p class="version">v{{ appVersion }}</p>
      </div>

      <van-cell-group title="项目信息">
        <van-cell title="项目名称" value="Vue3 Mobile H5" />
        <van-cell title="版本号" :value="appVersion" />
        <van-cell title="构建工具" value="Vite" />
        <van-cell title="UI框架" value="Vant" />
        <van-cell title="状态管理" value="Pinia" />
        <van-cell title="路由管理" value="Vue Router" />
      </van-cell-group>

      <van-cell-group title="技术栈">
        <van-cell
          v-for="tech in techStack"
          :key="tech.name"
          :title="tech.name"
          :value="tech.version"
          :label="tech.description"
        />
      </van-cell-group>

      <van-cell-group title="功能特性">
        <van-cell
          v-for="feature in features"
          :key="feature.name"
          :title="feature.name"
          :label="feature.description"
        >
          <template #right-icon>
            <van-icon name="success" color="#07c160" />
          </template>
        </van-cell>
      </van-cell-group>

      <div class="action-section">
        <van-button
          type="primary"
          size="large"
          round
          @click="handleViewSource"
        >
          查看源码
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { dialog } from '@/config/vant'

// 应用版本
const appVersion = ref('1.0.0')

// 技术栈信息
const techStack = ref([
  {
    name: 'Vue',
    version: '3.5.18',
    description: '渐进式 JavaScript 框架'
  },
  {
    name: 'Vite',
    version: '7.1.1',
    description: '下一代前端构建工具'
  },
  {
    name: 'Vant',
    version: '4.9.21',
    description: '轻量、可靠的移动端组件库'
  },
  {
    name: 'Pinia',
    version: '3.0.3',
    description: 'Vue 的状态管理库'
  },
  {
    name: 'Vue Router',
    version: '4.5.1',
    description: 'Vue.js 的官方路由'
  },
  {
    name: 'Sass',
    version: '1.90.0',
    description: 'CSS 预处理器'
  }
])

// 功能特性
const features = ref([
  {
    name: '移动端适配',
    description: '基于 rem + flexible 的移动端适配方案'
  },
  {
    name: '组件按需导入',
    description: '自动按需导入 Vant 组件，减小打包体积'
  },
  {
    name: '浏览器兼容',
    description: '支持 Chrome 88+ 等现代浏览器'
  },
  {
    name: '代码规范',
    description: 'ESLint + Prettier 代码格式化和规范检查'
  },
  {
    name: '主题定制',
    description: '支持 Vant 组件主题定制'
  },
  {
    name: '响应式设计',
    description: '移动端和PC端显示效果一致'
  }
])

// 查看源码
const handleViewSource = () => {
  dialog.confirm({
    title: '查看源码',
    message: '是否跳转到 GitHub 查看项目源码？',
  }).then(() => {
    // 这里可以跳转到实际的 GitHub 地址
    window.open('https://github.com', '_blank')
  }).catch(() => {
    // 用户取消
  })
}
</script>

<style lang="scss" scoped>
.about {
  min-height: 100vh;
  background-color: $background-color;
}

.about-content {
  padding-top: 46px; // 为顶部导航栏留出空间
  padding: 46px 16px 16px;
}

.logo-section {
  text-align: center;
  padding: 40px 0;
  background-color: $white;
  border-radius: $border-radius-lg;
  margin-bottom: 20px;

  h2 {
    margin: 16px 0 8px;
    font-size: $font-size-xl;
    color: $text-color;
    font-weight: 600;
  }

  .version {
    margin: 0;
    font-size: $font-size-sm;
    color: $text-color-3;
  }
}

.action-section {
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
