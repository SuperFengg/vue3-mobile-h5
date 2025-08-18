# Vue3 Mobile H5 项目

基于 Vue3 + Vite7 + Vant4 的现代化移动端 H5 应用开发模板。

## ✨ 特性

- 🚀 **Vue 3.5.18** - 最新的 Vue3 版本，支持 Composition API
- ⚡ **Vite 7.1.1** - 极速的构建工具，热更新体验
- 📱 **Vant 4.9.21** - 轻量、可靠的移动端组件库
- 🗂 **Vue Router 4.5.1** - 官方路由管理器
- 🍍 **Pinia 3.0.3** - 新一代状态管理库
- 🎨 **Sass 1.90.0** - CSS 预处理器
- 📏 **移动端适配** - 基于 rem + flexible 的适配方案
- 🌙 **主题切换** - 支持亮色/暗色主题
- 🔧 **JavaScript ES6+** - 现代JavaScript开发体验
- 📦 **组件自动导入** - Vant 组件按需自动导入
- 🛠 **开发工具** - ESLint + Prettier + Husky
- 🧪 **测试支持** - Vitest + Cypress
- 📊 **构建分析** - 打包体积分析和优化建议

## 🛠 技术栈

### 核心框架

- **Vue 3.5.18** - 渐进式 JavaScript 框架
- **Vite 7.1.1** - 下一代前端构建工具

### UI 组件库

- **Vant 4.9.21** - 移动端 Vue 组件库

### 状态管理

- **Pinia 3.0.3** - Vue 状态管理库
- **Vue Router 4.5.1** - 路由管理

### 开发工具

- **ESLint 9.33.0** - 代码质量检查
- **Prettier** - 代码格式化
- **Sass 1.90.0** - CSS 预处理器
- **Husky** - Git hooks 管理

### 测试工具

- **Vitest** - 单元测试框架
- **Cypress** - E2E 测试框架
- **@vue/test-utils** - Vue 组件测试工具

## 📦 安装

### 环境要求

- Node.js >= 22.12.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 克隆项目

```bash
git clone <repository-url>
cd vue3-mobile-h5
```

## 🧭 业务开发指南

### 路由与页面

- 新增页面：在 `src/views` 新建页面组件，并在 `src/router/index.js` 中配置路由；支持 `meta.title`、`meta.keepAlive`、`meta.requiresAuth` 等。

```js
// 示例：受保护的页面
{
  path: '/orders',
  name: 'Orders',
  component: () => import('@/views/Orders.vue'),
  meta: { title: '我的订单', requiresAuth: true, keepAlive: true }
}

// 在全局前置守卫里按需拦截（示例，实际逻辑请自行完善）
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !useUserStore().isLoggedIn) {
    next('/login')
    return
  }
  next()
})
```

### 状态管理（Pinia）

- 应用层 `useAppStore`：全局 loading、主题、语言、网络状态、设备信息等。

```js
import { useAppStore } from '@/stores'
const app = useAppStore()
app.setLoading(true)
app.setTheme('dark')
console.log(app.isDarkMode)
```

- 用户层 `useUserStore`：登录、退出、权限、偏好设置等。

```js
import { useUserStore } from '@/stores'
const user = useUserStore()
const { success, error } = await user.login({ username: 'demo', password: '123456' })
if (success) {
  console.log(user.userInfo, user.token)
} else {
  console.error(error)
}
```

- 数据层 `useDataStore`：通用缓存/列表分页/加载态/错误态管理，适配任意请求函数。

```js
import { useDataStore } from '@/stores'
import { productApi } from '@/services'

const dataStore = useDataStore()

// 缓存数据型
const product = await dataStore.fetchData('product:1', () => productApi.getProductDetail(1), {
  useCache: true,
  ttl: 5 * 60 * 1000,
})

// 列表分页型
await dataStore.fetchListData(
  'product:list',
  ({ page, pageSize }) => productApi.getProductList({ page, pageSize }),
  { page: 1, pageSize: 10 }
)

// 加载更多
await dataStore.loadMore('product:list', ({ page, pageSize }) =>
  productApi.getProductList({ page, pageSize })
)
```

