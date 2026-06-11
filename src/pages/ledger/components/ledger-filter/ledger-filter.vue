<template>
  <view class="lf-overlay" v-if="visible" @click="close">
    <view class="lf-sheet" @click.stop>
      <view class="lf-head">
        <view class="lf-title">筛选随手拍</view>
        <view class="lf-summary">
          <text class="lf-summary-title">按条件筛选列表</text>
          <text class="lf-summary-count">{{ filterCountText }}</text>
        </view>
      </view>
      <view class="lf-body">
        <scroll-view class="lf-nav" scroll-y>
          <view
            v-for="key in fieldKeys"
            :key="key"
            class="lf-nav-item"
            :class="{ active: activeField === key }"
            @click="activeField = key"
          >
            <text class="lf-nav-label">{{ fieldMeta[key].label }}</text>
            <text class="lf-nav-value">{{ getDisplayValue(key) }}</text>
          </view>
        </scroll-view>
        <scroll-view class="lf-panel" scroll-y>
          <view class="lf-panel-head">
            <text class="lf-panel-title">{{ fieldMeta[activeField].label }}</text>
          </view>
          <view class="lf-panel-grid">
            <view
              v-for="opt in currentOptions"
              :key="opt"
              class="lf-option"
              :class="{ active: pending[activeField] === opt }"
              @click="select(activeField, opt)"
            >{{ opt }}</view>
          </view>
        </scroll-view>
      </view>
      <view class="lf-footer">
        <button class="lf-btn lf-btn-cancel" @click="close">取消</button>
        <button class="lf-btn lf-btn-reset" @click="reset">重置</button>
        <button class="lf-btn lf-btn-confirm" @click="confirm">应用筛选</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: []; confirm: [filters: Record<string, string>] }>()

const fieldKeys = ['project', 'section', 'category', 'area', 'company', 'source', 'initiative']
const fieldMeta: Record<string, { label: string }> = {
  project: { label: '所属街道' },
  section: { label: '社区 / 网格' },
  category: { label: '事项分类' },
  area: { label: '详细地址 / 点位' },
  company: { label: '上报组织' },
  source: { label: '上报来源' },
  initiative: { label: '上报主动性' },
}

const fieldOptions: Record<string, string[]> = {
  project: ['全部街道', '江汉路街道', '前进街道', '民意街道'],
  section: ['全部社区', '民生路社区', '江汉路社区', '循礼门社区', '步行街网格'],
  category: ['全部分类', '飞线充电', '通道占用', '井盖破损', '垃圾堆放', '违建'],
  area: ['全部区域', '三号楼外侧', '步行街东段', '民生路沿线', '循礼门周边'],
  company: ['全部单位', '街道治理办', '城市管理执法中队', '社区居委会'],
  source: ['全部来源', '工作人员补录', '网格员巡查', '群众上报', '热线转办'],
  initiative: ['全部', '主动上报', '主动巡查'],
}

const activeField = ref('project')
const pending = reactive<Record<string, string>>({})

function initPending() {
  fieldKeys.forEach(k => { pending[k] = fieldOptions[k][0] || '全部' })
}
initPending()

watch(() => props.visible, (v) => {
  if (v) {
    initPending()
    activeField.value = 'project'
  }
})

const currentOptions = computed(() => fieldOptions[activeField.value] || [])

const filterCountText = computed(() => {
  const count = fieldKeys.filter(k => pending[k] && !pending[k].startsWith('全部')).length
  return count > 0 ? `已选 ${count} 项` : '当前未设置筛选条件'
})

function getDisplayValue(key: string) {
  const v = pending[key] || ''
  return v.startsWith('全部') ? '全部' : v
}

function select(key: string, value: string) {
  pending[key] = value
}

function reset() {
  initPending()
}

function close() {
  emit('close')
}

function confirm() {
  emit('confirm', { ...pending })
  emit('close')
}
</script>

<style scoped>
.lf-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}
.lf-sheet {
  width: 100%;
  height: 80vh;
  background: #fff;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.lf-head {
  padding: 16px 16px 8px;
  flex-shrink: 0;
}
.lf-title {
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 10px;
}
.lf-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f7fbff 0%, #eef6ff 100%);
  border: 1px solid rgba(22,119,255,0.1);
}
.lf-summary-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}
.lf-summary-count {
  font-size: 12px;
  font-weight: 700;
  color: #667085;
}

.lf-body {
  flex: 1;
  display: flex;
  min-height: 0;
  padding: 10px 10px 0;
  gap: 10px;
}
.lf-nav {
  width: 0;
  flex: 1;
  flex-shrink: 0;
  display: grid;
  gap: 6px;
  align-content: start;
  padding: 6px;
  border-radius: 14px;
  background: #f8fbff;
  border: 1px solid rgba(22,119,255,0.1);
  min-height: 0;
}
.lf-nav-item {
  width: 100%;
  border: none;
  border-radius: 10px;
  background: transparent;
  padding: 10px 10px 9px;
  text-align: left;
  display: grid;
  gap: 3px;
}
.lf-nav-item.active {
  background: #fff;
  box-shadow: 0 6px 16px rgba(15,23,42,0.06);
}
.lf-nav-label {
  font-size: 13px;
  font-weight: 800;
  color: #475467;
}
.lf-nav-item.active .lf-nav-label {
  color: #1677ff;
}
.lf-nav-value {
  font-size: 11px;
  color: #98a2b3;
  white-space: nowrap;
}
.lf-nav-item.active .lf-nav-value {
  color: #1677ff;
}

.lf-panel {
  flex: 2;
  min-width: 0;
  min-height: 0;
  border: 1px solid rgba(22,119,255,0.1);
  border-radius: 14px;
  background: #fff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 6px 16px rgba(15,23,42,0.04);
}
.lf-panel-head {
  margin-bottom: 0;
}
.lf-panel-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}
.lf-panel-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.lf-option {
  min-height: 40px;
  border: 1px solid #e6edf5;
  border-radius: 10px;
  background: #fff;
  color: #475467;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.35;
  padding: 10px 12px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lf-option.active {
  border-color: rgba(22,119,255,0.28);
  background: #e8f3ff;
  color: #1677ff;
  box-shadow: inset 0 0 0 1px rgba(22,119,255,0.08);
}

.lf-footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px 20px;
  border-top: 1px solid #f0f2f5;
  flex-shrink: 0;
}
.lf-btn {
  flex: 1;
  height: 42px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lf-btn-cancel {
  background: #f5f7fa;
  color: #475467;
}
.lf-btn-reset {
  background: #f5f7fa;
  color: #475467;
}
.lf-btn-confirm {
  background: #1677ff;
  color: #fff;
}
</style>
