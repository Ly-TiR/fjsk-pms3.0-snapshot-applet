import type { MediaFile, FlowOpinion, SnapshotMainStatus, SnapshotSource, SnapshotLevel, ProcessType, WorkflowNodeKey } from './workflow.d'

/** 随手拍记录 */
export interface SnapshotRecord {
  id: string
  title: string
  description: string
  category: string
  categoryPath: string[]
  project: string
  /** 社区/网格 */
  section: string
  /** 详细地址/点位 */
  area: string
  level: SnapshotLevel
  source: SnapshotSource
  status: SnapshotMainStatus
  tab: string
  /** 当前节点 */
  currentNodeKey: WorkflowNodeKey
  currentNodeName: string
  currentStep: string
  processType: ProcessType
  /** 上报人 */
  checker: string
  checkerCompany: string
  /** 处理人 */
  handler: string
  /** 上报时间 */
  checkTime: string
  /** 要求处理时间 */
  dueTime: string
  /** 实际办结时间 */
  actualTime: string
  /** 办结审核意见 */
  managerOpinion: string
  /** 复核意见 */
  supervisorOpinion: string
  /** 处置反馈 */
  contractorReply: string
  /** 上报来源系统 */
  masterSystem: string
  /** 是否需要方案 */
  needPlan: boolean
  /** 方案状态 */
  planStatus: string
  /** 驳回原因 */
  rejectReason: string
  /** 现场影像 */
  mediaFiles: MediaFile[]
  /** 附件 */
  attachments: MediaFile[]
  /** 处置影像 */
  replyMediaFiles: MediaFile[]
  /** 处置附件 */
  replyAttachments: MediaFile[]
  /** 流转意见列表 */
  flowOpinionList: FlowOpinion[]
  /** 是否超期 */
  deadlineStatus?: string
}

/** 随手拍表单草稿 */
export interface SnapshotFormDraft {
  description: string
  category: string
  categoryPath: string[]
  section: string
  area: string
  level: SnapshotLevel | ''
  source: SnapshotSource
  dueDays: string
  needPlan: '是' | '否'
  mediaFiles: MediaFile[]
  attachments: MediaFile[]
}

/** 随手拍筛选条件 */
export interface SnapshotFilters {
  project?: string
  section?: string
  category?: string
  source?: string
  level?: string
  status?: string
  deadline?: string
  startDate?: string
  endDate?: string
  keyword?: string
}

/** 列表统计 */
export interface SnapshotStats {
  total: number
  draft: number
  rectifying: number
  reviewing: number
  completed: number
  rejected: number
  overdue: number
  nearDue: number
  severe: number
}
