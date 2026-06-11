import { httpPost } from '@/utils/http'

/** AI 对话 */
export function aiChat(data: {
  prompt: string
  agentId: string
  sessionId: string
  context?: Record<string, any>
}) {
  return httpPost<{ message: any }>('/ai/chat', data)
}

/** AI 识图 */
export function aiRecognizeImage(data: {
  imageUrl: string
  prompt?: string
}) {
  return httpPost<{ result: any }>('/ai/recognize', data)
}

/** 获取 AI 会话历史 */
export function getAiSessions() {
  return httpPost<{ sessions: any[] }>('/ai/sessions')
}
