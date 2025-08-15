/**
 * 全局组件注册
 */

// 通用组件
import PageContainer from './common/PageContainer.vue'
import InfiniteList from './common/InfiniteList.vue'
import FormBuilder from './common/FormBuilder.vue'
import StateDemo from './common/StateDemo.vue'
import ThemeSwitch from './common/ThemeSwitch.vue'

// 业务组件
import ProductCard from './business/ProductCard.vue'
import UserAvatar from './business/UserAvatar.vue'

// 组件列表
const components = [
  PageContainer,
  InfiniteList,
  FormBuilder,
  StateDemo,
  ThemeSwitch,
  ProductCard,
  UserAvatar
]

// 安装插件
export default function installComponents(app) {
  components.forEach(component => {
    app.component(component.name || component.__name, component)
  })
}

// 按需导出
export {
  PageContainer,
  InfiniteList,
  FormBuilder,
  StateDemo,
  ThemeSwitch,
  ProductCard,
  UserAvatar
}
