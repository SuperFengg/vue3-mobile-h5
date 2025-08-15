/**
 * 用户相关API
 */

import { http } from '../request'

export const userApi = {
  // 用户登录
  login(data) {
    return http.post('/auth/login', data)
  },

  // 用户注册
  register(data) {
    return http.post('/auth/register', data)
  },

  // 退出登录
  logout() {
    return http.post('/auth/logout')
  },

  // 获取用户信息
  getUserInfo() {
    return http.get('/user/profile')
  },

  // 更新用户信息
  updateUserInfo(data) {
    return http.put('/user/profile', data)
  },

  // 修改密码
  changePassword(data) {
    return http.post('/user/change-password', data)
  },

  // 上传头像
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return http.upload('/user/avatar', formData)
  },

  // 获取用户设置
  getUserSettings() {
    return http.get('/user/settings')
  },

  // 更新用户设置
  updateUserSettings(data) {
    return http.put('/user/settings', data)
  },

  // 绑定手机号
  bindPhone(data) {
    return http.post('/user/bind-phone', data)
  },

  // 绑定邮箱
  bindEmail(data) {
    return http.post('/user/bind-email', data)
  },

  // 发送验证码
  sendVerifyCode(data) {
    return http.post('/auth/send-code', data)
  },

  // 验证验证码
  verifyCode(data) {
    return http.post('/auth/verify-code', data)
  }
}
