<template>
  <div class="product-card" @click="handleClick">
    <div class="product-image">
      <van-image
        :src="product.image"
        :alt="product.name"
        fit="cover"
        :lazy-load="lazyLoad"
      >
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
        <template #error>
          <van-icon name="photo-fail" size="20" />
        </template>
      </van-image>

      <!-- 标签 -->
      <div v-if="product.tags && product.tags.length" class="product-tags">
        <van-tag
          v-for="tag in product.tags.slice(0, 2)"
          :key="tag.id"
          :type="tag.type || 'primary'"
          size="mini"
        >
          {{ tag.name }}
        </van-tag>
      </div>

      <!-- 收藏按钮 -->
      <div v-if="showFavorite" class="favorite-btn" @click.stop="handleFavorite">
        <van-icon
          :name="product.isFavorite ? 'heart' : 'heart-o'"
          :color="product.isFavorite ? '#ee0a24' : '#969799'"
          size="18"
        />
      </div>
    </div>

    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p v-if="product.description" class="product-desc">{{ product.description }}</p>

      <div class="product-price">
        <span class="current-price">¥{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
          ¥{{ formatPrice(product.originalPrice) }}
        </span>
      </div>

      <div v-if="showRating && product.rating" class="product-rating">
        <van-rate
          :model-value="Number(product.rating)"
          :size="12"
          :count="5"
          :allow-half="true"
          readonly
        />
        <span class="rating-text">({{ product.reviewCount || 0 }})</span>
      </div>

      <div v-if="showSales && product.sales" class="product-sales">
        已售 {{ product.sales }}
      </div>
    </div>

    <!-- 操作按钮 -->
    <div v-if="showActions" class="product-actions">
      <van-button
        v-if="showAddCart"
        size="small"
        type="primary"
        @click.stop="handleAddCart"
      >
        加购物车
      </van-button>
      <van-button
        v-if="showBuyNow"
        size="small"
        type="danger"
        @click.stop="handleBuyNow"
      >
        立即购买
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 商品数据
  product: {
    type: Object,
    required: true
  },

  // 显示控制
  lazyLoad: {
    type: Boolean,
    default: true
  },
  showFavorite: {
    type: Boolean,
    default: true
  },
  showRating: {
    type: Boolean,
    default: true
  },
  showSales: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showAddCart: {
    type: Boolean,
    default: true
  },
  showBuyNow: {
    type: Boolean,
    default: true
  },

  // 样式控制
  cardMode: {
    type: String,
    default: 'vertical', // vertical | horizontal
    validator: (value) => ['vertical', 'horizontal'].includes(value)
  }
})

const emit = defineEmits([
  'click',
  'favorite',
  'add-cart',
  'buy-now'
])

// 格式化价格
const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

// 处理卡片点击
const handleClick = () => {
  emit('click', props.product)
}

// 处理收藏
const handleFavorite = () => {
  emit('favorite', props.product)
}

// 处理加购物车
const handleAddCart = () => {
  emit('add-cart', props.product)
}

// 处理立即购买
const handleBuyNow = () => {
  emit('buy-now', props.product)
}
</script>

<style lang="scss" scoped>
.product-card {
  background-color: $white;
  border-radius: $border-radius-md;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: $box-shadow;
  }
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;

  .van-image {
    width: 100%;
    height: 100%;
  }

  .product-tags {
    position: absolute;
    top: 8px;
    left: 8px;
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .favorite-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  }
}

.product-info {
  padding: 12px;

  .product-name {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-color;
    margin: 0 0 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .product-desc {
    font-size: $font-size-sm;
    color: $text-color-2;
    margin: 0 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .product-price {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 8px;

    .current-price {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $danger-color;
    }

    .original-price {
      font-size: $font-size-sm;
      color: $text-color-3;
      text-decoration: line-through;
    }
  }

  .product-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;

    .rating-text {
      font-size: $font-size-xs;
      color: $text-color-3;
    }
  }

  .product-sales {
    font-size: $font-size-xs;
    color: $text-color-3;
  }
}

.product-actions {
  padding: 0 12px 12px;
  display: flex;
  gap: 8px;

  .van-button {
    flex: 1;
  }
}

// 水平布局
.product-card.horizontal {
  display: flex;

  .product-image {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
  }

  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .product-actions {
    padding: 12px;
    flex-direction: column;
    justify-content: center;

    .van-button {
      flex: none;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
