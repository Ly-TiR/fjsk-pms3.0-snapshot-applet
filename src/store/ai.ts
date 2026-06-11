import type { AiSession, AiMessage, AiContext, AiAgent } from '@/types/ai'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAiStore = defineStore('ai', () => {
  /** 会话列表 */
  const sessions = ref<AiSession[]>([
    {
      id: 'xj-session-001',
      title: '当前会话',
      context: null,
      selectedAgents: [],
      activeAgentId: '',
      messages: [],
      updatedAt: '刚刚',
      pinned: false,
    },
  ])

  /** 当前活跃会话 ID */
  const activeSessionId = ref('xj-session-001')

  /** 当前选中的智能体列表 */
  const selectedAgentIds = ref<string[]>([])

  /** 当前活跃智能体 ID */
  const activeAgentId = ref('')

  /** 是否正在 typing */
  const isTyping = ref(false)

  /** 当前活跃会话 */
  const activeSession = computed(() =>
    sessions.value.find(s => s.id === activeSessionId.value) || sessions.value[0],
  )

  /** 当前上下文对象 */
  const currentContext = computed(() => activeSession.value?.context)

  function setActiveSession(id: string) {
    activeSessionId.value = id
  }

  function addSession(session: AiSession) {
    sessions.value.unshift(session)
  }

  function removeSession(id: string) {
    sessions.value = sessions.value.filter(s => s.id !== id)
  }

  function setContext(context: AiContext | null) {
    const session = activeSession.value
    if (session) {
      session.context = context
    }
  }

  function toggleAgent(agentId: string) {
    const idx = selectedAgentIds.value.indexOf(agentId)
    if (idx > -1) {
      selectedAgentIds.value = selectedAgentIds.value.filter(id => id !== agentId)
    }
    else {
      selectedAgentIds.value.push(agentId)
    }
  }

  function addMessage(message: AiMessage) {
    const session = activeSession.value
    if (session) {
      session.messages.push(message)
      session.updatedAt = '刚刚'
    }
  }

  function clearMessages() {
    const session = activeSession.value
    if (session) {
      session.messages = []
    }
  }

  function setTyping(typing: boolean) {
    isTyping.value = typing
  }

  return {
    sessions,
    activeSessionId,
    selectedAgentIds,
    activeAgentId,
    isTyping,
    activeSession,
    currentContext,
    setActiveSession,
    addSession,
    removeSession,
    setContext,
    toggleAgent,
    addMessage,
    clearMessages,
    setTyping,
  }
})
