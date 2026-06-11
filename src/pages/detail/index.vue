<template>
  <view class="detail-page">
    <!-- 导航栏 -->
    <FgNavbar title="随手拍" :left-arrow="true">
      <template #right>
        <view class="nav-more" @click="showMore = !showMore">
          <text class="nav-more-dot">•••</text>
        </view>
      </template>
    </FgNavbar>

    <!-- 主Tab：流程表单 / 流转意见 -->
    <view class="detail-top-tabs">
      <view
        v-for="t in mainTabs"
        :key="t.key"
        class="detail-top-tab"
        :class="{ active: mainTab === t.key }"
        @click="mainTab = t.key"
      >
        <text>{{ t.label }}</text>
      </view>
    </view>

    <!-- 流程表单 -->
    <template v-if="mainTab === 'form'">
      <!-- 子Tab滚动 -->
      <scroll-view scroll-x class="detail-sub-tabs">
        <view class="detail-sub-tabs-inner">
          <view
            v-for="(t, i) in subTabs"
            :key="i"
            class="detail-sub-tab"
            :class="{ active: subTab === i }"
            @click="subTab = i"
          >
            <text>{{ t }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 表单滚动区 -->
      <scroll-view scroll-y class="detail-body">
        <view class="detail-body-inner">
          <!-- 受理/研判 节点 -->
          <view class="snapshot-section-card">
            <view class="snapshot-node-title">受理 / 研判</view>

            <!-- 街道受理人员 -->
            <view class="snapshot-field">
              <view class="snapshot-field-head">
                <text>街道受理人员</text>
              </view>
              <view class="snapshot-input-readonly">
                <text>网格治理岗 / grid001</text>
              </view>
            </view>

            <!-- 当前待选研判人员 -->
            <view class="snapshot-field">
              <view class="snapshot-field-head">
                <text>当前待选研判人员</text>
              </view>
              <view class="snapshot-input-button" @click="showPicker('judge')">
                <text class="snapshot-input-placeholder" v-if="!form.judgePerson">请选择本节点选定研判人员</text>
                <text class="snapshot-input-value" v-else>{{ form.judgePerson }}</text>
                <text class="snapshot-input-arrow">›</text>
              </view>
            </view>

            <!-- 研判人员 -->
            <view class="snapshot-field">
              <view class="snapshot-field-head">
                <text>研判人员</text>
              </view>
              <view class="snapshot-input-button" @click="showPicker('judgeMember')">
                <text class="snapshot-input-placeholder" v-if="!form.judgeMember">请选择研判人员</text>
                <text class="snapshot-input-value" v-else>{{ form.judgeMember }}</text>
                <text class="snapshot-select-link">选择</text>
              </view>
            </view>

            <!-- 处理备注 -->
            <view class="snapshot-field">
              <view class="snapshot-field-head">
                <text>处理备注</text>
              </view>
              <textarea
                class="snapshot-textarea"
                v-model="form.remark"
                placeholder="请输入处理备注信息"
                :maxlength="500"
              />
            </view>
          </view>

          <!-- 其他子Tab内容 -->
          <view v-if="subTab !== 0" class="snapshot-section-card">
            <view class="snapshot-node-title">{{ subTabs[subTab] }}</view>
            <view class="snapshot-readonly-text">该节点内容暂未配置，请在流程表单中完善相关信息。</view>
          </view>
        </view>
      </scroll-view>

      <!-- 底部操作按钮 -->
      <view class="snapshot-sticky-footer">
        <view class="snapshot-footer-row">
          <view class="snapshot-footer-btn secondary" @click="handleReject">
            <text>不予受理</text>
          </view>
          <view class="snapshot-footer-btn primary" @click="handleAccept">
            <text>受理</text>
          </view>
        </view>
      </view>
    </template>

    <!-- 流转意见 -->
    <template v-if="mainTab === 'opinion'">
      <scroll-view scroll-y class="detail-body">
        <view class="detail-body-inner">
          <view class="snapshot-section-card">
            <view class="snapshot-section-title">流转意见</view>
            <view class="timeline">
              <view v-for="(o, i) in flowOpinions" :key="i" class="tl-item">
                <view class="tl-dot" />
                <view class="tl-content">
                  <view class="tl-head">
                    <text class="tl-node">{{ o.nodeName }}</text>
                    <text class="tl-time">{{ o.time }}</text>
                  </view>
                  <text class="tl-opinion">{{ o.opinion }}</text>
                  <text class="tl-operator">操作人：{{ o.operator }}</text>
                </view>
              </view>
              <view v-if="!flowOpinions.length" class="tl-empty">暂无流转意见</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import FgNavbar from '@/components/fg-navbar/fg-navbar.vue'
import { toast } from '@/utils/toast'

const mainTab = ref('form')
const subTab = ref(0)
const showMore = ref(false)

const mainTabs = [
  { key: 'form', label: '流程表单' },
  { key: 'opinion', label: '流转意见' },
]

const subTabs = [
  '基本信息',
  '处置方案',
  '方案审核',
  '处置反馈',
  '监理复核',
  '建设方复核',
  '办结审核',
]

const form = reactive({
  judgePerson: '',
  judgeMember: '',
  remark: '',
})

const flowOpinions = ref([
  {
    nodeName: '发起上报',
    time: '2026-06-10 09:30',
    opinion: '发现消防通道堵塞，存在安全隐患，请尽快处理。',
    operator: 'grid001',
  },
  {
    nodeName: '受理/研判',
    time: '2026-06-10 10:15',
    opinion: '已受理，指派民生路网格负责处置，限期3天完成。',
    operator: 'admin001',
  },
])

function showPicker(type: string) {
  const options: Record<string, string[]> = {
    judge: ['李建国 · 街道综治办', '王芳 · 安全生产科', '张明 · 城管中队'],
    judgeMember: ['陈志强 · 网格巡查员', '刘伟 · 社区工作者', '周磊 · 消防专员'],
  }
  const list = options[type] || []
  uni.showActionSheet({
    itemList: list,
    success: (res: any) => {
      const val = list[res.tapIndex]
      if (type === 'judge') form.judgePerson = val
      if (type === 'judgeMember') form.judgeMember = val
    },
  })
}

function handleReject() {
  toast.warning('不予受理')
}

function handleAccept() {
  toast.success('已受理')
}
</script>

<style lang="scss" scoped>
/* ==================== 页面布局 ==================== */
.detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f4f7fb;
}

