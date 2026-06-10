/**
 * SSE (Server-Sent Events) 流式传输核心模块
 *
 * 跨平台兼容：
 * - H5 端：原生 fetch + ReadableStream 或 EventSource
 * - 微信小程序端：request + enableChunked
 * - App 端：原生 fetch
 *
 * 特性：
 * - 自动重连机制
 * - 中断控制 (AbortController)
 * - 流式回调 onMessage / onDone / onError
 * - 支持 POST/GET 请求
 * - 支持自定义 headers
 */

import { isMpWeixin, isH5, isApp } from '@/utils/platform'

// ============================================================
// 类型定义
// ============================================================

export interface SSEMessage {
  /** 事件类型，默认 'message' */
  event?: string
  /** 消息数据 */
  data: string
  /** 消息 ID */
  id?: string
  /** 重连时间（毫秒） */
  retry?: number
}

export interface SSERequestOptions {
  /** 请求地址 */
  url: string
  /** 请求方法，默认 POST */
  method?: 'GET' | 'POST'
  /** 请求体数据（POST 时使用） */
  body?: Record<string, any>
  /** 自定义请求头 */
  headers?: Record<string, string>
  /** 请求超时（毫秒），默认 0 不超时 */
  timeout?: number
  /** 是否自动重连，默认 false */
  autoReconnect?: boolean
  /** 最大重连次数，默认 3 */
  maxRetries?: number
  /** 重连间隔（毫秒），默认 3000 */
  retryInterval?: number
  /** 发送信号用于中断请求 */
  signal?: AbortSignal
}

export interface SSECallbacks {
  /** 收到一条消息 */
  onMessage?: (msg: SSEMessage) => void
  /** 收到错误 */
  onError?: (err: Error) => void
  /** 流式传输完成 */
  onDone?: () => void
  /** 连接打开 */
  onOpen?: () => void
}

export interface SSEClient {
  /** 开启连接 */
  connect: () => Promise<void>
  /** 中断连接 */
  abort: () => void
}

// ============================================================
// SSE 消息解析器
// ============================================================

/**
 * 解析 SSE 格式的文本数据
 * SSE 格式: "event: xxx\ndata: yyy\n\n"
 */
export function parseSSEChunk(chunk: string): SSEMessage[] {
  const messages: SSEMessage[] = []
  const lines = chunk.split('\n')
  let current: Partial<SSEMessage> = {}

  for (const line of lines) {
    if (line === '') {
      // 空行表示一条消息结束
      if (current.data !== undefined) {
        messages.push({
          event: current.event || 'message',
          data: current.data,
          id: current.id,
          retry: current.retry,
        })
      }
      current = {}
    }
    else if (line.startsWith('event:')) {
      current.event = line.slice(6).trim()
    }
    else if (line.startsWith('data:')) {
      const d = line.slice(5).trim()
      current.data = current.data ? current.data + '\n' + d : d
    }
    else if (line.startsWith('id:')) {
      current.id = line.slice(3).trim()
    }
    else if (line.startsWith('retry:')) {
      current.retry = Number.parseInt(line.slice(6).trim(), 10)
    }
    else if (line.startsWith(':')) {
      // 注释行，忽略
    }
  }

  return messages
}

// ============================================================
// H5 / App 端 SSE 实现（基于 fetch + ReadableStream）
// ============================================================

