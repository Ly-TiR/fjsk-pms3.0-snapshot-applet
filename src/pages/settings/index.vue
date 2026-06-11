<template>
  <view class="page-body">
    <view class="card">
      <view class="section-title">账号设置</view>
      <view class="settings-list">
        <view class="settings-row"><text>当前用户</text><text>{{ userStore.userInfo.realName || '当前用户' }}</text></view>
        <view class="settings-row"><text>登录账号</text><text>{{ userStore.userInfo.username }}</text></view>
        <view class="settings-row"><text>所属组织</text><text>{{ userStore.userInfo.orgName || '江汉路街道' }}</text></view>
        <view class="settings-row"><text>当前身份</text><text>{{ userStore.userInfo.roleName || '随手拍处理' }}</text></view>
      </view>
    </view>
    <view class="card" style="margin-top:12px" @click="handleLogout">
      <view class="logout-btn">退出登录</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
const userStore = useUserStore()
function handleLogout() {
  uni.showModal({
    title: '确认退出登录？',
    success: async (res) => {
      if (res.confirm) { await userStore.logout(); uni.reLaunch({ url: '/pages/login/login' }) }
    },
  })
}
</script>

<style scoped>
.page-body { padding: 14px; }
.section-title { font-size: 17px; font-weight: 700; margin-bottom: 12px; }
.settings-list { display: grid; gap: 8px; }
.settings-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed rgba(116,134,168,0.18); color: #667085; font-size: 14px; }
.logout-btn { color: #dc2626; font-size: 16px; font-weight: 700; text-align: center; padding: 8px; cursor: pointer; }
</style>
