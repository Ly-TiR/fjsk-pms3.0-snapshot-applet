/**
 * 需要登录才能访问的页面列表
 */
export const needLoginPages = [
  '/pages/index/index',
  '/pages/workbench/index',
  '/pages/ledger/index',
  '/pages/create/index',
  '/pages/detail/index',
  '/pages/mine/index',
  '/pages/ai-workbench/index',
  '/pages/task-list/index',
  '/pages/mine-initiated/index',
  '/pages/messages/index',
  '/pages/profile/index',
  '/pages/settings/index',
]

/**
 * 获取环境变量中的 baseUrl
 */
export function getEnvBaseUrl() {
  const { VITE_SERVER_BASEURL } = import.meta.env
  // 微信小程序可根据环境切换
  // #ifdef MP-WEIXIN
  const accountInfo = uni.getAccountInfoSync?.()
  if (accountInfo) {
    const { envVersion } = accountInfo.miniProgram
    if (envVersion === 'develop') {
      return import.meta.env.VITE_SERVER_BASEURL__WEIXIN_DEVELOP || VITE_SERVER_BASEURL
    }
    if (envVersion === 'trial') {
      return import.meta.env.VITE_SERVER_BASEURL__WEIXIN_TRIAL || VITE_SERVER_BASEURL
    }
    if (envVersion === 'release') {
      return import.meta.env.VITE_SERVER_BASEURL__WEIXIN_RELEASE || VITE_SERVER_BASEURL
    }
  }
  // #endif
  return VITE_SERVER_BASEURL
}

/**
 * 获取环境变量中的 uploadUrl
 */
export function getEnvBaseUploadUrl() {
  const { VITE_UPLOAD_BASEURL } = import.meta.env
  // #ifdef MP-WEIXIN
  const accountInfo = uni.getAccountInfoSync?.()
  if (accountInfo) {
    const { envVersion } = accountInfo.miniProgram
    if (envVersion === 'develop') {
      return import.meta.env.VITE_UPLOAD_BASEURL__WEIXIN_DEVELOP || VITE_UPLOAD_BASEURL
    }
    if (envVersion === 'trial') {
      return import.meta.env.VITE_UPLOAD_BASEURL__WEIXIN_TRIAL || VITE_UPLOAD_BASEURL
    }
    if (envVersion === 'release') {
      return import.meta.env.VITE_UPLOAD_BASEURL__WEIXIN_RELEASE || VITE_UPLOAD_BASEURL
    }
  }
  // #endif
  return VITE_UPLOAD_BASEURL
}

/**
 * 获取当前页面
 */
export function getLastPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/**
 * 解析 url 得到 path 和 query
 */
function ensureDecodeURIComponent(url: string) {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}

export function getUrlObj(url: string) {
  const [path, queryStr] = url.split('?')

  if (!queryStr) {
    return { path, query: {} }
  }
  const query: Record<string, string> = {}
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    query[key] = ensureDecodeURIComponent(value)
  })
  return { path, query }
}

/**
 * 获取当前页面路由的 path
 */
export function currRoute() {
  const lastPage = getLastPage()
  const currRoute = (lastPage as any).$page
  const { fullPath } = currRoute as { fullPath: string }
  return getUrlObj(fullPath)
}
