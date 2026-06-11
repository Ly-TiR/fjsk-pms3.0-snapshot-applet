/** 随手拍工作流节点类型 */
export type WorkflowNodeKey =
  | 'start'
  | 'dutyAssign'
  | 'planCompile'
  | 'planAudit'
  | 'constructionRectify'
  | 'analystRectify'
  | 'supervisorAudit'
  | 'managerAudit'
  | 'initiatorAudit'
  | 'done'

/** 工作流节点元信息 */
export interface WorkflowNodeMeta {
  key: WorkflowNodeKey
  label: string
  role: string
}

/** 主流程状态（7态） */
export type SnapshotMainStatus =
  | '草稿'
  | '待受理'
  | '待处置'
  | '待复核'
  | '已驳回'
  | '已办结'
  | '不予受理'

/** 协同状态（6态） */
export type CollaborationStatus =
  | '待接收'
  | '协同处理中'
  | '已反馈'
  | '已驳回'
  | '已汇总'
  | '已关闭'

/** 上报来源枚举 */
export type SnapshotSource =
  | '群众上报'
  | '网格员巡查'
  | '工作人员补录'
  | '热线转办'
  | '领导交办'
  | '其他来源'

/** 紧急程度 */
export type SnapshotLevel = '一般' | '较急' | '紧急'

/** 流程类型 */
export type ProcessType = 'quality_safety' | 'non_quality_safety'

/** 流转意见 */
export interface FlowOpinion {
  id: string
  nodeName: string
  actionName: string
  operatorName: string
  operatorOrg: string
  opinionText: string
  operateTime: string
  mediaFiles?: MediaFile[]
  attachments?: MediaFile[]
  isReject?: boolean
  isPass?: boolean
}

/** 媒体文件 */
export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'file'
  url?: string
  time?: string
  location?: string
}
