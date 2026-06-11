/** AI 消息 */
export interface AiMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  agentId: string
  text: string
  resultType?: 'ledger' | 'draft' | 'case' | 'review' | 'warning' | 'flow'
  cards?: AiResultCard[]
  timestamp: string
}

/** AI 结构化结果卡片 */
export interface AiResultCard {
  type?: string
  label: string
  value: string
  basis?: string
  items?: AiResultCard[]
}

/** AI 智能体定义 */
export interface AiAgent {
  id: string
  backendKey: string
  name: string
  type: 'worker' | 'expert'
  status: 'enabled' | 'disabled'
  summary: string
  tags: string[]
  samplePrompts: string[]
  icon: string
}

/** AI 会话 */
export interface AiSession {
  id: string
  title: string
  context: AiContext | null
  selectedAgents: string[]
  activeAgentId: string
  messages: AiMessage[]
  updatedAt: string
  pinned: boolean
}

/** AI 上下文对象 */
export interface AiContext {
  id: string
  title: string
  moduleCode: string
  moduleName: string
  currentPage: string
  currentPageName: string
  currentRecordId: string
  currentRecordTitle: string
  currentStep: string
  currentStatus: string
  currentProcessType: string
  summaryText: string
  defaultAgentId: string
}

/** AI 反馈 */
export interface AiFeedback {
  messageId: string
  type: 'up' | 'down'
  reasons: string[]
  detail: string
  submitted: boolean
}