### 请求与 API

- 直接使用 `http`（封装 axios）：统一拦截、错误处理、取消/上传/下载、标准化结果。

```js
import { http } from '@/services'
const list = await http.get('/products', { page: 1 })
const created = await http.post('/user', { name: 'John' })
```

- 使用领域 API：`src/services/api/*` 已按功能拆分。

```js
import { userApi, productApi, commonApi } from '@/services'
await userApi.login({ username: 'demo', password: '123456' })
const { data, total } = await productApi.getProductReviews(1, { page: 1 })
await commonApi.uploadFile(file)
```

- 取消重复请求与页面切换取消：已内置 `RequestCanceler`，无需手动处理。

### 全局反馈（Vant 二次封装）

`src/config/vant.js` 暴露便捷方法：

```js
import { toast, dialog, notify, imagePreview } from '@/config/vant'

toast.show('操作成功')
toast.success('保存成功')
toast.fail('请求失败')
const hide = toast.loading('提交中...') // hide.close() 手动关闭

await dialog.confirm({ title: '提示', message: '确定删除吗？' })
notify.warning('网络不稳定')
imagePreview.show(['https://.../1.png', 'https://.../2.png'])
```

### 主题（亮/暗 + 自定义）

```js
import { useTheme } from '@/utils/theme'
const { setTheme, toggleTheme, currentTheme, getThemeColor } = useTheme()
setTheme('dark')
toggleTheme()
console.log(currentTheme.value, getThemeColor('primary'))
```

可在 `src/styles/themes.scss` 定义/覆盖 CSS 变量，或在运行时通过 `useTheme()` 读取颜色。

### 事件总线（全局发布/订阅）

已在 `main.js` 注入插件，支持 `$bus` 与组合式 API：

```js
// 组合式（推荐）
import { useEventBus } from '@/utils/eventBus'
const { onEvent, onceEvent, emit } = useEventBus()

const off = onEvent('user:updated', payload => {
  console.log('用户更新', payload)
})
emit('user:updated', { id: 1 })
off()

// 全局（任意模块）
import { eventBus } from '@/utils/eventBus'
eventBus.emit('app:ready')
```

事件命名建议：`领域:动作`（如 `user:login`, `cart:updated`），载荷使用结构化对象。

### 常用业务组件

- `PageContainer`：统一导航栏/安全区/全局 loading 包裹。

```vue
<template>
  <PageContainer title="商品列表" left-arrow :loading="loading">
    <!-- 页面内容 -->
  </PageContainer>
  <template #tabbar>
    <!-- 可放底部 Tabbar -->
  </template>
  }
</template>
```

- `InfiniteList`：下拉刷新 + 滚动加载，直接对接接口或配合 `useDataStore`。

```vue
<template>
  <InfiniteList :list="list" :fetch-data="fetchData" @refresh="onRefresh" @load-more="onLoadMore">
    <template #default="{ item }">
      <ProductCard :product="item" />
    </template>
  </InfiniteList>
</template>

<script setup>
import { ref } from 'vue'
import { productApi } from '@/services'
const list = ref([])
const fetchData = ({ page, pageSize }) => productApi.getProductList({ page, pageSize })
const onRefresh = () => {}
const onLoadMore = () => {}
</script>
```

- `FormBuilder`：通过配置快速生成表单。

```vue
<script setup>
import { ref } from 'vue'
const form = ref({ username: '', gender: 'male', agree: false })
const formConfig = [
  {
    title: '基本信息',
    fields: [
      {
        type: 'input',
        name: 'username',
        label: '用户名',
        rules: [{ required: true, message: '必填' }],
      },
      {
        type: 'radio',
        name: 'gender',
        label: '性别',
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ],
      },
      { type: 'switch', name: 'agree', label: '同意协议' },
    ],
  },
]
const submitting = ref(false)
const handleSubmit = async values => {
  submitting.value = true /* 提交 */
  submitting.value = false
}
</script>

<template>
  <FormBuilder
    v-model="form"
    :form-config="formConfig"
    :submitting="submitting"
    @submit="handleSubmit"
  />
</template>
```

