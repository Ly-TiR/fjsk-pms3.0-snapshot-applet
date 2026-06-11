<template>
  <view class="ap-overlay" v-if="visible" @click="close">
    <view class="ap-sheet" @click.stop>
      <view class="ap-title">切换辖区</view>
      <view class="ap-search-bar">
        <view class="ap-search-box">
          <image src="/static/svg/search.svg" class="ap-search-icon" mode="aspectFit" />
          <input
            class="ap-search-input"
            v-model="keyword"
            placeholder="请输入所属街道 / 社区 / 网格"
            confirm-type="search"
            @confirm="doSearch"
          />
        </view>
        <view class="ap-search-btn" @click="doSearch">搜索</view>
      </view>
      <scroll-view class="ap-list" scroll-y>
        <view
          v-for="item in filteredList"
          :key="item.value"
          class="ap-item"
          :class="{ active: tempSelected === item.value }"
          @click="select(item.value)"
        >
          <view class="ap-item-text">
            <text class="ap-item-name">{{ item.label }}</text>
            <text v-if="item.sub" class="ap-item-sub">{{ item.sub }}</text>
          </view>
          <view class="ap-radio" :class="{ checked: tempSelected === item.value }">
            <view v-if="tempSelected === item.value" class="ap-radio-dot" />
          </view>
        </view>
        <view v-if="filteredList.length === 0" class="ap-empty">未找到匹配区域</view>
      </scroll-view>
      <view class="ap-footer">
        <button class="ap-btn ap-btn-cancel" @click="close">取消</button>
        <button class="ap-btn ap-btn-confirm" @click="confirm">确定</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  current: string
}>()

const emit = defineEmits<{
  close: []
  confirm: [value: string]
}>()

const areas = [
  { label: '民生路社区', value: 'minshenglu', sub: '江汉区·社区' },
  { label: '江汉路社区', value: 'jianghanlushequ', sub: '社区' },
  { label: '步行街网格', value: 'buxingjie', sub: '网格' },
  { label: '循礼门网格', value: 'xunlimenwg', sub: '网格' },
  { label: '商圈网格', value: 'shangquanwg', sub: '网格' },
]

const keyword = ref('')
const tempSelected = ref(props.current)

watch(() => props.visible, (v) => {
  if (v) {
    tempSelected.value = props.current
    keyword.value = ''
  }
})

const filteredList = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return areas
  return areas.filter(a =>
    a.label.toLowerCase().includes(kw) ||
    (a.sub && a.sub.toLowerCase().includes(kw)),
  )
})

function select(value: string) {
  tempSelected.value = value
}

function doSearch() {
  // 搜索已在 computed 中处理
}

function close() {
  emit('close')
}

function confirm() {
  emit('confirm', tempSelected.value)
}
</script>

<style scoped>
.ap-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}
.ap-sheet {
  width: 100%;
  max-height: 70vh;
  background: #fff;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ap-title {
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  padding: 16px;
}
.ap-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 14px;
  flex-shrink: 0;
}
.ap-search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 10px;
  background: #f5f7fa;
  border-radius: 8px;
}
.ap-search-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.ap-search-input {
  flex: 1;
  font-size: 13px;
  color: #303642;
  background: transparent;
}
.ap-search-btn {
  height: 38px;
  padding: 0 18px;
  background: #1677ff;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ap-list {
  flex: 1;
  min-height: 300px;
  max-height: 360px;
}
.ap-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  margin: 10px 15px;
  background: #fbfdff;
  border: 1px solid #e5eaf2;
  border-radius: 10px;
}
.ap-item.active {
  border-color: #1677ff;
}
.ap-item-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ap-item-name {
  font-size: 15px;
  color: #1f2937;
  font-weight: 600;
}
.ap-item.active .ap-item-name {
  color: #1677ff;
}
.ap-item-sub {
  font-size: 12px;
  color: #98a2b3;
}
.ap-radio {
  width: 20px;
  height: 20px;
  border: 2px solid #d0d5dd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ap-radio.checked {
  border-color: #1677ff;
}
.ap-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1677ff;
}
.ap-empty {
  text-align: center;
  padding: 40px 16px;
  color: #98a2b3;
  font-size: 13px;
}
.ap-footer {
  display: flex;
  gap: 12px;
  padding: 12px 16px 20px;
  border-top: 1px solid #f0f2f5;
  flex-shrink: 0;
}
.ap-btn {
  flex: 1;
  height: 42px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: none;
}
.ap-btn-cancel {
  background: #f5f7fa;
  color: #475467;
}
.ap-btn-confirm {
  background: #1677ff;
  color: #fff;
}
</style>
