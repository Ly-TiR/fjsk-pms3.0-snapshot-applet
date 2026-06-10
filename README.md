# test-applet

基于 **uni-app 3.0 (Vue 3 + Vite + TypeScript)** 的纯净基础框架，剔除了所有业务代码，保留核心基建能力。

## 技术栈

| 类别 | 技术 |
|------|------|
| **跨端框架** | uni-app 3.0 |
| **UI 框架** | Vue 3.4 (Composition API) |
| **构建工具** | Vite 5 |
| **语言** | TypeScript |
| **包管理** | pnpm (monorepo workspace) |
| **路由/布局** | @uni-helper/vite-plugin-uni-pages + uni-layouts |
| **CSS 方案** | UnoCSS + SCSS |
| **状态管理** | Pinia + pinia-plugin-persistedstate |
| **请求封装** | uni.addInterceptor + http 工具函数 |
| **服务端状态** | @tanstack/vue-query |
| **SSE 流式传输** | 内置跨平台 SSE 模块 |

## 目录结构

```
├── env/                     # 环境变量
│   ├── .env                 # 通用
│   ├── .env.development     # 开发
│   └── .env.production      # 生产
├── src/
│   ├── api/                 # API 接口层
│   ├── components/          # 公共组件
│   ├── hooks/               # 组合式函数
│   │   ├── useRequest.ts    # 通用请求 Hook
│   │   ├── useUpload.ts     # 文件上传 Hook
│   │   └── useCustomNavbar.ts # 自定义导航栏
│   ├── interceptors/        # 拦截器
│   │   ├── request.ts       # HTTP 请求拦截
│   │   └── prototype.ts     # 原型链 polyfill
│   ├── layouts/             # 布局组件
│   ├── pages/               # 页面
│   ├── service/             # 业务服务
│   ├── sse/                 # SSE 流式传输模块 ★
│   │   └── index.ts         # createSSEClient / useSSE
│   ├── store/               # Pinia 状态管理
│   ├── style/               # 全局样式
│   ├── types/               # 自动生成的类型文件
│   ├── utils/               # 工具函数
│   │   ├── http.ts          # HTTP 封装 (GET/POST)
│   │   ├── index.ts         # 通用工具
│   │   ├── platform.ts      # 平台检测
│   │   └── toast.ts         # Toast 弹窗
│   ├── App.vue              # 根组件
│   ├── main.ts              # 入口
│   ├── env.d.ts             # 环境变量类型声明
│   ├── typings.d.ts         # 全局类型声明
│   └── uni.scss             # uni-app 样式变量
├── index.html               # H5 入口 HTML
├── manifest.config.ts       # uni-app 清单配置
├── pages.config.ts          # 页面配置
├── package.json
├── tsconfig.json
├── uno.config.ts            # UnoCSS 配置
└── vite.config.ts           # Vite 构建配置
```

## 使用步骤

_使用 pnpm_

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **微信小程序开发**
   ```bash
   pnpm dev:mp
   ```
   在微信小程序开发者工具中，指向编译后的目录 `dist/dev/mp-weixin`

3. **H5 开发**
   ```bash
   pnpm dev:h5
   ```

4. **正式环境编译**
   ```bash
   pnpm build:mp
   ```

## SSE 流式传输使用指南

### 基本用法（Vue Composable）

```vue
<script setup lang="ts">
import { useSSE } from '@/sse'

const { messages, fullText, isConnected, connect, abort, clear } = useSSE({
  url: 'https://api.example.com/chat/stream',
  method: 'POST',
  body: { prompt: '你好' },
  autoReconnect: true,
  onMessage: (msg) => {
    console.log('收到消息:', msg.data)
  },
  onDone: () => {
    console.log('流式传输完成')
  },
  onError: (err) => {
    console.error('错误:', err)
  },
})

// 手动触发连接
connect()

// 手动中断
abort()
</script>
```

### 基础用法（直接创建客户端）

```typescript
import { createSSEClient } from '@/sse'

const client = createSSEClient(
  {
    url: 'https://api.example.com/stream',
    method: 'POST',
    body: { prompt: 'hello' },
    autoReconnect: true,
    maxRetries: 3,
  },
  {
    onMessage: (msg) => console.log('收到:', msg.data),
    onDone: () => console.log('流结束'),
    onError: (err) => console.error('错误:', err),
  },
)

await client.connect()
// 中断: client.abort()
```

### 平台适配说明

| 平台 | 实现方式 | 备注 |
|------|---------|------|
| H5 | fetch + ReadableStream | 完整标准 SSE 支持 |
| 微信小程序 | uni.request + enableChunked | 需基础库 >= 2.20.1 |
| App | fetch + ReadableStream | 同 H5 |
