import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { pinia, initializeStores } from './stores'

// 导入移动端适配
import 'lib-flexible'
import { disableZoom, handleIOSSafeArea } from './utils/flexible'

// 导入Vant样式
import 'vant/lib/index.css'
// 注册 Vant 指令/插件（启用 Image 懒加载）
import { Lazyload } from 'vant'

// 导入Vant配置
import './config/vant'

// 导入全局组件
import installComponents from './components'

// 导入全局错误处理
import { setupErrorHandler } from './utils/errorHandler'

// 导入服务层
import { initializeServices } from './services'

// 导入主题管理器
import { ThemePlugin } from './utils/theme'
import { EventBusPlugin } from './utils/eventBus'

// 导入全局样式
import './styles/global.scss'
import './styles/vant-theme.scss'

// 初始化移动端适配
disableZoom()
handleIOSSafeArea()

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Lazyload)

// 注册全局组件
installComponents(app)

// 注册主题插件
app.use(ThemePlugin)
// 注册事件总线插件
app.use(EventBusPlugin)

// 设置全局错误处理
setupErrorHandler(app)

// 初始化服务层
initializeServices()

// 初始化所有 stores
initializeStores()

app.mount('#app')
