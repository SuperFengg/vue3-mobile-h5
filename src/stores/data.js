import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', () => {
  // 缓存数据
  const cache = ref(new Map())
  const loading = ref(new Set())
  const errors = ref(new Map())

  // 列表数据
  const lists = ref(new Map())
  const pagination = ref(new Map())

  // 计算属性
  const isLoading = computed(() => (key) => loading.value.has(key))
  const getError = computed(() => (key) => errors.value.get(key))
  const getCacheData = computed(() => (key) => cache.value.get(key))
  const getListData = computed(() => (key) => lists.value.get(key) || [])
  const getPagination = computed(() => (key) => pagination.value.get(key) || {
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true
  })

  // Actions
  const setLoading = (key, status) => {
    if (status) {
      loading.value.add(key)
    } else {
      loading.value.delete(key)
    }
  }

  const setError = (key, error) => {
    if (error) {
      errors.value.set(key, error)
    } else {
      errors.value.delete(key)
    }
  }

  const setCacheData = (key, data, ttl = 5 * 60 * 1000) => {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl
    }
    cache.value.set(key, cacheItem)
  }

  const setListData = (key, data, replace = true) => {
    if (replace) {
      lists.value.set(key, data)
    } else {
      const existingData = lists.value.get(key) || []
      lists.value.set(key, [...existingData, ...data])
    }
  }

  const setPagination = (key, paginationData) => {
    const existing = pagination.value.get(key) || {}
    pagination.value.set(key, { ...existing, ...paginationData })
  }

  const clearCache = (key) => {
    if (key) {
      cache.value.delete(key)
    } else {
      cache.value.clear()
    }
  }

  const clearList = (key) => {
    if (key) {
      lists.value.delete(key)
      pagination.value.delete(key)
    } else {
      lists.value.clear()
      pagination.value.clear()
    }
  }

  const isCacheValid = (key) => {
    const cacheItem = cache.value.get(key)
    if (!cacheItem) return false

    const { timestamp, ttl } = cacheItem
    return Date.now() - timestamp < ttl
  }

  const fetchData = async (key, fetchFn, options = {}) => {
    const { useCache = true, ttl = 5 * 60 * 1000 } = options

    // 检查缓存
    if (useCache && isCacheValid(key)) {
      return getCacheData.value(key).data
    }

    try {
      setLoading(key, true)
      setError(key, null)

      const data = await fetchFn()

      if (useCache) {
        setCacheData(key, data, ttl)
      }

      return data
    } catch (error) {
      setError(key, error.message || '请求失败')
      throw error
    } finally {
      setLoading(key, false)
    }
  }

  const fetchListData = async (key, fetchFn, options = {}) => {
    const {
      page = 1,
      pageSize = 10,
      append = false,
      useCache = false
    } = options

    try {
      setLoading(key, true)
      setError(key, null)

      const response = await fetchFn({ page, pageSize })
      const { data, total } = response

      setListData(key, data, !append)
      setPagination(key, {
        page,
        pageSize,
        total,
        hasMore: data.length === pageSize && (page * pageSize) < total
      })

      if (useCache) {
        setCacheData(`${key}-${page}`, response)
      }

      return response
    } catch (error) {
      setError(key, error.message || '请求失败')
      throw error
    } finally {
      setLoading(key, false)
    }
  }

  const loadMore = async (key, fetchFn) => {
    const currentPagination = getPagination.value(key)
    if (!currentPagination.hasMore || isLoading.value(key)) {
      return
    }

    const nextPage = currentPagination.page + 1
    return fetchListData(key, fetchFn, {
      page: nextPage,
      pageSize: currentPagination.pageSize,
      append: true
    })
  }

  const refresh = async (key, fetchFn, options = {}) => {
    clearCache(key)
    clearList(key)

    if (options.isList) {
      return fetchListData(key, fetchFn, { ...options, page: 1 })
    } else {
      return fetchData(key, fetchFn, { ...options, useCache: false })
    }
  }

  return {
    // State
    cache,
    loading,
    errors,
    lists,
    pagination,

    // Getters
    isLoading,
    getError,
    getCacheData,
    getListData,
    getPagination,

    // Actions
    setLoading,
    setError,
    setCacheData,
    setListData,
    setPagination,
    clearCache,
    clearList,
    isCacheValid,
    fetchData,
    fetchListData,
    loadMore,
    refresh
  }
})
