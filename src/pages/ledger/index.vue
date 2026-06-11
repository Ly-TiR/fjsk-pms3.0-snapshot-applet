<template>
  <view class="ledger-page">
    <!-- 顶部导航 -->
    <FgNavbar title="随手拍列表" :left-arrow="false" />

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <image src="/static/svg/search.svg" class="search-icon" mode="aspectFit" />
        <input
          type="text"
          placeholder="搜索编号/标题/事项分类/上报人/点位"
          v-model="keyword"
          @confirm="handleSearch"
        />
      </view>
      <button class="filter-btn" :class="{ active: filterActive }" @click="showFilter = true">
        筛选
      </button>
    </view>

    <!-- 状态 Tab -->
    <view class="card tabs-card snapshot-tabs-card">
      <view class="snapshot-tabs-scroll-wrap">
        <scroll-view scroll-x :show-scrollbar="false" enhanced class="snapshot-tabs-scroll">
          <view class="snapshot-tabs-inner">
            <view
              v-for="tab in tabs"
              :key="tab"
              class="status-tab"
              :class="{ active: activeTab === tab }"
              @click="setTab(tab)"
            >
              {{ tab }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 风险提示条 -->
    <view class="risk-bar" v-if="riskBar.show" @click="showRisk = true">
      <view class="risk-bar-left">
        <text class="risk-bar-text">发现风险</text>
        <text class="risk-bar-stat">超期未办结：{{ riskBar.overdue }} 条</text>
        <text class="risk-bar-stat">紧急问题：{{ riskBar.urgent }} 条</text>
      </view>
      <text class="risk-bar-action">查看 ›</text>
    </view>

    <!-- 记录列表 -->
    <scroll-view class="record-list" scroll-y>
      <!-- 统计摘要卡 -->
      <view class="stats-card" v-if="store.filteredRecords.length">
        <view class="stats-row">
          <text class="stats-item">待我处理 <text class="stats-num">{{ stats.total }}</text> 条</text>
          <text class="stats-item">滞后处理 <text class="stats-num">{{ stats.overdue }}</text> 条</text>
          <text class="stats-item">紧急 <text class="stats-num">{{ stats.urgent }}</text> 条</text>
        </view>
        <view class="stats-actions">
          <button class="stats-btn stats-btn-blue" @click="goLedger">查看分析</button>
          <button class="stats-btn stats-btn-orange" @click="showRisk = true">找风险</button>
        </view>
      </view>

      <view
        v-for="record in store.filteredRecords"
        :key="record.id"
        class="snapshot-card"
        @click="goDetail(record.id)"
      >
        <view class="card-head">
          <view class="card-title">{{ record.title }}</view>
          <view class="card-status" :class="statusClass(record.tab)">
            {{ record.tab }}
          </view>
        </view>
        <view class="card-info">
          <view class="card-row">
            <text class="info-label">随手拍编号</text>
            <text class="info-value">{{ record.id }}</text>
          </view>
          <view class="card-row">
            <text class="info-label">紧急程度</text>
            <text class="info-value" :class="{ 'text-danger': record.level === '紧急' }">{{ record.level || '一般' }}</text>
          </view>
        </view>
        <view class="card-info">
          <view class="card-row">
            <text class="info-label">SLA 状态</text>
            <text class="info-value" :class="{ 'text-danger': record.deadlineStatus === '已超期' }">
              {{ record.deadlineStatus || '正常' }}
            </text>
          </view>
          <view class="card-row">
            <text class="info-label">要求办结时间</text>
            <text class="info-value">{{ record.dueTime?.slice(0, 16) || '--' }}</text>
          </view>
        </view>
        <view class="card-info">
          <view class="card-row">
            <text class="info-label">上报人</text>
            <text class="info-value">{{ record.checkerCompany }} {{ record.checker }}</text>
          </view>
          <view class="card-row">
            <text class="info-label">上报时间</text>
            <text class="info-value">{{ record.checkTime?.slice(0, 16) || '--' }}</text>
          </view>
        </view>
        <view class="card-info">
          <view class="card-row">
            <text class="info-label">上报来源</text>
            <text class="info-value">{{ record.source || '工作人员录入' }}</text>
          </view>
          <view class="card-row">
            <text class="info-label">上报方式</text>
            <text class="info-value">主动上报</text>
          </view>
        </view>
        <view class="card-tags">
          <text class="card-tag">社区 / 网格</text>
          <text class="card-tag card-tag-active">{{ record.section }} / {{ record.area }}</text>
          <text v-if="record.level === '紧急'" class="card-tag card-tag-danger">紧急</text>
          <text v-if="record.deadlineStatus === '已超期'" class="card-tag card-tag-danger">超期</text>
        </view>
      </view>
      <view v-if="!store.filteredRecords.length" class="empty-card">
        当前筛选条件下暂无随手拍数据
      </view>
    </scroll-view>

    <!-- 筛选弹窗 -->
    <LedgerFilter
      :visible="showFilter"
      @close="showFilter = false"
      @confirm="onFilterConfirm"
    />

    <!-- 找风险弹窗 -->
    <LedgerRisk
      :visible="showRisk"
      :overdue="riskBar.overdue"
      :urgent="riskBar.urgent"
      :scope="activeTab"
      @close="showRisk = false"
      @action="onRiskAction"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSnapshotStore } from '@/store'
