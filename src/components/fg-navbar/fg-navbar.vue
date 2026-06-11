<template>
  <view class="fg-navbar">
    <view class="nav-inner">
      <view class="nav-side">
        <view v-if="leftArrow" class="nav-back" @click="handleClickLeft">
          <text class="back-arrow">‹</text>
        </view>
      </view>
      <text class="nav-title">
        <slot>{{ title }}</slot>
      </text>
      <view class="nav-side nav-side-right">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    leftArrow?: boolean
  }>(),
  {
    title: '',
    leftArrow: true,
  },
)

function handleClickLeft() {
  uni.navigateBack({
    fail() {
      uni.reLaunch({ url: '/pages/workbench/index' })
    },
  })
}
</script>

<style scoped>
.fg-navbar {
  background: linear-gradient(180deg, #1677ff, #3d8eff);
  color: #fff;
  flex-shrink: 0;
  padding-top: var(--status-bar-height, 44px);
}

.nav-inner {
  height: 65px;
  display: flex;
  align-items: center;
  padding: 0 8px;
}
.nav-side {
  width: 56px;
  display: flex;
  align-items: center;
}
.nav-side-right {
  justify-content: flex-end;
}
.nav-back {
  display: flex;
  align-items: center;
}
.back-arrow {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
}
.nav-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
