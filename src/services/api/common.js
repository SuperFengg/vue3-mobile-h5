/**
 * 通用API
 */

import { http } from '../request'

export const commonApi = {
  // 获取配置信息
  getConfig() {
    return http.get('/config')
  },

  // 获取字典数据
  getDictionary(type) {
    return http.get('/dictionary', { type })
  },

  // 文件上传
  uploadFile(file, type = 'image') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return http.upload('/upload', formData)
  },

  // 批量文件上传
  uploadFiles(files, type = 'image') {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })
    formData.append('type', type)
    return http.upload('/upload/batch', formData)
  },

  // 获取地区数据
  getRegions(parentId = 0) {
    return http.get('/regions', { parentId })
  },

  // 搜索建议
  getSearchSuggestions(keyword) {
    return http.get('/search/suggestions', { keyword })
  },

  // 获取轮播图
  getBanners(position = 'home') {
    return http.get('/banners', { position })
  },

  // 获取公告列表
  getNotices(params = {}) {
    return http.get('/notices', params)
  },

  // 获取公告详情
  getNoticeDetail(id) {
    return http.get(`/notices/${id}`)
  },

  // 意见反馈
  submitFeedback(data) {
    return http.post('/feedback', data)
  },

  // 举报
  submitReport(data) {
    return http.post('/report', data)
  },

  // 获取版本信息
  getVersionInfo() {
    return http.get('/version')
  },

  // 检查更新
  checkUpdate() {
    return http.get('/version/check')
  }
}
