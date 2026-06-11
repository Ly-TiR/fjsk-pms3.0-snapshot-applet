import type { CustomRequestOptions } from '@/interceptors/request'

/**
 * 文件上传封装
 */
export function uploadFile(options: CustomRequestOptions) {
  return new Promise<IResData<any>>((resolve, reject) => {
    uni.uploadFile({
      url: options.url,
      filePath: options.filePath || '',
      name: options.name || 'file',
      formData: options.formData,
      header: options.header,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(res.data) as IResData<any>)
        }
        else {
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({ icon: 'none', title: '上传失败' })
        reject(err)
      },
    })
  })
}
