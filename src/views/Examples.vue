<template>
  <PageContainer title="综合示例" :show-nav-bar="true" left-arrow>
    <div class="examples-page">
      <!-- 商品列表示例 -->
      <van-cell-group title="商品列表示例">
        <div class="product-grid">
          <ProductCard
            v-for="product in mockProducts.slice(0, 4)"
            :key="product.id"
            :product="product"
            @click="handleProductClick"
            @favorite="handleProductFavorite"
            @add-cart="handleAddCart"
            @buy-now="handleBuyNow"
          />
        </div>
      </van-cell-group>

      <!-- 用户头像示例 -->
      <van-cell-group title="用户头像示例">
        <div class="avatar-examples">
          <div class="avatar-row">
            <UserAvatar
              v-for="size in ['small', 'medium', 'large']"
              :key="size"
              :size="size"
              :src="mockUsers[0].avatar"
              :name="mockUsers[0].name"
              :clickable="true"
              @click="handleAvatarClick"
            />
          </div>
          <div class="avatar-row">
            <UserAvatar
              v-for="user in mockUsers.slice(0, 3)"
              :key="user.id"
              :name="user.name"
              :show-online-status="true"
              :is-online="Math.random() > 0.5"
              :badge="Math.floor(Math.random() * 10)"
              :clickable="true"
            />
          </div>
        </div>
      </van-cell-group>

      <!-- 表单示例 -->
      <van-cell-group title="表单示例">
        <FormBuilder
          :form-config="formConfig"
          v-model="formData"
          :submitting="submitting"
          @submit="handleFormSubmit"
        />
      </van-cell-group>

      <!-- 无限列表示例 -->
      <van-cell-group title="无限列表示例">
        <div class="list-container">
          <InfiniteList
            :list="listData"
            :fetch-data="fetchListData"
            @update:list="listData = $event"
          >
            <template #default="{ item, index }">
              <van-cell
                :title="`项目 ${index + 1}`"
                :label="item.description"
                :value="item.value"
              />
            </template>
          </InfiniteList>
        </div>
      </van-cell-group>

      <!-- 主题切换示例 -->
      <van-cell-group title="主题切换示例">
        <div class="theme-examples">
          <div class="theme-row">
            <span class="label">单元格模式：</span>
            <ThemeSwitch mode="cell" />
          </div>
          <div class="theme-row">
            <span class="label">按钮模式：</span>
            <ThemeSwitch mode="button" button-type="primary" />
          </div>
          <div class="theme-row">
            <span class="label">开关模式：</span>
            <ThemeSwitch mode="switch" />
          </div>
          <div class="theme-row">
            <span class="label">选项模式：</span>
            <ThemeSwitch mode="options" />
          </div>
        </div>
      </van-cell-group>

      <!-- 响应式示例 -->
      <van-cell-group title="响应式示例">
        <div class="responsive-examples">
          <div class="responsive-text text-responsive">
            这是响应式文字，在不同屏幕尺寸下字体大小会自动调整
          </div>
          <div class="responsive-spacing p-md-responsive bg-surface">
            这是响应式间距容器
          </div>
          <div class="device-specific">
            <div class="d-mobile-only">只在移动端显示</div>
            <div class="d-desktop-only">只在桌面端显示</div>
          </div>
        </div>
      </van-cell-group>

      <!-- 页面示例 -->
      <van-cell-group title="页面示例">
        <van-cell
          title="移动端典型布局"
          label="完整的移动端页面布局示例"
          is-link
          @click="$router.push('/mobile-layout')"
        />
      </van-cell-group>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { toast } from '@/config/vant'
import { mockProducts, mockUsers, mockPaginatedResponse } from '@/services/mock'
import { productApi } from '@/services/api/product'

// 商品数据
const products = ref(mockProducts)
const users = ref(mockUsers)

// 表单数据
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  gender: '',
  interests: [],
  rating: 0,
  agreement: false
})

const submitting = ref(false)

