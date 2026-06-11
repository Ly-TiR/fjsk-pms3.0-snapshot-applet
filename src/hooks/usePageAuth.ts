import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { needLoginPages } from '@/utils'

const loginRoute = import.meta.env.VITE_LOGIN_URL || '/pages/login/login'

export function usePageAuth() {
  onLoad((options) => {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const currentPath = `/${currentPage.route}`

    const isNeedLogin = needLoginPages.includes(currentPath)
    if (!isNeedLogin) return

    const userStore = useUserStore()
    if (userStore.isLoggedIn) return

    const queryString = Object.entries(options || {})
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&')
    const currentFullPath = queryString ? `${currentPath}?${queryString}` : currentPath
    const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(currentFullPath)}`
    uni.redirectTo({ url: redirectRoute })
  })
}
