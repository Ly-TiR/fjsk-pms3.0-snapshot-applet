<script lang="ts" setup>
import { useCustomNavbar } from '@/hooks/useCustomNavbar'

defineOptions({ name: 'Home' })

const { statusBarHeight, navContentHeight } = useCustomNavbar()
const title = ref('Hello uni-app 3.0')

onLoad(() => {
  console.log('首页加载完成')
})
</script>

<template>
  <view>
    <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content" :style="{ height: navContentHeight }">
        <text class="nav-title">首页</text>
      </view>
    </view>
    <view class="p-8 center flex-col">
      <text class="text-36rpx font-bold mb-4">{{ title }}</text>
      <text class="text-28rpx text-gray-500">纯净基础框架 - 可从这里开始开发</text>
    </view>
  </view>
</template>
