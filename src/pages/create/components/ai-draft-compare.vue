<template>
  <view class="ai-compare-mask" v-if="visible" @click="onMaskClick">
    <view class="ai-compare-sheet" @click.stop>
      <!-- 拖拽手柄 -->
      <view class="ai-compare-handle" />

      <!-- 头部 -->
      <view class="ai-compare-head">
        <view class="ai-compare-title-wrap">
          <text class="ai-compare-title">AI 原稿对比</text>
          <text class="ai-compare-subtitle">{{ subtitle }}</text>
        </view>
        <view class="ai-compare-close" @click="onClose">
          <text class="ai-compare-close-x">✕</text>
        </view>
      </view>

      <!-- 内容区 -->
      <scroll-view scroll-y class="ai-compare-body">
        <view class="ai-compare-block">
          <text class="ai-compare-block-label">AI 原稿</text>
          <text class="ai-compare-block-text">{{ aiDraftText }}</text>
        </view>
        <view class="ai-compare-block">
          <text class="ai-compare-block-label">当前内容</text>
          <text class="ai-compare-block-text">{{ currentText }}</text>
        </view>
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="ai-compare-footer">
        <view class="ai-compare-btn" @click="onKeepCurrent">
          <text>保留当前内容</text>
        </view>
        <view class="ai-compare-btn" @click="onRestoreAi">
          <text>恢复 AI 原稿</text>
        </view>
        <view class="ai-compare-btn ai-compare-btn-primary" @click="onClose">
          <text>关闭</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  aiDraftText?: string
  currentText?: string
  fieldName?: string
}>()

const emit = defineEmits<{
  close: []
  'update:visible': [value: boolean]
  'keep-current': []
  'restore-ai': []
}>()

const subtitle = computed(() => {
  const label = props.fieldName === 'description' ? '事项描述' : props.fieldName || '内容'
  return `${label}｜AI 草稿不会自动提交`
})

function onMaskClick() {
  emit('close')
  emit('update:visible', false)
}

function onClose() {
  emit('close')
  emit('update:visible', false)
}

function onKeepCurrent() {
  emit('keep-current')
  emit('close')
  emit('update:visible', false)
}

function onRestoreAi() {
  emit('restore-ai')
  emit('close')
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.ai-compare-mask {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(15, 23, 42, 0.38);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.ai-compare-sheet {
  width: 100%;
  height: 50vh;
  background: #fff;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 32px rgba(15, 23, 42, 0.12);
}

.ai-compare-handle {
  width: 36px;
  height: 5px;
  border-radius: 999px;
  background: #d0d5dd;
  margin: 10px auto 6px;
  flex-shrink: 0;
}

.ai-compare-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 16px 12px;
  flex-shrink: 0;
}

.ai-compare-title-wrap {
  min-width: 0;
}

.ai-compare-title {
  display: block;
  color: #1d2939;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
}

.ai-compare-subtitle {
  display: block;
  color: #98a2b3;
  font-size: 12px;
  margin-top: 2px;
}

.ai-compare-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(22, 119, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-compare-close-x {
  font-size: 16px;
  color: #98a2b3;
  line-height: 1;
}

.ai-compare-body {
  flex: 1;
  min-height: 0;
  padding: 0 16px;
}

.ai-compare-block {
  border: 1px solid #edf1f6;
  border-radius: 10px;
  background: #fbfdff;
  padding: 10px 12px;
  margin-bottom: 10px;
}

.ai-compare-block-label {
  display: block;
  color: #1d2939;
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 6px;
}

.ai-compare-block-text {
  display: block;
  max-height: 168px;
  overflow-y: auto;
  color: #344054;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.ai-compare-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  flex-shrink: 0;
  border-top: 1px solid #f0f2f5;
}

.ai-compare-btn {
  flex: 1;
  min-height: 40px;
  border: 1px solid rgba(22, 119, 255, 0.18);
  border-radius: 10px;
  background: #fff;
  color: #1677ff;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.ai-compare-btn-primary {
  background: #1677ff;
  color: #fff;
  border-color: #1677ff;
}
</style>
