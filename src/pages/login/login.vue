<template>
  <view class="login-page">
    <!-- 顶部蓝色区域 -->
    <view class="login-hero">
      <view class="hero-logo">
        <view class="logo-mark">随</view>
        <view>
          <view class="logo-title">随手拍</view>
          <view class="logo-sub">江汉流域日常巡查工单</view>
        </view>
      </view>
      <view class="hero-slogan">问题发现、处置流转、复核闭合一屏接入</view>
      <view class="hero-desc">面向网格员、承办部门和街道治理岗的移动端闭环入口</view>
    </view>

    <!-- 登录表单卡片 -->
    <view class="login-card">
      <view class="card-head">
        <text class="card-title">账号登录</text>
        <view class="role-tag">网格治理岗</view>
      </view>
      <view class="card-subtitle">使用演示账号进入今日随手拍工作台</view>
      <view class="form-item">
        <text class="form-label">账号</text>
        <input
          class="input-box"
          type="text"
          placeholder="请输入账号"
          v-model="formData.username"
        />
      </view>
      <view class="form-item">
        <text class="form-label">密码</text>
        <input
          class="input-box"
          type="text"
          password
          placeholder="请输入密码"
          v-model="formData.password"
        />
      </view>
      <view class="demo-hint">演示账号：grid001 / 密码：123456</view>
      <button class="login-btn" @click="handleLogin" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <!-- 信息提示卡片 -->
      <view class="info-card">
        <view class="info-line1">江汉路街道 · 今日随手拍处理中</view>
        <view class="info-line2">待受理 待处置 待复核事项已汇总到移动工作台</view>
      </view>
    </view>


    <!-- 底部水印 -->
    <view class="login-footer">
      <text>江汉路街道治理办</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store'
import { toast } from '@/utils/toast'

const userStore = useUserStore()
const loading = ref(false)

const formData = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  const { username, password } = formData
  if (!username) { toast.warning('请输入账号'); return }
  if (!password) { toast.warning('请输入密码'); return }
  loading.value = true
  try {
    await userStore.login({ username, password })
    toast.success('登录成功')
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/workbench/index' })
    }, 500)
  }
  catch {
    toast.error('登录失败')
  }
  finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f7fb;
}

/* 顶部蓝色区域 - 无左右padding，蓝色铺满 */
.login-hero {
  padding: 54px 20px 22px;
  background: #1677ff;
  color: #fff;
}
.hero-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-mark {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  font-size: 20px;
  font-weight: 900;
}
.logo-title {
  font-size: 20px;
  font-weight: 900;
  line-height: 1.2;
}
.logo-sub {
  margin-top: 3px;
  color: rgba(255,255,255,0.82);
  font-size: 12px;
  font-weight: 600;
}
.hero-slogan {
  margin-top: 18px;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.35;
}
.hero-desc {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.78);
  line-height: 1.45;
}

/* 登录卡片 */
.login-card {
  margin: 20px 20px 0;
  padding: 20px 16px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15,23,42,0.08);
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.card-title {
  font-size: 18px;
  font-weight: 900;
  color: #101828;
}
.role-tag {
  height: 28px;
  padding: 0 10px;
  border-radius: 14px;
  background: #eef5ff;
  color: #1677ff;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.card-subtitle {
  margin-bottom: 14px;
  font-size: 12px;
  font-weight: 600;
  color: #98a2b3;
}
.form-item {
  margin-bottom: 14px;
}
.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #344054;
}
.input-box {
  width: 100%;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid #d8e4f3;
  border-radius: 8px;
  background: #f8fbff;
  color: #101828;
  font-size: 14px;
}
.demo-hint {
  margin-bottom: 14px;
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
}
.login-btn {
  width: 100%;
  min-height: 46px;
  border: none;
  border-radius: 8px;
  background: #1677ff;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(22,119,255,0.2);
}

/* 信息提示卡片 */
.info-card {
  margin-top: 14px;
  padding: 14px 16px;
  border: 1px solid rgba(22,119,255,0.12);
  border-radius: 10px;
  background: rgba(255,255,255,0.6);
}
.info-line1 {
  font-size: 13px;
  font-weight: 800;
  color: #303642;
  margin-bottom: 4px;
}
.info-line2 {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  line-height: 1.45;
}

/* 底部 */
.login-footer {
  margin-top: auto;
  padding: 20px 20px 20px;
  text-align: center;
  color: #b0b8c5;
  font-size: 11px;
  font-weight: 600;
}
</style>
