<template>
  <view class="mine-page">
    <!-- 导航栏 -->
    <FgNavbar title="我的" :left-arrow="false" />

    <!-- 内容滚动区 -->
    <scroll-view scroll-y class="mine-body">
      <view class="mine-body-inner">
        <!-- 个人信息卡片 -->
      <view class="hero-card">
        <view class="hero-main">
          <view class="hero-avatar">{{ initial }}</view>
          <view class="hero-info">
            <view class="hero-name">{{ username }}</view>
            <view class="hero-sub">{{ orgName }} · {{ roleName }}</view>
            <view class="hero-account">账号：{{ account }}</view>
          </view>
          <view class="hero-badge">已登录</view>
        </view>
        <view class="hero-role">
          <text>当前身份</text>
          <text class="hero-role-value">随手拍处理</text>
        </view>
      </view>

      <!-- 我的随手拍 -->
      <view class="section-card">
        <view class="section-head">
          <text class="section-title">我的随手拍</text>
          <text class="section-note">处理记录</text>
        </view>
        <view class="focus-row" @click="goTask('todo')">
          <text class="focus-label">今日重点</text>
          <text class="focus-num">{{ stats.todo }} 条</text>
          <text class="focus-desc">待我处理，暂无超期事项</text>
        </view>
        <view class="focus-row" @click="goTask('initiated')">
          <text class="focus-label">我发起的</text>
          <text class="focus-num">{{ stats.initiated }} 条</text>
          <text class="focus-desc">我上报的随手拍，其中 {{ stats.initiatedDone }} 条已办结</text>
        </view>
        <view class="stat-grid">
          <view class="stat-item" v-for="s in statList" :key="s.label" @click="goTask(s.mode)">
            <text class="stat-num">{{ s.value }}</text>
            <text class="stat-label">{{ s.label }}</text>
            <text class="stat-sub">{{ s.sub }}</text>
          </view>
        </view>
      </view>

      <!-- 账号与系统 -->
      <view class="section-card">
        <view class="section-head">
          <text class="section-title">账号与系统</text>
        </view>
        <view class="entry-list">
          <view class="entry-item" v-for="e in entries" :key="e.title" @click="goPage(e.url)">
            <image :src="e.icon" class="entry-icon" mode="aspectFit" />
            <view class="entry-main">
              <text class="entry-title">{{ e.title }}</text>
              <text class="entry-sub">{{ e.sub }}</text>
            </view>
            <image src="/static/svg/chevron-down.svg" class="entry-arrow" mode="aspectFit" />
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="section-card danger-card">
        <view class="entry-list">
          <view class="entry-item is-danger" @click="handleLogout">
            <image src="/static/svg/logout.svg" class="entry-icon danger-icon" mode="aspectFit" />
            <view class="entry-main">
              <text class="entry-title danger-text">退出登录</text>
              <text class="entry-sub">退出当前账号并返回登录页</text>
            </view>
            <image src="/static/svg/chevron-down.svg" class="entry-arrow" mode="aspectFit" />
          </view>
        </view>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'
import FgNavbar from '@/components/fg-navbar/fg-navbar.vue'

const userStore = useUserStore()
const username = computed(() => userStore.userInfo.realName || userStore.userInfo.username || 'grid001')
const account = computed(() => userStore.userInfo.username || 'grid001')
const orgName = computed(() => userStore.userInfo.orgName || '江汉路街道')
const roleName = computed(() => userStore.userInfo.roleName || '网格治理岗')
const initial = computed(() => username.value.charAt(0) || 'U')

const stats = ref({
  todo: 6,
  initiated: 6,
  initiatedDone: 1,
})

const statList = ref([
  { label: '待我处理', value: 6, sub: '当前待处理', mode: 'todo' },
  { label: '我的已办', value: 1, sub: '已处理记录', mode: 'done' },
  { label: '我的驳回', value: 1, sub: '需关注驳回', mode: 'rejected' },
])

const entries = ref([
  { title: '个人资料', sub: '查看当前账号、身份和所属组织', url: '/pages/profile/index', icon: '/static/svg/contact.svg' },
  { title: '消息通知', sub: '有 3 条未读消息', url: '/pages/messages/index', icon: '/static/svg/notice-blue.svg' },
  { title: '系统设置', sub: '提醒、账号安全与缓存设置', url: '/pages/settings/index', icon: '/static/svg/settings.svg' },
  { title: '修改密码', sub: '更新当前账号登录密码', url: '/pages/profile/index', icon: '/static/svg/lock.svg' },
])

