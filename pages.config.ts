import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [
    {
      path: 'pages/index/index',
      type: 'home',
      style: { navigationBarTitleText: '首页' },
    },
  ],
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'test-applet',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
  },
})