import LedgerFilter from './components/ledger-filter/ledger-filter.vue'
import LedgerRisk from './components/ledger-risk/ledger-risk.vue'

const store = useSnapshotStore()
const keyword = ref('')
const activeTab = ref('全部')
const showFilter = ref(false)
const showRisk = ref(false)
const tabs = ['全部', '草稿', '待受理', '待处置', '待复核', '已驳回', '已办结', '不予受理']
const appliedFilters = ref<Record<string, string>>({})

onMounted(() => {
  if (!store.records.length) {
    store.setRecords([
      {
        id: 'SSP-004', title: '居民楼外有电动车飞线充电，线路跨越公...',
        description: '居民楼外有电动车飞线充电', category: '飞线充电',
        categoryPath: ['安全隐患', '飞线充电'], project: '江汉路街道',
        section: '民生路社区', area: '民生路网格', level: '紧急',
        source: '群众上报', status: '已驳回', tab: '已驳回',
        currentNodeKey: 'constructionRectify', currentNodeName: '承办部门处置',
        currentStep: 'constructionRectify', processType: 'quality_safety',
        checker: '李素楠', checkerCompany: '社区工作人员', handler: '张聪聪',
        checkTime: '2026-04-26 19:30:00', dueTime: '2026-04-27 18:00:00',
        actualTime: '', managerOpinion: '', supervisorOpinion: '',
        contractorReply: '', masterSystem: '街道治理平台',
        needPlan: false, planStatus: '', rejectReason: '需补充现场处置影像',
        mediaFiles: [], attachments: [], replyMediaFiles: [], replyAttachments: [], flowOpinionList: [],
        deadlineStatus: '已超期',
      },
      {
        id: 'SSP-003', title: '步行街东段垃圾堆放影响通行',
        description: '步行街东段垃圾堆放', category: '垃圾堆放',
        categoryPath: ['市容环境', '垃圾堆放'], project: '江汉路街道',
        section: '江汉路社区', area: '步行街网格', level: '一般',
        source: '网格员巡查', status: '待处置', tab: '待处置',
        currentNodeKey: 'constructionRectify', currentNodeName: '承办部门处置',
        currentStep: 'constructionRectify', processType: 'quality_safety',
        checker: '王燕宁', checkerCompany: '网格员', handler: '李璐',
        checkTime: '2026-04-25 09:15:00', dueTime: '2026-06-26 12:00:00',
        actualTime: '', managerOpinion: '', supervisorOpinion: '',
        contractorReply: '', masterSystem: '街道治理平台',
        needPlan: false, planStatus: '', rejectReason: '',
        mediaFiles: [], attachments: [], replyMediaFiles: [], replyAttachments: [], flowOpinionList: [],
        deadlineStatus: '正常',
      },
      {
        id: 'SSP-002', title: '井盖破损存在安全隐患',
        description: '循礼门社区井盖破损', category: '井盖破损',
        categoryPath: ['市政设施', '井盖破损'], project: '江汉路街道',
        section: '循礼门社区', area: '循礼门网格', level: '一般',
        source: '热线转办', status: '待复核', tab: '待复核',
        currentNodeKey: 'supervisorAudit', currentNodeName: '复核',
        currentStep: 'supervisorAudit', processType: 'quality_safety',
        checker: '邓梅', checkerCompany: '社区工作人员', handler: '胡静',
        checkTime: '2026-04-24 14:20:00', dueTime: '2026-06-25 18:00:00',
        actualTime: '', managerOpinion: '', supervisorOpinion: '',
        contractorReply: '', masterSystem: '街道治理平台',
        needPlan: false, planStatus: '', rejectReason: '',
        mediaFiles: [], attachments: [], replyMediaFiles: [], replyAttachments: [], flowOpinionList: [],
        deadlineStatus: '正常',
      },
      {
        id: 'SSP-001', title: '商铺门口违建占道经营',
        description: '商铺门口违建占道经营', category: '违建',
        categoryPath: ['市容环境', '违建'], project: '江汉路街道',
        section: '民生路社区', area: '步行街网格', level: '较急',
        source: '工作人员补录', status: '已办结', tab: '已办结',
        currentNodeKey: 'done', currentNodeName: '已办结',
        currentStep: 'done', processType: 'quality_safety',
        checker: '张路路', checkerCompany: '网格员', handler: '王燕宁',
        checkTime: '2026-04-20 10:00:00', dueTime: '2026-06-23 18:00:00',
        actualTime: '2026-04-22 16:00:00', managerOpinion: '已确认整改完成',
        supervisorOpinion: '', contractorReply: '已完成整改',
        masterSystem: '街道治理平台',
        needPlan: false, planStatus: '', rejectReason: '',
        mediaFiles: [], attachments: [], replyMediaFiles: [], replyAttachments: [], flowOpinionList: [],
        deadlineStatus: '正常',
      },
    ])
  }
})

