import type { SnapshotRecord, SnapshotFilters, SnapshotFormDraft } from '@/types/snapshot'
import { defineStore } from 'pinia'

export const useSnapshotStore = defineStore('snapshot', () => {
  /** 列表数据 */
  const records = ref<SnapshotRecord[]>([])

  /** 筛选条件 */
  const filters = ref<SnapshotFilters>({
    keyword: '',
    status: '全部',
    project: '',
    section: '',
    category: '',
    source: '',
    level: '',
    deadline: '',
  })

  /** 当前状态 Tab */
  const activeTab = ref('全部')

  /** 当前详情记录 ID */
  const currentRecordId = ref('')

  /** 表单草稿 */
  const formDraft = ref<SnapshotFormDraft | null>(null)

  /** 当前记录 */
  const currentRecord = computed(() =>
    records.value.find(r => r.id === currentRecordId.value) || null,
  )

  /** 筛选后的列表 */
  const filteredRecords = computed(() => {
    const keyword = (filters.value.keyword || '').toLowerCase()
    const status = filters.value.status
    return records.value.filter((r) => {
      if (status && status !== '全部' && r.tab !== status) return false
      if (keyword) {
        const text = [r.title, r.description, r.category, r.section, r.area, r.checker].join(' ')
        return text.toLowerCase().includes(keyword)
      }
      return true
    })
  })

  /** 列表统计 */
  const stats = computed(() => {
    const list = filteredRecords.value
    return {
      total: list.length,
      rectifying: list.filter(r => r.tab === '待处置').length,
      reviewing: list.filter(r => r.tab === '待复核').length,
      completed: list.filter(r => r.tab === '已办结').length,
      overdue: list.filter(r => r.deadlineStatus === '已超期').length,
    }
  })

  function setRecords(data: SnapshotRecord[]) {
    records.value = data
  }

  function setFilters(f: Partial<SnapshotFilters>) {
    filters.value = { ...filters.value, ...f }
  }

  function setActiveTab(tab: string) {
    activeTab.value = tab
    setFilters({ status: tab })
  }

  function setCurrentRecordId(id: string) {
    currentRecordId.value = id
  }

  function setFormDraft(draft: SnapshotFormDraft | null) {
    formDraft.value = draft
  }

  return {
    records,
    filters,
    activeTab,
    currentRecordId,
    formDraft,
    currentRecord,
    filteredRecords,
    stats,
    setRecords,
    setFilters,
    setActiveTab,
    setCurrentRecordId,
    setFormDraft,
  }
})