- 业务组件：`ProductCard`、`UserAvatar` 已封装常用交互与状态。

```vue
<UserAvatar :name="'张三'" clickable @click="info => console.log(info)" />
<ProductCard :product="product" @add-cart="addToCart" />
```

### 响应式与移动适配

- 基于 `lib-flexible` + `postcss-pxtorem` 自动转换，直接写 px 即可。
- 工具函数：

```js
import {
  getDevicePixelRatio,
  setRootFontSize,
  isWeChat,
  disableZoom,
  handleIOSSafeArea,
} from '@/utils/flexible'
setRootFontSize()
disableZoom()
handleIOSSafeArea()
```

- 断点工具：

```js
import {
  breakpoints,
  getCurrentBreakpoint,
  matchBreakpoint,
  watchBreakpointChange,
} from '@/utils/responsive'
console.log(breakpoints, getCurrentBreakpoint())
watchBreakpointChange(bp => console.log('breakpoint:', bp))
```

### Mock 数据

- 开发模式一键开启：`npm run dev:mock`。
- 辅助生成器：`src/services/mock/index.js` 提供 `mockData`、`mockPaginatedResponse` 等，可在示例/演示页快速产出数据。

### 环境变量（.env.\*）

- `VITE_API_BASE_URL`：接口基础地址
- `VITE_API_TIMEOUT`：请求超时（ms）
- `VITE_ENABLE_MOCK`：是否启用 Mock（true/false）
- `VITE_ENABLE_ERROR_REPORT`：是否启用错误上报（true/false）
- `VITE_ERROR_REPORT_URL`：错误上报服务端 URL

示例：

```env
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT=10000
VITE_ENABLE_MOCK=false
VITE_ENABLE_ERROR_REPORT=false
VITE_ERROR_REPORT_URL=https://example.com/report
```

### 错误处理

已在入口通过 `setupErrorHandler(app)` 注册全局处理：Vue 错误、资源加载、未捕获 Promise、路由错误等都会统一捕获与提示。

```js
import { reportError, createErrorBoundary } from '@/utils/errorHandler'

// 手动上报
reportError(new Error('业务异常'), { scene: 'order:submit', payload: form })

// 错误边界（选项式用法，或在路由级包装）
const ErrorBoundary = createErrorBoundary()
```

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

## 🚀 开发

### 启动开发服务器

```bash
# 启动开发服务器
npm run dev

# 启动开发服务器 (带 Mock 数据)
npm run dev:mock
```

### 构建

```bash
# 构建生产版本
npm run build

# 构建开发版本
npm run build:dev

# 构建并分析打包体积
npm run build:analyze
```

### 预览

```bash
# 预览构建结果
npm run preview
```

## 🧪 测试

### 单元测试

```bash
# 运行单元测试
npm run test:unit

# 运行单元测试 (单次)
npm run test:unit:run

# 运行单元测试并生成覆盖率报告
npm run test:unit:coverage
```

### E2E 测试

```bash
# 运行 E2E 测试 (开发模式)
npm run test:e2e:dev

# 运行 E2E 测试 (生产模式)
npm run test:e2e
```

## 🔧 代码质量

### 代码检查

```bash
# 运行 ESLint 检查并自动修复
npm run lint

# 仅检查代码质量 (不修复)
npm run lint:check
```

### 代码格式化

```bash
# 格式化代码
npm run format

# 检查代码格式
npm run format:check
```

### JavaScript语法检查

```bash
# JavaScript 语法检查
npm run lint:check
```

## 📁 项目结构

