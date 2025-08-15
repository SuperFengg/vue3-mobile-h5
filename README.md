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
  width: 375px;    // 转换为 10rem
  height: 200px;   // 转换为 5.33rem
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
    <ProductCard 
      :product="product" 
      @click="handleClick"
    />
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