const filterActive = computed(() => Object.values(appliedFilters.value).some(v => v && v !== '全部'))

const stats = computed(() => ({
  total: store.filteredRecords.length,
  overdue: store.filteredRecords.filter(r => r.deadlineStatus === '已超期').length,
  urgent: store.filteredRecords.filter(r => r.level === '紧急').length,
}))

const riskBar = computed(() => {
  const list = store.filteredRecords
  const overdue = list.filter(r => r.deadlineStatus === '已超期').length
  const urgent = list.filter(r => r.level === '紧急').length
  return {
    show: overdue > 0 || urgent > 0,
    overdue,
    urgent,
  }
})

function setTab(tab: string) {
  activeTab.value = tab
  store.setActiveTab(tab)
}

function handleSearch() {
  store.setFilters({ keyword: keyword.value })
}

function onFilterConfirm(filters: Record<string, string>) {
  appliedFilters.value = filters
  showFilter.value = false
}

function onRiskAction(type: string) {
  showRisk.value = false
  if (type === 'overdue') {
    store.setFilters({ deadline: '已超期' })
  } else if (type === 'urgent') {
    store.setFilters({ level: '紧急' })
  }
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}
function goLedger() {
  // 查看分析 / 查看全部
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    '草稿': 'status-draft', '待受理': 'status-wait', '待处置': 'status-wait',
    '待复核': 'status-reviewing', '已驳回': 'status-rejected', '已办结': 'status-done',
  }
  return map[status] || ''
}
</script>