// 表单配置
const formConfig = [
  {
    title: '基本信息',
    fields: [
      {
        name: 'name',
        label: '姓名',
        type: 'input',
        placeholder: '请输入姓名',
        rules: [{ required: true, message: '请输入姓名' }]
      },
      {
        name: 'email',
        label: '邮箱',
        type: 'input',
        inputType: 'email',
        placeholder: '请输入邮箱',
        rules: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱格式' }
        ]
      },
      {
        name: 'phone',
        label: '手机号',
        type: 'input',
        inputType: 'tel',
        placeholder: '请输入手机号',
        maxlength: 11
      }
    ]
  },
  {
    title: '其他信息',
    fields: [
      {
        name: 'gender',
        label: '性别',
        type: 'radio',
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ]
      },
      {
        name: 'interests',
        label: '兴趣爱好',
        type: 'checkbox',
        options: [
          { label: '阅读', value: 'reading' },
          { label: '运动', value: 'sports' },
          { label: '音乐', value: 'music' },
          { label: '旅行', value: 'travel' }
        ]
      },
      {
        name: 'rating',
        label: '评分',
        type: 'rate',
        count: 5
      },
      {
        name: 'agreement',
        label: '同意协议',
        type: 'switch'
      }
    ]
  }
]

// 列表数据
const listData = ref([])

// 处理商品点击
const handleProductClick = (product) => {
  toast.success(`点击了商品: ${product.name}`)
}

// 处理商品收藏（带乐观更新与并发保护）
const favoritingMap = reactive(new Map())
const handleProductFavorite = async (product) => {
  if (!product || !product.id || favoritingMap.get(product.id)) return
  favoritingMap.set(product.id, true)
  const nextState = !product.isFavorite
  // 乐观更新
  product.isFavorite = nextState
  try {
    if (nextState) {
      await productApi.favoriteProduct(product.id)
    } else {
      await productApi.unfavoriteProduct(product.id)
    }
    toast.success(nextState ? '已收藏' : '已取消收藏')
  } catch (err) {
    // 回滚
    product.isFavorite = !nextState
    toast.fail('操作失败，请重试')
    console.error('收藏操作失败:', err)
  } finally {
    favoritingMap.delete(product.id)
  }
}

// 处理加购物车
const handleAddCart = (product) => {
  toast.success(`${product.name} 已加入购物车`)
}

// 处理立即购买
const handleBuyNow = (product) => {
  toast.success(`立即购买 ${product.name}`)
}

// 处理头像点击
const handleAvatarClick = (avatar) => {
  toast.success(`点击了头像: ${avatar.name}`)
}

// 处理表单提交
const handleFormSubmit = (values) => {
  submitting.value = true

  setTimeout(() => {
    submitting.value = false
    toast.success('表单提交成功')
    console.log('表单数据:', values)
  }, 2000)
}

// 获取列表数据
const fetchListData = async ({ page, pageSize }) => {
  const mockData = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    description: `这是第 ${index + 1} 项的描述`,
    value: `值 ${index + 1}`
  }))

  return mockPaginatedResponse(mockData, page, pageSize, 1000)
}
</script>

<style lang="scss" scoped>
.examples-page {
  .product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px;
  }

  .avatar-examples {
    padding: 16px;

    .avatar-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .list-container {
    height: 300px;
    border: 1px solid var(--color-border);
    border-radius: $border-radius-md;
    overflow: hidden;
  }

  .theme-examples {
    padding: 16px;

    .theme-row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        min-width: 100px;
        font-size: $font-size-sm;
        color: var(--color-text-secondary);
      }
    }
  }

  .responsive-examples {
    padding: 16px;

    .responsive-text {
      margin-bottom: 16px;
      color: var(--color-text-primary);
    }

    .responsive-spacing {
      margin-bottom: 16px;
      border-radius: $border-radius-md;
      color: var(--color-text-primary);
    }

    .device-specific {
      div {
        padding: 8px;
        margin-bottom: 8px;
        background-color: var(--color-background-light);
        border-radius: $border-radius-sm;
        text-align: center;
        color: var(--color-text-secondary);
        font-size: $font-size-sm;
      }
    }
  }
}

:deep(.van-cell-group) {
  margin-bottom: 16px;
}

:deep(.van-cell-group__title) {
  padding: 16px 16px 8px;
  color: var(--color-text-primary);
  font-size: $font-size-md;
  font-weight: 600;
}
</style>
