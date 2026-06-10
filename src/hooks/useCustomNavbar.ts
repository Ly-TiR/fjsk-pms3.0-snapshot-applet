/**
 * 自定义导航栏高度计算 Hook
 */
export function useCustomNavbar() {
  const statusBarHeight = ref(0)
  const navContentHeight = ref('132rpx')

  onMounted(() => {
    const info = uni.getSystemInfoSync()
    statusBarHeight.value = info.statusBarHeight || 20
    try {
      const rect = uni.getMenuButtonBoundingClientRect && uni.getMenuButtonBoundingClientRect()
      if (rect && rect.height) {
        navContentHeight.value = rect.height + 'px'
      }
    }
    catch {
      // 非微信平台维持默认高度
    }
  })

  return {
    statusBarHeight,
    navContentHeight,
  }
}