```
src/
├── components/          # 组件
│   ├── common/         # 通用组件
│   └── business/       # 业务组件
├── views/              # 页面组件
├── router/             # 路由配置
├── stores/             # Pinia 状态管理
│   ├── modules/        # 状态模块
│   └── plugins/        # 插件
├── services/           # API 服务
│   ├── api/           # API 接口
│   └── mock/          # Mock 数据
├── utils/              # 工具函数
├── styles/             # 样式文件
│   ├── variables.scss  # Sass 变量
│   ├── mixins.scss     # Sass 混入
│   ├── themes.scss     # 主题样式
│   └── global.scss     # 全局样式
├── assets/             # 静态资源
└── config/             # 配置文件
```

## 🎨 主题定制

项目支持亮色/暗色主题切换，可以通过以下方式自定义主题：

### 1. 修改主题变量

编辑 `src/styles/themes.scss` 文件：

```scss
.theme-light {
  --color-primary: #1989fa;
  --color-success: #07c160;
  // ... 其他颜色变量
}

.theme-dark {
  --color-primary: #1989fa;
  --color-success: #07c160;
  // ... 其他颜色变量
}
```

### 2. 使用主题管理器

```javascript
import { useTheme } from '@/utils/theme'

const { setTheme, toggleTheme, currentTheme } = useTheme()

// 设置主题
setTheme('dark')

// 切换主题
toggleTheme()
```

## 📱 移动端适配

项目使用 `lib-flexible` + `postcss-pxtorem` 实现移动端适配：

- 设计稿基准：375px
- 根字体大小：37.5px (1rem = 37.5px)
- 转换比例：1px = 1/37.5 rem

### 使用方式

直接使用 px 单位编写样式，构建时会自动转换为 rem：

```scss
.container {
  width: 375px; // 转换为 10rem
  height: 200px; // 转换为 5.33rem
  font-size: 14px; // 转换为 0.37rem
}
```

## 🔌 API 接口

### 请求封装

项目封装了基于 axios 的请求库，支持：

- 请求/响应拦截
- 错误处理
- 请求取消
- 自动重试

```javascript
import { http } from '@/services'

// GET 请求
const data = await http.get('/api/users', { page: 1 })

// POST 请求
const result = await http.post('/api/users', { name: 'John' })
```

### Mock 数据

开发环境支持 Mock 数据：

```bash
# 启用 Mock 数据
npm run dev:mock
```

## 🧩 组件开发

### 通用组件

项目提供了一系列通用组件：

- `PageContainer` - 页面容器
- `InfiniteList` - 无限滚动列表
- `FormBuilder` - 动态表单构建器
- `ThemeSwitch` - 主题切换器

### 业务组件

- `ProductCard` - 商品卡片
- `UserAvatar` - 用户头像

### 使用示例

```vue
<template>
  <PageContainer title="页面标题" left-arrow>
    <ProductCard :product="product" @click="handleClick" />
  </PageContainer>
</template>
```

## 🚀 部署

### 构建生产版本

```bash
npm run build
```

### 部署到不同平台

```bash
# 部署到 GitHub Pages
npm run deploy:git

# 部署到 FTP 服务器
npm run deploy:ftp

# 部署到阿里云 OSS
npm run deploy:oss
```

## 📊 性能优化

### 构建分析

```bash
# 分析打包体积
npm run analyze
```

### 优化建议

1. **代码分割** - 使用动态导入进行路由级别的代码分割
2. **组件懒加载** - 大型组件使用懒加载
3. **图片优化** - 使用 WebP 格式，启用懒加载
4. **缓存策略** - 合理设置静态资源缓存
5. **CDN 加速** - 将静态资源部署到 CDN

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Vant](https://vant-contrib.gitee.io/vant/) - 移动端组件库
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库

## 📞 支持

如果你觉得这个项目对你有帮助，请给它一个 ⭐️！

如果你有任何问题或建议，欢迎提交 [Issue](../../issues)。