.detail-body {
  flex: 1;
  min-height: 0;
}

.detail-body-inner {
  padding: 12px 14px 24px;
  display: grid;
  gap: 12px;
}

/* ==================== 导航栏右侧 ==================== */
.nav-more {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-more-dot {
  color: #fff;
  font-size: 18px;
  line-height: 1;
  letter-spacing: 1px;
}

/* ==================== 主Tab ==================== */
.detail-top-tabs {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #edf1f6;
}

.detail-top-tab {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #8a94a6;
  position: relative;
}

.detail-top-tab.active {
  color: #1677ff;
}

.detail-top-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 3px;
  border-radius: 999px;
  background: #1677ff;
}

/* ==================== 子Tab ==================== */
.detail-sub-tabs {
  background: #fff;
  border-bottom: 1px solid #edf1f6;
  white-space: nowrap;
}

.detail-sub-tabs-inner {
  display: inline-flex;
  gap: 10px;
  padding: 10px 14px;
}

.detail-sub-tab {
  flex-shrink: 0;
  height: 34px;
  padding: 0 14px;
  border: 1px solid #dbe3ee;
  border-radius: 999px;
  background: #fff;
  color: #8a94a6;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.detail-sub-tab.active {
  border-color: #1677ff;
  background: #1677ff;
  color: #fff;
}

/* ==================== 卡片 ==================== */
.snapshot-section-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(22, 119, 255, 0.04);
  padding: 14px 12px 16px;
  box-shadow: 0 6px 16px rgba(31, 35, 41, 0.035);
}

.snapshot-section-title {
  color: #303642;
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 12px;
}

.snapshot-node-title {
  color: #1f2329;
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f2f5;
}

.snapshot-readonly-text {
  color: #8a97ad;
  font-size: 13px;
  line-height: 1.55;
  padding: 8px 0;
}

/* ==================== 表单字段 ==================== */
.snapshot-field {
  margin-top: 14px;
}

.snapshot-field:first-child {
  margin-top: 0;
}

.snapshot-field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  color: #303642;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
}

.snapshot-input-readonly {
  min-height: 44px;
  width: 100%;
  border: 1px solid #dfe4ec;
  border-radius: 8px;
  background: #f5f6f8;
  color: #303642;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
}

.snapshot-input-button {
  min-height: 44px;
  width: 100%;
  border: 1px solid #dfe4ec;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px;
  font-size: 14px;
}

.snapshot-input-placeholder {
  color: #c5cad3;
  font-size: 14px;
}

.snapshot-input-value {
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.snapshot-input-arrow {
  color: #98a2b3;
  font-size: 20px;
  font-weight: 300;
}

.snapshot-select-link {
  color: #1677ff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

/* 文本域 */
.snapshot-textarea {
  width: 100%;
  min-height: 120px;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  background: #fff;
  color: #303642;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  box-sizing: border-box;
}

/* ==================== 底部按钮 ==================== */
.snapshot-sticky-footer {
  flex-shrink: 0;
  padding: 10px 14px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, transparent, #f4f7fb 18%);
}

.snapshot-footer-row {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(22, 119, 255, 0.06);
  border-radius: 10px;
}

.snapshot-footer-btn {
  flex: 1;
  min-height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
}

.snapshot-footer-btn.secondary {
  border: 1px solid rgba(22, 119, 255, 0.18);
  background: #fff;
  color: #1677ff;
}

.snapshot-footer-btn.primary {
  background: #1677ff;
  color: #fff;
  border: none;
}

/* ==================== 流转意见时间线 ==================== */
.timeline {
  padding: 6px 0 10px;
}

.tl-item {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 8px;
  position: relative;
}

.tl-dot {
  width: 10px;
  height: 10px;
  margin-top: 16px;
  border-radius: 50%;
  background: #1677ff;
  box-shadow: 0 0 0 4px #e8f3ff;
}

.tl-content {
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid rgba(22, 119, 255, 0.08);
  background: #fff;
  padding: 12px;
}

.tl-head {
  display: flex;
  justify-content: space-between;
}

.tl-node {
  font-size: 14px;
  font-weight: 900;
  color: #1f2329;
}

.tl-time {
  font-size: 12px;
  color: #8a94a6;
}

.tl-opinion {
  margin-top: 8px;
  color: #344054;
  font-size: 13px;
  line-height: 1.55;
  display: block;
}

.tl-operator {
  margin-top: 6px;
  color: #667085;
  font-size: 12px;
  display: block;
}

.tl-empty {
  color: #98a2b3;
  font-size: 13px;
  text-align: center;
  padding: 24px 0;
}
</style>
