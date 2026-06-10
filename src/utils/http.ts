import type { CustomRequestOptions } from '@/interceptors/request'

/**
 * 通用 HTTP 请求封装
 */
export function http<T>(options: CustomRequestOptions) {
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as IResData<T>)
        }
        else if (res.statusCode === 401) {
          reject(res)
        }
        else {
          !options.hideErrorToast
          && uni.showToast({
            icon: 'none',
            title: (res.data as IResData<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 */
export function httpGet<T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({ url, query, method: 'GET', header, ...options })
}

/**
 * POST 请求
 */
export function httpPost<T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({ url, query, data, method: 'POST', header, ...options })
}
