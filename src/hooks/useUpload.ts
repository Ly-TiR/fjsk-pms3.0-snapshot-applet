/**
 * 通用文件上传 Hook
 */
import { getEnvBaseUploadUrl } from '@/utils'

export default function useUpload<T = string>(
  url: string,
  formData: Record<string, any> = {},
  options: {
    count?: number
    sizeType?: Array<'original' | 'compressed'>
    sourceType?: Array<'album' | 'camera'>
    maxSize?: number
    onProgress?: (progress: number) => void
    onSuccess?: (res: T) => void
    onError?: (err: any) => void
  } = {},
) {
  const {
    count = 1,
    sizeType = ['original'],
    sourceType = ['album'],
    maxSize = 5,
    onProgress,
    onSuccess,
    onError,
  } = options

  const loading = ref(false)
  const error = ref<Error | null>(null)
  const data = ref<T | null>(null)
  const progress = ref(0)

  const chooseAndUpload = (filePath?: string) => {
    if (filePath) {
      // 已有文件路径，直接上传
      uploadFile(filePath)
    }
    else {
      // 选择文件
      uni.chooseImage({
        count,
        sizeType,
        sourceType,
        success: (res) => {
          const path = res.tempFilePaths[0]
          // 检查大小
          res.tempFiles.forEach((file) => {
            if (file.size && file.size > maxSize * 1024 * 1024) {
              uni.showToast({
                title: `文件大小不能超过 ${maxSize}MB`,
                icon: 'none',
              })
              return
            }
          })
          uploadFile(path)
        },
        fail: (err) => {
          error.value = new Error(err.errMsg)
          onError?.(err)
        },
      })
    }
  }

  const uploadFile = (filePath: string) => {
    loading.value = true
    progress.value = 0

    const uploadTask = uni.uploadFile({
      url,
      filePath,
      name: 'file',
      formData,
      success: (res) => {
        loading.value = false
        try {
          const result = JSON.parse(res.data) as T
          data.value = result
          onSuccess?.(result)
        }
        catch {
          data.value = res.data as unknown as T
          onSuccess?.(res.data as unknown as T)
        }
      },
      fail: (err) => {
        loading.value = false
        error.value = new Error(err.errMsg)
        onError?.(err)
      },
    })

    uploadTask.onProgressUpdate((res) => {
      progress.value = res.progress
      onProgress?.(res.progress)
    })
  }

  return {
    loading,
    error,
    data,
    progress,
    chooseAndUpload,
  }
}
