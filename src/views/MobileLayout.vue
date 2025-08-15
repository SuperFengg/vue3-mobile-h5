<template>
  <PageContainer
    title="移动端布局"
    :show-nav-bar="true"
    left-arrow
    :padding="0"
  >
    <!-- 轮播图 -->
    <div class="banner-section">
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="banner in banners" :key="banner.id">
          <van-image
            :src="banner.image"
            :alt="banner.title"
            fit="cover"
            width="100%"
            height="200px"
          />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 功能导航 -->
    <div class="nav-section">
      <van-grid :column-num="4" :gutter="0">
        <van-grid-item
          v-for="nav in navItems"
          :key="nav.id"
          :icon="nav.icon"
          :text="nav.text"
          @click="handleNavClick(nav)"
        />
      </van-grid>
    </div>

    <!-- 公告栏 -->
    <div class="notice-section">
      <van-notice-bar
        left-icon="volume-o"
        :text="noticeText"
        scrollable
      />
    </div>

    <!-- 商品推荐 -->
    <div class="recommend-section">
      <div class="section-header">
        <h3>推荐商品</h3>
        <van-button type="primary" size="mini" plain>更多</van-button>
      </div>

      <div class="product-list">
        <ProductCard
          v-for="product in recommendProducts"
          :key="product.id"
          :product="product"
          card-mode="horizontal"
          :show-actions="false"
          @click="handleProductClick"
        />
      </div>
    </div>

    <!-- 分类商品 -->
    <div class="category-section">
      <van-tabs v-model:active="activeCategory" @change="handleCategoryChange">
        <van-tab
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
        >
          <div class="category-products">
            <div class="product-grid">
              <ProductCard
                v-for="product in getCategoryProducts(category.id)"
                :key="product.id"
                :product="product"
                @click="handleProductClick"
                @favorite="handleProductFavorite"
              />
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-actions">
      <van-action-bar>
        <van-action-bar-icon
          icon="chat-o"
          text="客服"
          @click="handleContact"
        />
        <van-action-bar-icon
          icon="cart-o"
          text="购物车"
          :badge="cartCount"
          @click="handleCart"
        />
        <van-action-bar-icon
          icon="star-o"
          text="收藏"
          @click="handleFavorite"
        />
        <van-action-bar-button
          type="warning"
          text="加入购物车"
          @click="handleAddCart"
        />
        <van-action-bar-button
          type="danger"
          text="立即购买"
          @click="handleBuyNow"
        />
      </van-action-bar>
    </div>

    <!-- 返回顶部 -->
    <van-back-top />
  </PageContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { toast } from '@/config/vant'
import { mockProducts, mockData } from '@/services/mock'

// 轮播图数据
const banners = ref([
  {
    id: 1,
    title: '轮播图1',
    image: mockData.image(375, 200)
  },
  {
    id: 2,
    title: '轮播图2',
    image: mockData.image(375, 200)
  },
  {
    id: 3,
    title: '轮播图3',
    image: mockData.image(375, 200)
  }
])

// 导航项目
const navItems = ref([
  { id: 1, icon: 'shop-o', text: '商城' },
  { id: 2, icon: 'coupon-o', text: '优惠券' },
  { id: 3, icon: 'points', text: '积分' },
  { id: 4, icon: 'gift-o', text: '礼品' },
  { id: 5, icon: 'service-o', text: '服务' },
  { id: 6, icon: 'location-o', text: '门店' },
  { id: 7, icon: 'phone-o', text: '客服' },
  { id: 8, icon: 'more-o', text: '更多' }
])

// 公告文本
const noticeText = ref('欢迎使用Vue3移动端H5项目，这是一个功能完整的移动端应用示例！')

// 推荐商品
const recommendProducts = ref(mockProducts.slice(0, 3))

// 分类数据
const categories = ref([
  { id: 1, name: '热门' },
  { id: 2, name: '新品' },
  { id: 3, name: '特价' },
  { id: 4, name: '推荐' }
])

const activeCategory = ref(0)
const cartCount = ref(3)

// 获取分类商品
const getCategoryProducts = (categoryId) => {
  const start = (categoryId - 1) * 4
  return mockProducts.slice(start, start + 4)
}

// 处理导航点击
const handleNavClick = (nav) => {
  toast.success(`点击了 ${nav.text}`)
}

// 处理商品点击
const handleProductClick = (product) => {
  toast.success(`查看商品: ${product.name}`)
}

// 处理商品收藏
const handleProductFavorite = (product) => {
  product.isFavorite = !product.isFavorite
  toast.success(product.isFavorite ? '已收藏' : '已取消收藏')
}

// 处理分类切换
const handleCategoryChange = (index) => {
  console.log('切换到分类:', categories.value[index].name)
}

// 底部操作处理
const handleContact = () => {
  toast.success('联系客服')
}

const handleCart = () => {
  toast.success('查看购物车')
}

const handleFavorite = () => {
  toast.success('查看收藏')
}

const handleAddCart = () => {
  cartCount.value++
  toast.success('已加入购物车')
}

const handleBuyNow = () => {
  toast.success('立即购买')
}
</script>

<style lang="scss" scoped>
.banner-section {
  .van-swipe {
    height: 200px;
  }
}

.nav-section {
  background-color: var(--color-surface);
  padding: 16px 0;

  :deep(.van-grid-item__content) {
    padding: 16px 8px;
  }

  :deep(.van-grid-item__icon) {
    font-size: 24px;
    color: var(--color-primary);
    margin-bottom: 8px;
  }

  :deep(.van-grid-item__text) {
    color: var(--color-text-primary);
    font-size: $font-size-xs;
  }
}

.notice-section {
  margin: 8px 16px;
}

.recommend-section {
  background-color: var(--color-surface);
  margin-top: 8px;
  padding: 16px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: $font-size-lg;
      color: var(--color-text-primary);
      font-weight: 600;
    }
  }

  .product-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.category-section {
  background-color: var(--color-surface);
  margin-top: 8px;

  .category-products {
    padding: 16px;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);

  @include safe-area-insets(padding, bottom);
}

// 确保内容不被底部操作栏遮挡
:deep(.page-content) {
  padding-bottom: 60px;
}
</style>
