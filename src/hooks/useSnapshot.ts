import { useSnapshotStore } from '@/store/snapshot'
import { toast } from '@/utils/toast'
import type { SnapshotFormDraft, SnapshotRecord } from '@/types/snapshot'

export function useSnapshot() {
  const store = useSnapshotStore()

  /** 进入详情 */
  function goDetail(recordId: string) {
    store.setCurrentRecordId(recordId)
    uni.navigateTo({ url: `/pages/detail/index?id=${recordId}` })
  }

  /** 保存草稿 */
  function saveDraft(draft: SnapshotFormDraft) {
    store.setFormDraft(draft)
    toast.success('草稿已保存')
  }

  /** 提交随手拍 */
  async function submitSnapshot(draft: SnapshotFormDraft): Promise<boolean> {
    if (!draft.description) {
      toast.warning('请输入事项描述')
      return false
    }
    if (!draft.section) {
      toast.warning('请选择社区/网格')
      return false
    }
    if (!draft.category) {
      toast.warning('请选择事项分类')
      return false
    }
    if (!draft.level) {
      toast.warning('请选择紧急程度')
      return false
    }
    // Mock submit
    const newRecord: SnapshotRecord = {
      id: `SSP-${Date.now()}`,
      title: draft.description.slice(0, 20) || '随手拍事项',
      description: draft.description,
      category: draft.category,
      categoryPath: draft.categoryPath,
      project: '江汉路街道',
      section: draft.section,
      area: draft.area,
      level: draft.level as any,
      source: draft.source,
      status: '待受理',
      tab: '待受理',
      currentNodeKey: 'dutyAssign',
      currentNodeName: '受理/研判',
      currentStep: 'dutyAssign',
      processType: 'quality_safety',
      checker: '当前用户',
      checkerCompany: '江汉路街道',
      handler: '',
      checkTime: new Date().toISOString(),
      dueTime: '',
      actualTime: '',
      managerOpinion: '',
      supervisorOpinion: '',
      contractorReply: '',
      masterSystem: '随手拍小程序',
      needPlan: draft.needPlan === '是',
      planStatus: '',
      rejectReason: '',
      mediaFiles: draft.mediaFiles,
      attachments: draft.attachments,
      replyMediaFiles: [],
      replyAttachments: [],
      flowOpinionList: [],
    }
    store.setRecords([newRecord, ...store.records])
    store.setFormDraft(null)
    toast.success('提交成功')
    return true
  }

  return {
    ...store,
    goDetail,
    saveDraft,
    submitSnapshot,
  }
}
