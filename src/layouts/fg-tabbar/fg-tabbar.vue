<template>
  <view class="bottom-nav">
    <view
      v-for="item in tabList"
      :key="item.pagePath"
      class="nav-item"
      :class="{
        active: item.pagePath === currentPath,
        'nav-item-plus': item.isSpecial,
      }"
      @click="switchTab(item)"
    >
      <!-- 中间 + 按钮 -->
      <view v-if="item.isSpecial" class="nav-item-icon center-icon" :class="{ 'anim-press': centerPressed }">
        <text class="center-plus" :class="{ 'anim-rotate': centerPressed }">+</text>
      </view>
      <!-- xiaojiang 用 PNG，不随颜色变 -->
      <view v-else-if="item.svgKey === 'xiaojiang'" class="nav-item-icon">
        <image class="nav-icon-png" src="/static/svg/tabbar/xiaojiang.png" mode="aspectFit" />
      </view>
      <!-- 其他：用 image 加载 SVG，active 切蓝色版本 -->
      <view v-else class="nav-item-icon">
        <image
          class="nav-icon-svg"
          :src="item.pagePath === currentPath
            ? '/static/svg/tabbar/' + item.svgKey + '-active.svg'
            : '/static/svg/tabbar/' + item.svgKey + '.svg'"
          mode="aspectFit"
        />
      </view>
      <text class="nav-item-label">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { tabbarList } from './tabbarList'

const tabList = tabbarList
const currentPath = ref('')
const centerPressed = ref(false)

onShow(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  if (page?.route) {
    currentPath.value = page.route
  }
})

function switchTab(item: typeof tabList[0]) {
  if (item.isSpecial) {
    centerPressed.value = true
    setTimeout(() => { centerPressed.value = false }, 300)
  }
  uni.reLaunch({ url: `/${item.pagePath}` })
}
</script>

<style scoped>
.bottom-nav {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 6px 10px 8px;
  background: #fff;
  border-top: 1px solid rgba(22, 119, 255, 0.08);
  box-shadow: 0 -8px 18px rgba(31, 35, 41, 0.05);
  min-height: 58px;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  padding: 3px 0 1px;
  color: #98a2b3;
  font-size: 10.5px;
  line-height: 1.2;
}
.nav-item.active {
  color: #1677ff;
  font-weight: 700;
}
.nav-item-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-item.active .nav-item-icon {
  background: rgba(22, 119, 255, 0.12);
}
.nav-svg {
  width: 20px;
  height: 20px;
}
.nav-icon-png {
  width: 36px;
  height: 36px;
}
.nav-icon-svg {
  width: 22px;
  height: 22px;
}

/* 中间 + 按钮 */
.nav-item-plus {
  transform: translateY(-1px);
}
.nav-item-plus .nav-item-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(180deg, #4c9bff, #1677ff);
  box-shadow: 0 9px 18px rgba(22, 119, 255, 0.26);
  transition: transform 0.25s ease;
}
.center-plus {
  color: #fff;
  font-size: 26px;
  font-weight: 300;
  line-height: 1;
  transition: transform 0.25s ease;
}
/* 点击动画 */
.nav-item-plus .nav-item-icon.anim-press {
  transform: scale(0.94);
}
.center-plus.anim-rotate {
  transform: rotate(90deg);
}
.nav-item-label {
  font-size: 10px;
  font-weight: 600;
}
</style>