<style lang="scss" scoped>
.ledger-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f4f7fb;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  flex-shrink: 0;
}
.search-box {
  flex: 1;
  height: 40px;
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 6px;
}
.search-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.search-box input {
  flex: 1;
  font-size: 13px;
  color: #303642;
  background: transparent;
}
.filter-btn {
  min-width: 62px;
  height: 40px;
  border: 1px solid rgba(22,119,255,0.18);
  border-radius: 8px;
  background: #fff;
  color: #1677ff;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}
.filter-btn.active {
  background: #e8f3ff;
  border-color: rgba(22,119,255,0.35);
}

.snapshot-tabs-card {
  padding: 8px 0 0;
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid #edf1f6;
}
.snapshot-tabs-scroll-wrap {
  position: relative;
  overflow: hidden;
  padding: 0 6px;
}
.snapshot-tabs-scroll {
  white-space: nowrap;
}
.snapshot-tabs-inner {
  display: inline-flex;
  gap: 14px;
  padding: 0 24px 0 4px;
  min-height: 38px;
  align-items: center;
}
.status-tab {
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  color: #667085;
  padding: 8px 0 12px;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
}
.status-tab.active {
  color: #1677ff;
}
.status-tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  border-radius: 8px;
  background: #1677ff;
}

.risk-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 14px 8px;
  padding: 8px 12px;
  border: 1px solid rgba(245,158,11,0.24);
  border-radius: 8px;
  background: #fffbeb;
  flex-shrink: 0;
}
.risk-bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.risk-bar-text {
  font-size: 12px;
  font-weight: 700;
  color: #92400e;
}
.risk-bar-stat {
  font-size: 12px;
  font-weight: 700;
  color: #b45309;
}
.risk-bar-action {
  font-size: 12px;
  font-weight: 700;
  color: #1677ff;
  flex-shrink: 0;
}

.record-list {
  flex: 1;
  padding: 0 14px;
  min-height: 0;
}

/* 统计摘要卡 */
.stats-card {
  padding: 12px;
  background: linear-gradient(135deg, #f7fbff, #eef6ff);
  border: 1px solid rgba(22,119,255,0.1);
  border-radius: 12px;
  margin-bottom: 10px;
}
.stats-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.stats-item {
  font-size: 12px;
  color: #475467;
  font-weight: 700;
}
.stats-num {
  color: #1677ff;
  font-weight: 900;
}
.stats-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.stats-btn {
  flex: 1;
  height: 34px;
  border: 1px solid rgba(22,119,255,0.18);
  border-radius: 8px;
  background: #fff;
  color: #1677ff;
  font-size: 13px;
  font-weight: 700;
}
.stats-btn-orange {
  border-color: rgba(245,158,11,0.3);
  color: #d97706;
  background: #fffbeb;
}

/* 卡片 */
.snapshot-card {
  background: #fff;
  border-radius: 8px;
  padding: 13px 12px 12px;
  margin-bottom: 10px;
  border: 1px solid rgba(22,119,255,0.04);
  box-shadow: 0 4px 14px rgba(31,35,41,0.04);
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}
.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #303642;
  flex: 1;
  line-height: 1.4;
}
.card-status {
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}
.status-draft { background: #f0f1f3; color: #5f6b7a; }
.status-wait { background: #e8f3ff; color: #1677ff; }
.status-reviewing { background: #f0f9eb; color: #2e7d32; }
.status-rejected { background: #fff1f0; color: #dc2626; }
.status-done { background: #f3f4f6; color: #6b7280; }

.card-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
  margin-bottom: 6px;
}
.card-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.info-label {
  font-size: 12px;
  color: #98a2b3;
  white-space: nowrap;
}
.info-value {
  font-size: 13px;
  color: #303642;
  font-weight: 600;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.card-tag {
  min-height: 22px;
  padding: 0 7px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  background: #f1f6ff;
  color: #1768dc;
}
.card-tag-active {
  background: #e8f3ff;
  color: #1677ff;
  font-weight: 800;
}
.card-tag-danger {
  background: #fff1f0;
  color: #dc2626;
}
.text-danger {
  color: #dc2626 !important;
}

.empty-card {
  text-align: center;
  padding: 40px 16px;
  color: #98a2b3;
  font-size: 14px;
}
</style>
