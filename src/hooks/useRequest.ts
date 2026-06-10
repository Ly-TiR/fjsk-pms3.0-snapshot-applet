/**
 * useRequest - 通用异步请求 Hook
 * @param func 异步请求函数
 * @param options 配置选项
 */
interface IUseRequestOptions<T> {
  /** 是否立即执行 */
  immediate?: boolean
  /** 初始化数据 */
  initialData?: T
}

export default function useRequest<T>(
  func: () => Promise<IResData<T>>,
  options: IUseRequestOptions<T> = { immediate: false },
) {
  const loading = ref(false)
  const error = ref<unknown>(false)
  const data = ref<T>(options.initialData as T)

  const run = async () => {
    loading.value = true
    return func()
      .then((res) => {
        data.value = res.data as T
        error.value = false
        return data.value
      })
      .catch((err) => {
        error.value = err
        throw err
      })
      .finally(() => {
        loading.value = false
      })
  }

  options.immediate && run()

  return { loading, error, data, run }
}