function goTask(mode: string) {
  uni.navigateTo({ url: `/pages/task-list/index?mode=${mode}` })
}

function goPage(url: string) {
  uni.navigateTo({ url })
}

function handleLogout() {
  uni.showModal({
    title: '确认退出登录？',
    content: '退出后将进入登录页，数据不会被清除。',
    success: async (res) => {
      if (res.confirm) {
        await userStore.logout()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    },
  })
}
</script>

<style lang="scss" scoped>


/* ==================== 页面布局 ==================== */
.mine-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #f4f7fb;
}

.mine-body {
  flex: 1;
  min-height: 0;
  padding: 2px 14px 24px;
}

.mine-body-inner {
  display: grid;
  gap: 12px;
  align-content: start;
}

/* Hero 卡片 */
.hero-card {
  position: relative;
  padding: 14px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid rgba(226,234,245,0.9);
  box-shadow: 0 8px 18px rgba(15,23,42,0.045);
  overflow: hidden;
}
.hero-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: linear-gradient(90deg, #1677ff 0%, #20b15a 58%, #f59e0b 100%);
}
.hero-main {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  margin-bottom: 12px;
}
.hero-avatar {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #1677ff;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(22,119,255,0.16);
}
.hero-info {
  min-width: 0;
}
.hero-name {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
}
.hero-sub {
  margin-top: 3px;
  font-size: 12px;
  color: #667085;
}
.hero-account {
  margin-top: 3px;
  font-size: 12px;
  color: #667085;
}
.hero-badge {
  align-self: start;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 8px;
  color: #027a48;
  background: #ecfdf3;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}
.hero-role {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  min-height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  background: #f8fafc;
  color: #667085;
  font-size: 12px;
  font-weight: 600;
}
.hero-role-value {
  color: #111827;
  font-weight: 700;
}

/* Section 卡片 */
.section-card {
  padding: 14px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid rgba(226,234,245,0.9);
  box-shadow: 0 8px 18px rgba(15,23,42,0.045);
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 9px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #101828;
}
.section-note {
  font-size: 11px;
  color: #667085;
  font-weight: 700;
}

/* 重点行 */
.focus-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #f8fafc;
  margin-bottom: 8px;
  cursor: pointer;
}
.focus-label {
  font-size: 13px;
  color: #1d2939;
  font-weight: 800;
}
.focus-num {
  font-size: 14px;
  color: #1677ff;
  font-weight: 900;
}
.focus-desc {
  grid-column: 1 / -1;
  font-size: 11px;
  color: #667085;
}

/* 统计网格 */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.stat-item {
  padding: 10px 6px;
  border: 1px solid #e6eef9;
  border-radius: 8px;
  background: #fbfdff;
  text-align: center;
  display: grid;
  gap: 2px;
  cursor: pointer;
}
.stat-num {
  font-size: 18px;
  font-weight: 700;
  color: #1677ff;
}
.stat-label {
  font-size: 11px;
  font-weight: 700;
  color: #667085;
}
.stat-sub {
  font-size: 10px;
  color: #a0a8b5;
}

/* 入口列表 */
.entry-list {
  display: grid;
  gap: 8px;
}
.entry-item {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 16px;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid #e6eef9;
  border-radius: 8px;
  background: #fbfdff;
  cursor: pointer;
}
.entry-icon {
  width: 36px;
  height: 36px;
  padding: 8px;
  border-radius: 10px;
  background: #eaf2ff;
}
.entry-main {
  min-width: 0;
}
.entry-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}
.entry-sub {
  margin-top: 2px;
  font-size: 12px;
  color: #8a97ad;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.entry-arrow {
  width: 14px;
  height: 14px;
  transform: rotate(-90deg);
  opacity: 0.4;
}

/* 危险操作 */
.danger-card {
  border-color: rgba(220,38,38,0.12);
}
.is-danger {
  border-color: rgba(220,38,38,0.12);
}
.danger-text {
  color: #dc2626;
}

.danger-icon {
  width: 36px;
  height: 36px;
  padding: 8px;
  border-radius: 10px;
  background: rgba(220, 38, 38, 0.08);
}
</style>
