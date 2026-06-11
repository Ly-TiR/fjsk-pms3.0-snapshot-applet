import { useUserStore } from '@/store'
import { needLoginPages } from '@/utils'

const loginRoute = import.meta.env.VITE_LOGIN_URL || '/pages/login/login'

function isLogined() {
  const userStore = useUserStore()
  return !!userStore.userInfo.token
}

const navigateToInterceptor = {
  invoke({ url }: { url: string }) {
    let path = url.split('?')[0]
    if (!path.startsWith('/')) {
      const pages = getCurrentPages()
      const current = pages[pages.length - 1]
      const currentPath = `/${current.route}`
      const baseDir = currentPath.substring(0, currentPath.lastIndexOf('/'))
      path = `${baseDir}/${path}`
    }
    const isNeedLogin = needLoginPages.includes(path)
    if (!isNeedLogin) return true
    if (isLogined()) return true
    const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
    uni.navigateTo({ url: redirectRoute })
    return false
  },
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)
  },
}
