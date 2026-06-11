import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { tabBar } from './src/layouts/fg-tabbar/tabbarList'

export default defineUniPages({
  pages: [
    // M0: 登录（非 Tab 页）
    {
      path: 'pages/login/login',
      type: 'home',
      style: { navigationStyle: 'custom' },
    },
    // M1-M6: Tab 页
    {
      path: 'pages/workbench/index',
      type: 'page',
      layout: 'tabbar',
      style: { navigationStyle: 'custom', navigationBarTitleText: '首页' },
    },
    {
      path: 'pages/ledger/index',
      type: 'page',
      layout: 'tabbar',
      style: { navigationStyle: 'custom', navigationBarTitleText: '随手拍' },
    },
    {
      path: 'pages/create/index',
      type: 'page',
      layout: 'tabbar',
      style: { navigationStyle: 'custom', navigationBarTitleText: '发起' },
    },
    {
      path: 'pages/ai-workbench/index',
      type: 'page',
      layout: 'tabbar',
      style: { navigationStyle: 'custom', navigationBarTitleText: '小匠' },
    },
    {
      path: 'pages/mine/index',
      type: 'page',
      layout: 'tabbar',
      style: { navigationStyle: 'custom', navigationBarTitleText: '我的' },
    },
    // Sub pages（非 Tab）
    {
      path: 'pages/detail/index',
      type: 'page',
      style: { navigationStyle: 'custom', navigationBarTitleText: '随手拍详情' },
    },
    {
      path: 'pages/task-list/index',
      type: 'page',
      style: { navigationStyle: 'custom', navigationBarTitleText: '待处理' },
    },
    {
      path: 'pages/mine-initiated/index',
      type: 'page',
      style: { navigationStyle: 'custom', navigationBarTitleText: '我发起的' },
    },
    {
      path: 'pages/messages/index',
      type: 'page',
      style: { navigationStyle: 'custom', navigationBarTitleText: '消息通知' },
    },
    {
      path: 'pages/settings/index',
      type: 'page',
      style: { navigationStyle: 'custom', navigationBarTitleText: '设置' },
    },
    {
      path: 'pages/profile/index',
      type: 'page',
      style: { navigationStyle: 'custom', navigationBarTitleText: '个人资料' },
    },
  ],
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: '随手拍 AI工作台',
    navigationBarBackgroundColor: '#1677ff',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f3f5f8',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^fg-(.*)': '@/components/fg-$1/fg-$1.vue',
    },
  },
  tabBar: tabBar as any,
})
