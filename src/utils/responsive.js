/**
 * 响应式断点工具
 */

// 断点配置
export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
}

// 获取当前断点
export function getCurrentBreakpoint() {
  const width = window.innerWidth

  if (width < breakpoints.xs) return 'xs'
  if (width < breakpoints.sm) return 'sm'
  if (width < breakpoints.md) return 'md'
  if (width < breakpoints.lg) return 'lg'
  if (width < breakpoints.xl) return 'xl'
  return 'xxl'
}

// 判断是否匹配断点
export function matchBreakpoint(breakpoint) {
  const width = window.innerWidth

  switch (breakpoint) {
    case 'xs':
      return width < breakpoints.xs
    case 'sm':
      return width >= breakpoints.sm && width < breakpoints.md
    case 'md':
      return width >= breakpoints.md && width < breakpoints.lg
    case 'lg':
      return width >= breakpoints.lg && width < breakpoints.xl
    case 'xl':
      return width >= breakpoints.xl && width < breakpoints.xxl
    case 'xxl':
      return width >= breakpoints.xxl
    default:
      return false
  }
}

// 监听断点变化
export function watchBreakpointChange(callback) {
  let currentBreakpoint = getCurrentBreakpoint()

  const handleResize = () => {
    const newBreakpoint = getCurrentBreakpoint()
    if (newBreakpoint !== currentBreakpoint) {
      currentBreakpoint = newBreakpoint
      callback && callback(newBreakpoint)
    }
  }

  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
  }
}

// 创建媒体查询监听器
export function createMediaQuery(query, callback) {
  const mediaQuery = window.matchMedia(query)

  const handleChange = (e) => {
    callback && callback(e.matches)
  }

  mediaQuery.addListener(handleChange)

  // 立即执行一次
  handleChange(mediaQuery)

  return () => {
    mediaQuery.removeListener(handleChange)
  }
}
