<template>
  <div class="infinite-list">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="handleRefresh"
      :disabled="!enablePullRefresh"
    >
      <van-list
        v-model:loading="loading"
        v-model:error="error"
        :finished="finished"
        :finished-text="finishedText"
        :error-text="errorText"
        :loading-text="loadingText"
        @load="handleLoad"
      >
        <template v-for="(item, index) in list" :key="getItemKey(item, index)">
          <slot :item="item" :index="index" />
        </template>

        <!-- 空状态 -->
        <van-empty
          v-if="showEmpty"
          :image="emptyImage"
          :description="emptyDescription"
        >
          <template v-if="$slots.empty" #default>
            <slot name="empty" />
          </template>
        </van-empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  // 数据相关
  list: {
    type: Array,
    default: () => []
  },
  fetchData: {
    type: Function,
    required: true
  },
  itemKey: {
    type: [String, Function],
    default: 'id'
  },

  // 分页相关
  pageSize: {
    type: Number,
    default: 10
  },

  // 功能开关
  enablePullRefresh: {
    type: Boolean,
    default: true
  },
  autoLoad: {
    type: Boolean,
    default: true
  },

  // 文案配置
  loadingText: {
    type: String,
    default: '加载中...'
  },
  finishedText: {
    type: String,
    default: '没有更多了'
  },
  errorText: {
    type: String,
    default: '请求失败，点击重新加载'
  },
  emptyDescription: {
    type: String,
    default: '暂无数据'
  },
  emptyImage: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['update:list', 'refresh', 'load-more'])

// 状态管理
const loading = ref(false)
const refreshing = ref(false)
const error = ref(false)
const finished = ref(false)
const currentPage = ref(1)

// 计算属性
const showEmpty = computed(() => {
  return !loading.value && !refreshing.value && props.list.length === 0
})

// 获取项目的key
const getItemKey = (item, index) => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index)
  }
  return item[props.itemKey] || index
}

// 加载数据
  const loadData = async (page = 1, isRefresh = false) => {
  try {
    loading.value = true
    error.value = false

    const response = await props.fetchData({
      page,
      pageSize: props.pageSize
    })

    // 兼容多种返回结构：
    // 1) { data: Item[], total }
    // 2) { data: { items: Item[], total, ... } }
    // 3) { items: Item[], total }
    // 4) 直接返回 Item[]
    let data = []
    let total = 0

    if (Array.isArray(response)) {
      data = response
    } else if (Array.isArray(response?.data)) {
      data = response.data
      total = response.total ?? 0
    } else if (Array.isArray(response?.data?.items)) {
      data = response.data.items
      total = response.data.total ?? response.total ?? 0
    } else if (Array.isArray(response?.items)) {
      data = response.items
      total = response.total ?? 0
    }

    if (isRefresh) {
      emit('update:list', data)
      currentPage.value = 1
    } else {
      emit('update:list', [...props.list, ...data])
    }

    // 判断是否还有更多数据
    const totalLoaded = isRefresh ? data.length : props.list.length + data.length
    finished.value = totalLoaded >= total || data.length < props.pageSize

    if (!isRefresh) {
      currentPage.value = page
    }

    if (isRefresh) {
      emit('refresh', { data, total })
    } else {
      emit('load-more', { data, total, page })
    }

  } catch (err) {
    error.value = true
    console.error('加载数据失败:', err)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 处理下拉刷新
const handleRefresh = () => {
  finished.value = false
  currentPage.value = 1
  loadData(1, true)
}

// 处理加载更多
const handleLoad = () => {
  if (finished.value) return
  loadData(currentPage.value + 1, false)
}

// 重置列表
const reset = () => {
  currentPage.value = 1
  finished.value = false
  error.value = false
  loading.value = false
  refreshing.value = false
  emit('update:list', [])
}

// 手动刷新
const refresh = () => {
  handleRefresh()
}

// 监听列表变化
watch(() => props.list, (newList) => {
  if (newList.length === 0 && !loading.value && !refreshing.value) {
    finished.value = false
  }
}, { immediate: true })

// 自动加载
if (props.autoLoad && props.list.length === 0) {
  loadData(1, true)
}

// 暴露方法给父组件
defineExpose({
  refresh,
  reset,
  loadData
})
</script>

<style lang="scss" scoped>
.infinite-list {
  height: 100%;

  :deep(.van-pull-refresh) {
    height: 100%;
  }

  :deep(.van-list) {
    height: 100%;
  }

  :deep(.van-empty) {
    padding: 60px 0;
  }
}
</style>
