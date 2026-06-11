<template>
  <view class="lr-overlay" v-if="visible" @click="close">
    <view class="lr-sheet" @click.stop>
      <view class="lr-title">列表风险</view>
      <view class="lr-body">
        <view class="lr-summary">
          <text class="lr-summary-title">发现风险</text>
          <view class="lr-summary-list">
            <text class="lr-summary-item is-danger">超期未办结：{{ risks.overdue }} 条</text>
            <text class="lr-summary-item is-danger">紧急问题：{{ risks.urgent }} 条</text>
          </view>
          <text class="lr-summary-hint">先看超期，再看紧急问题，再结合当前处置节点安排处置。</text>
          <view class="lr-summary-meta">
            <text class="lr-summary-tag">当前范围</text>
            <text class="lr-summary-tag lr-summary-tag-active">{{ scopeLabel }}</text>
          </view>
        </view>
      </view>
      <view class="lr-footer">
        <button class="lr-btn lr-btn-danger" @click="onAction('overdue')">看超期</button>
        <button class="lr-btn lr-btn-warning" @click="onAction('urgent')">看紧急</button>
      </view>
      <view class="lr-close" @click="close">知道了</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  overdue: number
  urgent: number
  scope: string
}>()

const emit = defineEmits<{
  close: []
  action: [type: string]
}>()

const risks = computed(() => ({
  overdue: props.overdue || 0,
  urgent: props.urgent || 0,
}))

const scopeLabel = computed(() => props.scope || '已驳回')

function onAction(type: string) {
  emit('action', type)
}

function close() {
  emit('close')
}
</script>

<style scoped>
.lr-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}
.lr-sheet {
  width: 100%;
  background: #fff;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.lr-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  padding: 16px 0 8px;
  flex-shrink: 0;
}
.lr-body {
  padding: 8px 16px 16px;
}
.lr-summary {
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f7fbff, #eef6ff);
  border: 1px solid rgba(22,119,255,0.1);
}
.lr-summary-title {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}
.lr-summary-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.lr-summary-item {
  font-size: 13px;
  font-weight: 700;
  color: #475467;
}
.lr-summary-item.is-danger {
  color: #dc2626;
}
.lr-summary-hint {
  display: block;
  font-size: 12px;
  color: #667085;
  line-height: 1.5;
  margin-bottom: 10px;
}
.lr-summary-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}
.lr-summary-tag {
  font-size: 10px;
  font-weight: 700;
  color: #667085;
  background: #f2f4f7;
  padding: 3px 8px;
  border-radius: 4px;
}
.lr-summary-tag-active {
  background: #e8f3ff;
  color: #1677ff;
}
.lr-footer {
  display: flex;
  gap: 10px;
  padding: 0 16px 10px;
  flex-shrink: 0;
}
.lr-btn {
  flex: 1;
  height: 42px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: none;
}
.lr-btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
}
.lr-btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
}
.lr-close {
  text-align: center;
  padding: 8px 0 20px;
  font-size: 13px;
  color: #98a2b3;
  flex-shrink: 0;
}
</style>
