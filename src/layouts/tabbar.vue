<script lang="ts" setup>
import FgTabbar from '@/layouts/fg-tabbar/fg-tabbar.vue'
</script>

<template>
  <view class="tabbar-layout">
    <view class="tabbar-content">
      <slot />
    </view>
    <FgTabbar />
  </view>
</template>

<style scoped>
.tabbar-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.tabbar-content {
  flex: 1;
  overflow-y: auto;
}
</style>
