/**
 * tabBar 配置：完全自定义渲染（无原生 tabBar）
 * 所有图标使用 src/static/svg/tabbar/ 下的 SVG 文件
 * 导航使用 reLaunch 替代 switchTab
 */
export const tabbarList = [
  {
    pagePath: 'pages/workbench/index',
    text: '首页',
    svgKey: 'home',
  },
  {
    pagePath: 'pages/ledger/index',
    text: '随手拍',
    svgKey: 'history',
  },
  {
    pagePath: 'pages/create/index',
    text: '',
    isSpecial: true,
  },
  {
    pagePath: 'pages/ai-workbench/index',
    text: '小匠',
    svgKey: 'xiaojiang',
  },
  {
    pagePath: 'pages/mine/index',
    text: '我的',
    svgKey: 'contact',
  },
]

// 自定义 tabBar 无需原生声明
export const tabBar = undefined