function createH5SSEClient(options: SSERequestOptions, callbacks: SSECallbacks): SSEClient {
  let abortController = new AbortController()
  let retryCount = 0
  let lastEventId: string | undefined

  const doConnect = async (): Promise<void> => {
    const {
      url,
      method = 'POST',
      body,
      headers = {},
      maxRetries = 3,
      retryInterval = 3000,
    } = options

    const mergedHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      ...headers,
    }

    if (lastEventId) {
      mergedHeaders['Last-Event-ID'] = lastEventId
    }

    const token = uni.getStorageSync('token')
    if (token) {
      mergedHeaders['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body: method === 'POST' && body ? JSON.stringify(body) : undefined,
        signal: options.signal || abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`SSE 连接失败: HTTP ${response.status}`)
      }

      callbacks.onOpen?.()

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('浏览器不支持 ReadableStream')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          // 处理 buffer 中剩余数据
          if (buffer.trim()) {
            const msgs = parseSSEChunk(buffer)
            msgs.forEach(msg => callbacks.onMessage?.(msg))
          }
          callbacks.onDone?.()
          return
        }

        buffer += decoder.decode(value, { stream: true })

        // 按双换行分割 SSE 消息
        const parts = buffer.split('\n\n')
        // 最后一部分可能不完整，保留到下次
        buffer = parts.pop() || ''

        for (const part of parts) {
          if (part.trim()) {
            const msgs = parseSSEChunk(part + '\n\n')
            msgs.forEach((msg) => {
              if (msg.id) lastEventId = msg.id
              callbacks.onMessage?.(msg)
            })
          }
        }
      }
    }
    catch (err: any) {
      if (err.name === 'AbortError') {
        return // 用户主动中断
      }

      callbacks.onError?.(err)

      // 自动重连
      if (options.autoReconnect && retryCount < maxRetries) {
        retryCount++
        console.log(`[SSE] 第 ${retryCount} 次重连...`)
        await new Promise(resolve => setTimeout(resolve, retryInterval))
        abortController = new AbortController()
        return doConnect()
      }

      throw err
    }
  }

  return {
    connect: doConnect,
    abort: () => abortController.abort(),
  }
}

// ============================================================
// 微信小程序端 SSE 实现（基于 request + enableChunked）
// ============================================================

function createMpSSEClient(options: SSERequestOptions, callbacks: SSECallbacks): SSEClient {
  let requestTask: UniApp.RequestTask | null = null
  let retryCount = 0
  let lastEventId: string | undefined
  let buffer = ''

  const doConnect = (): Promise<void> => {
    const {
      url,
      method = 'POST',
      body,
      headers = {},
      timeout = 0,
      maxRetries = 3,
      retryInterval = 3000,
    } = options

    const mergedHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      ...headers,
    }

    if (lastEventId) {
      mergedHeaders['Last-Event-ID'] = lastEventId
    }

    const token = uni.getStorageSync('token')
    if (token) {
      mergedHeaders['Authorization'] = `Bearer ${token}`
    }

    return new Promise<void>((resolve, reject) => {
      requestTask = uni.request({
        url,
        method,
        header: mergedHeaders,
        data: method === 'POST' && body ? body : undefined,
        timeout: timeout > 0 ? timeout : 60000,
        // #ifdef MP-WEIXIN
        enableChunked: true,
        // #endif
        responseType: 'text',
        success: (res) => {
          // 流结束
          if (buffer.trim()) {
            const msgs = parseSSEChunk(buffer)
            msgs.forEach(msg => callbacks.onMessage?.(msg))
          }
          callbacks.onDone?.()
          resolve()
        },
        fail: (err) => {
          if (err.errMsg?.includes('abort')) {
            resolve()
            return
          }

          callbacks.onError?.(new Error(err.errMsg || 'SSE 请求失败'))

          // 自动重连
          if (options.autoReconnect && retryCount < maxRetries) {
            retryCount++
            console.log(`[SSE] 第 ${retryCount} 次重连...`)
            setTimeout(() => {
              doConnect().catch(reject)
            }, retryInterval)
          }
          else {
            reject(new Error(err.errMsg))
          }
        },
      })

      callbacks.onOpen?.()

      // 监听分块数据
      // #ifdef MP-WEIXIN
      if (requestTask && typeof requestTask.onChunkReceived === 'function') {
        requestTask.onChunkReceived((res: any) => {
          const chunk = typeof res.data === 'string'
            ? res.data
            : new TextDecoder().decode(new Uint8Array(res.data))

          buffer += chunk
          const parts = buffer.split('\n\n')
          buffer = parts.pop() || ''

          for (const part of parts) {
            if (part.trim()) {
              const msgs = parseSSEChunk(part + '\n\n')
              msgs.forEach((msg) => {
                if (msg.id) lastEventId = msg.id
                callbacks.onMessage?.(msg)
              })
            }
          }
        })
      }
      // #endif
    })
  }

  return {
    connect: doConnect,
    abort: () => {
      requestTask?.abort()
    },
  }
}

