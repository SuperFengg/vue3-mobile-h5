/**
 * Mock数据服务
 */

// Mock数据生成器
export const mockData = {
  // 生成随机ID
  id() {
    return Date.now() + Math.random().toString(36).substr(2)
  },

  // 生成随机字符串
  string(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // 生成随机数字
  number(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  // 生成随机价格
  price(min = 1, max = 1000) {
    return (Math.random() * (max - min) + min).toFixed(2)
  },

  // 生成随机日期
  date(start = new Date(2020, 0, 1), end = new Date()) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  },

  // 生成随机图片URL
  image(width = 300, height = 300) {
    return `https://picsum.photos/${width}/${height}?random=${Math.random()}`
  },

  // 生成随机头像
  avatar() {
    const avatars = [
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png'
    ]
    return avatars[Math.floor(Math.random() * avatars.length)]
  },

  // 生成随机姓名
  name() {
    const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴']
    const lastNames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋']
    return firstNames[Math.floor(Math.random() * firstNames.length)] +
      lastNames[Math.floor(Math.random() * lastNames.length)]
  },

  // 生成随机手机号
  phone() {
    const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
    return prefix + suffix
  },

  // 生成随机邮箱
  email() {
    const domains = ['gmail.com', 'qq.com', '163.com', 'sina.com', 'hotmail.com']
    const username = this.string(8)
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return `${username}@${domain}`
  }
}

// Mock用户数据
export const mockUsers = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: mockData.name(),
  email: mockData.email(),
  phone: mockData.phone(),
  avatar: mockData.avatar(),
  createdAt: mockData.date(),
  status: Math.random() > 0.5 ? 'active' : 'inactive'
}))

// Mock商品数据
export const mockProducts = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `商品 ${index + 1}`,
  description: `这是商品 ${index + 1} 的描述信息`,
  price: mockData.price(10, 500),
  originalPrice: mockData.price(500, 1000),
  image: mockData.image(300, 300),
  images: Array.from({ length: 3 }, () => mockData.image(300, 300)),
  category: `分类 ${mockData.number(1, 5)}`,
  brand: `品牌 ${mockData.number(1, 10)}`,
  sales: mockData.number(0, 10000),
  stock: mockData.number(0, 100),
  rating: (Math.random() * 2 + 3).toFixed(1), // 3-5分
  reviewCount: mockData.number(0, 1000),
  tags: Array.from({ length: mockData.number(1, 3) }, (_, i) => ({
    id: i + 1,
    name: `标签${i + 1}`,
    type: ['primary', 'success', 'warning', 'danger'][Math.floor(Math.random() * 4)]
  })),
  isFavorite: Math.random() > 0.5,
  createdAt: mockData.date()
}))

// Mock API响应
export const mockResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data,
        timestamp: Date.now()
      })
    }, delay)
  })
}

// Mock分页响应
export const mockPaginatedResponse = (data, page = 1, pageSize = 10, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const items = data.slice(start, end)

      resolve({
        code: 0,
        message: 'success',
        data: {
          items,
          total: data.length,
          page,
          pageSize,
          totalPages: Math.ceil(data.length / pageSize)
        },
        timestamp: Date.now()
      })
    }, delay)
  })
}

// Mock错误响应
export const mockErrorResponse = (message = '请求失败', code = -1, delay = 500) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        code,
        message,
        timestamp: Date.now()
      })
    }, delay)
  })
}
