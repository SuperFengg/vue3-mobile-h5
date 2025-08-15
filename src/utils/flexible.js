/**
 * 移动端适配工具函数
 */

// 获取设备像素比
export function getDevicePixelRatio() {
  return window.devicePixelRatio || 1
}

// 获取视口宽度
export function getViewportWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}

// 获取视口高度
export function getViewportHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}

// 判断是否为移动设备
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 判断是否为iOS设备
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

// 判断是否为Android设备
export function isAndroid() {
  return /Android/.test(navigator.userAgent)
}

// 判断是否为微信浏览器
export function isWeChat() {
  return /MicroMessenger/i.test(navigator.userAgent)
}

// 设置根字体大小
export function setRootFontSize() {
  const viewportWidth = getViewportWidth()
  const rootFontSize = viewportWidth / 10 // 10rem = 视口宽度
  document.documentElement.style.fontSize = rootFontSize + 'px'
}

// 监听窗口大小变化
export function watchViewportChange(callback) {
  let timer = null
  const handleResize = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback && callback()
    }, 100)
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleResize)
  }
}

// 禁止页面缩放
export function disableZoom() {
  document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })

  let lastTouchEnd = 0
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime()
    if (now - lastTouchEnd <= 300) {
      event.preventDefault()
    }
    lastTouchEnd = now
  }, false)
}

// 处理iOS安全区域
export function handleIOSSafeArea() {
  if (isIOS()) {
    const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top')
    const safeAreaBottom = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom')

    if (safeAreaTop) {
      document.documentElement.style.setProperty('--status-bar-height', safeAreaTop)
    }

    if (safeAreaBottom) {
      document.documentElement.style.setProperty('--safe-area-bottom', safeAreaBottom)
    }
  }
}
