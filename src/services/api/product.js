/**
 * 商品相关API
 */

import { http } from '../request'

export const productApi = {
  // 获取商品列表
  getProductList(params = {}) {
    return http.get('/products', params)
  },

  // 获取商品详情
  getProductDetail(id) {
    return http.get(`/products/${id}`)
  },

  // 搜索商品
  searchProducts(params = {}) {
    return http.get('/products/search', params)
  },

  // 获取商品分类
  getCategories(parentId = 0) {
    return http.get('/categories', { parentId })
  },

  // 获取分类商品
  getCategoryProducts(categoryId, params = {}) {
    return http.get(`/categories/${categoryId}/products`, params)
  },

  // 获取推荐商品
  getRecommendProducts(params = {}) {
    return http.get('/products/recommend', params)
  },

  // 获取热门商品
  getHotProducts(params = {}) {
    return http.get('/products/hot', params)
  },

  // 获取新品
  getNewProducts(params = {}) {
    return http.get('/products/new', params)
  },

  // 收藏商品
  favoriteProduct(productId) {
    return http.post(`/products/${productId}/favorite`)
  },

  // 取消收藏
  unfavoriteProduct(productId) {
    return http.delete(`/products/${productId}/favorite`)
  },

  // 获取收藏列表
  getFavoriteProducts(params = {}) {
    return http.get('/user/favorites', params)
  },

  // 获取商品评价
  getProductReviews(productId, params = {}) {
    return http.get(`/products/${productId}/reviews`, params)
  },

  // 提交商品评价
  submitProductReview(productId, data) {
    return http.post(`/products/${productId}/reviews`, data)
  },

  // 获取商品规格
  getProductSpecs(productId) {
    return http.get(`/products/${productId}/specs`)
  },

  // 获取商品库存
  getProductStock(productId, specId) {
    return http.get(`/products/${productId}/stock`, { specId })
  }
}
