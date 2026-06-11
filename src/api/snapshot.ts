import type { SnapshotRecord } from '@/types/snapshot'
import { httpGet, httpPost } from '@/utils/http'

/** 获取随手拍列表 */
export function getSnapshotList(params?: Record<string, any>) {
  return httpGet<SnapshotRecord[]>('/snapshot/list', params)
}

/** 获取随手拍详情 */
export function getSnapshotDetail(id: string) {
  return httpGet<SnapshotRecord>(`/snapshot/${id}`)
}

/** 创建随手拍 */
export function createSnapshot(data: Record<string, any>) {
  return httpPost<SnapshotRecord>('/snapshot/create', data)
}

/** 处置反馈 */
export function replySnapshot(id: string, data: Record<string, any>) {
  return httpPost<SnapshotRecord>(`/snapshot/${id}/reply`, data)
}

/** 复核 */
export function reviewSnapshot(id: string, data: Record<string, any>) {
  return httpPost<SnapshotRecord>(`/snapshot/${id}/review`, data)
}

/** 办结审核 */
export function auditSnapshot(id: string, data: Record<string, any>) {
  return httpPost<SnapshotRecord>(`/snapshot/${id}/audit`, data)
}