// ============================================================
// 统一入口：根据平台创建 SSE 客户端
// ============================================================

/**
 * 创建 SSE 客户端
 *
 * @example
 * ```typescript
 * const client = createSSEClient(
 *   { url: 'https://api.example.com/stream', method: 'POST', body: { prompt: 'hello' } },
 *   {
 *     onMessage: (msg) => console.log('收到:', msg.data),
 *     onDone: () => console.log('流结束'),
 *     onError: (err) => console.error('错误:', err),
 *   },
 * )
 * await client.connect()
 * // 中断: client.abort()
 * ```
 */
export function createSSEClient(
  options: SSERequestOptions,
  callbacks: SSECallbacks,
): SSEClient {
  if (isH5 || isApp) {
    return createH5SSEClient(options, callbacks)
  }
  // 小程序端（微信/支付宝/抖音等）
  return createMpSSEClient(options, callbacks)
}

// ============================================================
// Vue Composable：响应式 SSE Hook
// ============================================================

export interface UseSSEOptions extends SSERequestOptions, SSECallbacks {
  /** 是否在组件挂载时自动连接 */
  immediate?: boolean
}

export interface UseSSEReturn {
  /** 收到的所有消息列表 */
  messages: Ref<SSEMessage[]>
  /** 拼接后的完整文本 */
  fullText: ComputedRef<string>
  /** 是否连接中 */
  isConnected: Ref<boolean>
  /** 是否有错误 */
  error: Ref<Error | null>
  /** 开始连接 */
  connect: () => Promise<void>
  /** 中断连接 */
  abort: () => void
  /** 清空消息 */
  clear: () => void
}

/**
 * SSE Vue Hook
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { messages, fullText, isConnected, connect, abort, clear } = useSSE({
 *   url: 'https://api.example.com/chat/stream',
 *   body: { prompt: '你好' },
 *   immediate: false,
 *   onMessage: (msg) => console.log('新消息:', msg),
 *   onDone: () => console.log('完成'),
 * })
 * </script>
 * ```
 */
export function useSSE(options: UseSSEOptions): UseSSEReturn {
  const {
    immediate = false,
    onMessage: _onMessage,
    onError: _onError,
    onDone: _onDone,
    onOpen: _onOpen,
    ...restOptions
  } = options

  const messages = ref<SSEMessage[]>([])
  const isConnected = ref(false)
  const error = ref<Error | null>(null)

  const fullText = computed(() => {
    return messages.value.map(m => m.data).join('')
  })

  let client: SSEClient | null = null

  const connect = async () => {
    error.value = null
    isConnected.value = true

    client = createSSEClient(restOptions, {
      onMessage: (msg) => {
        messages.value = [...messages.value, msg]
        _onMessage?.(msg)
      },
      onError: (err) => {
        error.value = err
        isConnected.value = false
        _onError?.(err)
      },
      onDone: () => {
        isConnected.value = false
        _onDone?.()
      },
      onOpen: () => {
        _onOpen?.()
      },
    })

    try {
      await client.connect()
    }
    catch (err: any) {
      error.value = err
      isConnected.value = false
    }
  }

  const abort = () => {
    client?.abort()
    isConnected.value = false
  }

  const clear = () => {
    messages.value = []
  }

  if (immediate) {
    connect()
  }

  // 组件卸载时自动中断
  onUnmounted(() => {
    abort()
  })

  return {
    messages,
    fullText,
    isConnected,
    error,
    connect,
    abort,
    clear,
  }
}
