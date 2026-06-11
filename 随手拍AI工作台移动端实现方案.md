## Plan: 随手拍 AI 工作台 · 移动端 APP 实现方案

**TL;DR** — 基于 uni-app (Vue3+TS+Pinia+UnoCSS) 框架，参考 `fjsk-pms3.0-digitSite-applet` 的工程架构（登录/拦截器/Store/路由守卫），将单体 HTML 原型拆分为 ~12 个 Page + ~25 个公共组件 + 6 个 AI 智能体模块，实现完整的「随手拍街道治理」移动端闭环。

---

### 一、项目结构设计

```
fjsk-pms3.0-snapshot-applet/
├── src/
│   ├── api/                          # API 层（参考 digitSite-applet）
│   │   ├── login.ts                  # 登录/登出/token刷新
│   │   ├── login.typings.ts          # 登录类型定义
│   │   ├── snapshot.ts               # 随手拍 CRUD API
│   │   └── ai.ts                     # AI 智能体调用 API（6个agent）
│   │
│   ├── store/                        # Pinia 状态管理（参考 digitSite-applet）
│   │   ├── index.ts                  # store 入口 + 持久化插件
│   │   ├── user.ts                   # 用户/token/登录状态
│   │   ├── snapshot.ts               # 随手拍列表/筛选/分页状态
│   │   └── ai.ts                     # AI 会话/消息/上下文状态
│   │
│   ├── interceptors/                 # 拦截器（参考 digitSite-applet）
│   │   ├── index.ts                  # 统一导出
│   │   ├── request.ts                # HTTP 拦截（token 注入）
│   │   ├── route.ts                  # 路由守卫（登录黑名单）
│   │   └── prototype.ts              # 原型兼容 polyfill
│   │
│   ├── hooks/                        # 组合式函数
│   │   ├── useRequest.ts             # 通用请求 Hook（参考）
│   │   ├── usePageAuth.ts            # 页面级登录鉴权（参考）
│   │   ├── useUpload.ts              # 上传 Hook
│   │   └── useSnapshot.ts            # 随手拍业务 Hook
│   │
│   ├── layouts/                      # 布局系统
│   │   ├── default.vue               # 默认布局
│   │   └── tabbar.vue                # 带底部导航布局（5 Tab）
│   │
│   ├── pages/                        # 📄 页面（按业务模块拆分）
│   │   ├── login/                    # 登录页
│   │   │   └── login.vue
│   │   ├── workbench/                # 工作台首页
│   │   │   └── index.vue
│   │   ├── ledger/                   # 随手拍列表（台账）
│   │   │   └── index.vue
│   │   ├── create/                   # 随手拍发起
│   │   │   └── index.vue
│   │   ├── detail/                   # 随手拍详情
│   │   │   └── index.vue
│   │   ├── mine/                     # 我的
│   │   │   └── index.vue
│   │   ├── mine-initiated/           # 我发起的
│   │   │   └── index.vue
│   │   ├── task-list/                # 我的待处理/已办/驳回
│   │   │   └── index.vue
│   │   ├── messages/                 # 消息通知
│   │   │   └── index.vue
│   │   ├── settings/                 # 账号设置
│   │   │   └── index.vue
│   │   ├── ai-workbench/             # 小匠 AI 对话工作台
│   │   │   └── index.vue
│   │   └── profile/                  # 个人资料
│   │       └── index.vue
│   │
│   ├── components/                   # 🧩 公共组件
│   │   ├── fg-navbar/                # 自定义导航栏（品牌蓝色 + 返回胶囊）
│   │   │   └── fg-navbar.vue
│   │   ├── fg-tabbar/                # 底部 5 Tab 导航
│   │   │   ├── fg-tabbar.vue
│   │   │   └── tabbarList.ts
│   │   ├── snapshot-card/            # 随手拍列表卡片
│   │   │   └── snapshot-card.vue
│   │   ├── snapshot-status-tag/      # 状态标签（草稿/待受理/已办结...）
│   │   │   └── snapshot-status-tag.vue
│   │   ├── search-bar/               # 搜索栏（列表通用）
│   │   │   └── search-bar.vue
│   │   ├── status-tabs/              # 状态筛选 Tab 栏
│   │   │   └── status-tabs.vue
│   │   ├── chip-tabs/                # Chip 样式 Tab 栏
│   │   │   └── chip-tabs.vue
│   │   ├── filter-sheet/             # 筛选面板（底部弹出）
│   │   │   └── filter-sheet.vue
│   │   ├── bottom-sheet/             # 通用底部弹出层
│   │   │   └── bottom-sheet.vue
│   │   ├── confirm-dialog/           # 确认弹窗
│   │   │   └── confirm-dialog.vue
│   │   ├── toast/                    # 轻提示
│   │   │   └── toast.vue
│   │   ├── upload-media/             # 上传影像/附件组件
│   │   │   └── upload-media.vue
│   │   ├── media-thumb/              # 媒体缩略图预览
│   │   │   └── media-thumb.vue
│   │   ├── flow-timeline/            # 流转时间轴
│   │   │   └── flow-timeline.vue
│   │   ├── form-field/               # 通用表单字段
│   │   │   └── form-field.vue
│   │   ├── picker-sheet/             # 通用选择器弹出层
│   │   │   └── picker-sheet.vue
│   │   ├── category-picker/          # 事项分类选择器（级联）
│   │   │   └── category-picker.vue
│   │   ├── area-picker/              # 社区/网格/点位选择
│   │   │   └── area-picker.vue
│   │   ├── level-picker/             # 紧急程度选择
│   │   │   └── level-picker.vue
│   │   ├── empty-state/              # 空状态占位
│   │   │   └── empty-state.vue
│   │   ├── fab-menu/                 # 浮动快捷菜单
│   │   │   └── fab-menu.vue
│   │   └── section-card/             # 通用分区卡片容器
│   │       └── section-card.vue
│   │
│   ├── ai-components/                # 🤖 AI 专用组件
│   │   ├── xj-chat-panel/            # AI 对话面板（消息列表+输入框）
│   │   │   └── xj-chat-panel.vue
│   │   ├── xj-message-bubble/        # AI 对话气泡
│   │   │   └── xj-message-bubble.vue
│   │   ├── xj-result-card/           # AI 结果卡片
│   │   │   └── xj-result-card.vue
│   │   ├── xj-page-card/             # 页面级 AI 入口卡片（可折叠）
│   │   │   └── xj-page-card.vue
│   │   ├── xj-picker-card/           # 选择器内 AI 提示卡片
│   │   │   └── xj-picker-card.vue
│   │   ├── xj-context-bar/           # AI 上下文 Chip 条
│   │   │   └── xj-context-bar.vue
│   │   ├── xj-agent-selector/        # 智能体选择器
│   │   │   └── xj-agent-selector.vue
│   │   ├── xj-draft-preview/         # AI 草稿预览
│   │   │   └── xj-draft-preview.vue
│   │   ├── xj-node-assist/           # 节点 AI 辅助入口
│   │   │   └── xj-node-assist.vue
│   │   ├── xj-review-card/           # 复核 AI 卡片（处置/方案/办结审核）
│   │   │   └── xj-review-card.vue
│   │   └── xj-flow-card/             # 流转意见 AI 卡片
│   │       └── xj-flow-card.vue
│   │
│   ├── service/                      # 业务逻辑层
│   │   ├── snapshot/                 # 随手拍业务
│   │   │   ├── workflow.ts           # 流程节点/状态机逻辑
│   │   │   ├── filter.ts             # 筛选/搜索逻辑
│   │   │   ├── form.ts               # 表单校验/草稿逻辑
│   │   │   └── ai-touchpoint.ts      # AI 触点映射
│   │   └── ai/                       # AI 智能体
│   │       ├── agents.ts             # 6 智能体定义与路由
│   │       ├── prompts.ts            # 提示词模板
│   │       ├── context.ts            # 上下文组装
│   │       └── output-contract.ts    # 输出契约/卡片 Schema
│   │
│   ├── utils/                        # 工具函数
│   │   ├── http.ts                   # HTTP 封装（参考）
│   │   ├── index.ts                  # 通用工具
│   │   ├── platform.ts               # 平台检测
│   │   ├── toast.ts                  # Toast 封装
│   │   └── uploadFile.ts             # 上传封装
│   │
│   ├── types/                        # 类型定义
│   │   ├── snapshot.d.ts             # 随手拍记录/表单/筛选类型
│   │   ├── ai.d.ts                   # AI 消息/会话/卡片类型
│   │   └── workflow.d.ts             # 流程节点/状态类型
│   │
│   ├── style/                        # 全局样式
│   │   ├── index.scss                # 全局样式入口
│   │   └── variables.scss            # CSS 变量（品牌色/间距/圆角/阴影）
│   │
│   ├── static/                       # 静态资源
│   │   ├── images/                   # 图标/背景
│   │   └── tabbar/                   # TabBar 图标
│   │
│   ├── pages.json                    # uni-app 页面配置
│   ├── App.vue                       # 应用入口
│   ├── main.ts                       # 主入口
│   └── manifest.json                 # 应用配置
│
├── uno.config.ts                     # UnoCSS 配置（参考 digitSite-applet）
├── vite.config.ts                    # Vite 配置
├── pages.config.ts                   # 页面定义
├── tsconfig.json
├── package.json
└── env/                              # 环境变量
```

---

### 二、公共组件拆分清单（~25 个）

**Phase 1: 基础 UI 组件（无业务耦合）**
1. `fg-navbar` — 自定义导航栏（蓝色品牌渐变 + 状态栏 + 返回胶囊 + 右侧操作按钮）
2. `fg-tabbar` — 底部 5 Tab 导航（首页/随手拍/发起/小匠/我的）
3. `toast` — 全局轻提示
4. `bottom-sheet` — 通用底部弹出层（带拖拽手柄 + 遮罩）
5. `confirm-dialog` — 确认对话框
6. `empty-state` — 空状态占位
7. `section-card` — 分区卡片容器
8. `fab-menu` — 浮动快捷菜单

**Phase 2: 列表通用组件**
9. `search-bar` — 搜索栏（带筛选按钮）
10. `status-tabs` — 水平滚动状态 Tab（待受理/待处置/...）
11. `chip-tabs` — Chip 样式 Tab（基础信息/处置反馈/复核/...）
12. `filter-sheet` — 筛选面板（左侧导航 + 右侧选项，按街道/社区/分类/来源等维度）
13. `snapshot-card` — 随手拍列表卡片（含状态标签/元信息/AI 风险标签/操作按钮）
14. `snapshot-status-tag` — 状态标签（7 种主状态 + 6 种协同状态配色）

**Phase 3: 表单通用组件**
15. `form-field` — 通用表单字段（标签/只读/选择器触发）
16. `picker-sheet` — 通用选择器弹出层
17. `category-picker` — 事项分类三级级联选择器
18. `area-picker` — 社区/网格/点位选择
19. `level-picker` — 紧急程度选择
20. `upload-media` — 媒体上传组件（拍照/图库/文件）
21. `media-thumb` — 媒体缩略图预览（图片/视频/文件）
22. `flow-timeline` — 流转意见时间轴

**Phase 4: AI 专用组件（11 个，见 §四）**

---

### 三、业务大模块划分（6 大模块 + 登录）

| 模块 | 入口页面 | 核心功能 | 涉及 AI 触点 |
|------|---------|---------|------------|
| **M0 · 登录鉴权** | `pages/login/login` | 账号密码登录、Token 存储、路由守卫、401 自动跳转 | — |
| **M1 · 工作台首页** | `pages/workbench/index` | 随手拍总览（待处理/风险/治理热区）、今日建议、快捷入口、消息铃铛 | ledger-analysis, street-report |
| **M2 · 随手拍列表** | `pages/ledger/index` | 搜索/筛选/分页、状态 Tab 切换、卡片点击进详情、草稿删除、导出 | ledger-analysis |
| **M3 · 随手拍发起** | `pages/create/index` | 现场影像上传、事项描述（AI 识图/润色/补充）、分类选择、紧急程度、提交/保存草稿 | image-recognition, fill-assist |
| **M4 · 随手拍详情** | `pages/detail/index` | 基础信息/处置方案编制/承办部门处置/协同反馈/复核/办结审核/流转意见 7 个子 Tab | history-case, fill-assist, review-audit |
| **M5 · 我的/处理** | `pages/mine`, `pages/task-list`, `pages/mine-initiated`, `pages/messages`, `pages/settings` | 个人中心、待办/已办/驳回列表、我发起的、消息通知、账号设置 | — |
| **M6 · 小匠 AI** | `pages/ai-workbench/index` | 对话式 AI 工作台、多智能体切换、上下文管理、历史会话 | 6 智能体 |

---

### 四、AI 组件体系（11 个）

按原型的 `xj-*` 前缀组件抽象：

1. `xj-chat-panel` — AI 对话面板（消息流 + 输入区 + 语音/键盘切换 + 发送 + 加号菜单）
2. `xj-message-bubble` — 对话气泡（用户/AI/系统 + typing 动画）
3. `xj-result-card` — AI 结构化结果卡片（ledger/draft/case/review/warning 等类型）
4. `xj-page-card` — 页面级可折叠 AI 入口卡片（列表/详情/发起页通用）
5. `xj-picker-card` — 选择器内 AI 提示卡片
6. `xj-context-bar` — AI 上下文 Chip 条（多 chip 折叠/展开/清空）
7. `xj-agent-selector` — 智能体选择器（6 个 agent 的启用/切换）
8. `xj-draft-preview` — AI 草稿预览卡片（含"插入"/"重新生成"/"撤销"）
9. `xj-node-assist` — 节点 AI 辅助入口卡片（处置方案/处置反馈/复核判断/办结建议）
10. `xj-review-card` — 复核 AI 卡片（处置影像风险/处置方案审核/通过驳回建议）
11. `xj-flow-card` — 流转意见 AI 卡片（流转总结/卡点分析/驳回原因提取）

---

### 五、登录登出 Token 校验流程（参考 digitSite-applet）

**架构复用（来自 digitSite-applet）：**
- Pinia `userStore`（持久化 token + userInfo）
- `requestInterceptor`（HTTP 拦截器自动注入 `Authorization: Bearer ${token}`）
- `routeInterceptor`（navigateTo/redirectTo/switchTab 黑名单拦截，未登录→登录页）
- `usePageAuth()`（`onLoad` 时校验，兜底 redirectTo 登录页）

**登录流程：**
1. 用户进入 `pages/login/login`（非 tab 页，`navigationStyle: custom`）
2. 输入账号密码 → `userStore.login({ username, password, code, uuid })`
3. 登录成功后调 `getUserInfo()` → 存入 store（自动持久化到 localStorage）
4. 重定向回 `redirect` 参数页或默认工作台
5. App 启动时 `onLaunch` 检查 token 有效性（`/user/info`），失效则跳登录

**登出流程：**
1. 用户在我的页点击"退出登录" → 确认弹窗
2. `userStore.logout()` → 调后端 `/user/logout` + 清除本地 token/userInfo
3. `reLaunch` 到登录页

**Token 刷新：**
- 请求拦截器 401 → 清除 token → 跳登录页
- （一期可用简版，token 不过期或仅在 401 时跳转）

**样式：登录页采用原型 HTML 中的 `snapshot-login-*` 样式体系（蓝色渐变背景 + 品牌标识 + 场景卡片 + 白色表单面板），不照搬 digitSite-applet 的 login-bg 图片风格。**

---

### 六、Pages 路由与 TabBar 配置

```jsonc
// pages.config.ts
{
  pages: [
    // M0: 登录（非 Tab 页）
    { path: "pages/login/login", type: "home", style: { navigationStyle: "custom" } },
    // M1-M6: Tab 页
    { path: "pages/workbench/index", layout: "tabbar", style: { navigationStyle: "custom" } },
    { path: "pages/ledger/index", layout: "tabbar", style: { navigationStyle: "custom" } },
    { path: "pages/create/index", layout: "tabbar", style: { navigationStyle: "custom" } },
    { path: "pages/ai-workbench/index", layout: "tabbar", style: { navigationStyle: "custom" } },
    { path: "pages/mine/index", layout: "tabbar", style: { navigationStyle: "custom" } },
    // Sub pages（非 Tab）
    { path: "pages/detail/index", style: { navigationStyle: "custom" } },
    { path: "pages/task-list/index", style: { navigationStyle: "custom" } },
    { path: "pages/mine-initiated/index", style: { navigationStyle: "custom" } },
    { path: "pages/messages/index", style: { navigationStyle: "custom" } },
    { path: "pages/settings/index", style: { navigationStyle: "custom" } },
    { path: "pages/profile/index", style: { navigationStyle: "custom" } },
  ],
  tabBar: {
    list: [
      { pagePath: "pages/workbench/index", text: "首页", iconPath: "...", selectedIconPath: "..." },
      { pagePath: "pages/ledger/index", text: "随手拍", iconPath: "...", selectedIconPath: "..." },
      { pagePath: "pages/create/index", text: "发起", iconPath: "...", selectedIconPath: "..." },
      { pagePath: "pages/ai-workbench/index", text: "小匠", iconPath: "...", selectedIconPath: "..." },
      { pagePath: "pages/mine/index", text: "我的", iconPath: "...", selectedIconPath: "..." },
    ]
  }
}
```

TabBar 5 项：
1. 首页 (`workbench`) — 工作台总览
2. 随手拍 (`ledger`) — 列表台账
3. 发起 (`create`) — 中间凸起大按钮（`nav-item-plus` 样式）
4. 小匠 (`ai-workbench`) — AI 对话工作台
5. 我的 (`mine`) — 个人中心/待办入口

---

### 七、关键数据流

```
用户操作 → Page Component → Store Action → API (http.ts) → Backend
                ↑                                    ↓
          响应渲染 ← Store State ←── 数据解析 ←── Response
                
Token 流：
  login() → setUserInfo({token}) → pinia persist → requestInterceptor 自动注入 Authorization header
  401 → removeUserInfo() → routeInterceptor 拦截 → reLaunch login
```

**Store 设计（3 个）：**
- `userStore`：token, username, avatar, role, currentProject（复用 digitSite-applet 模式）
- `snapshotStore`：列表数据、筛选条件、当前详情记录、表单草稿、流程状态
- `aiStore`：会话列表、消息历史、选中智能体、上下文对象、草稿状态

---

### 八、实施阶段（8 个 Phase）

**Phase 1: 工程骨架**（*并行*）
1. 基于 `fjsk-pms3.0-digitSite-applet` 复制工程框架（vite/tsconfig/uno/pinia）
2. 配置 `pages.config.ts` 路由 + TabBar
3. 创建 CSS 变量体系（原型中的 `:root` 变量 → `style/variables.scss`）
4. 搭建 Store 骨架（user/snapshot/ai）+ 持久化
5. 搭建拦截器骨架（request/route/prototype）

**Phase 2: 登录鉴权**（*依赖 Phase 1*）
6. 实现 `pages/login/login.vue`（参考 digitSite-applet 逻辑 + 原型样式）
7. 实现 `userStore`（login/logout/getUserInfo/token 管理）
8. 实现 `requestInterceptor`（token 注入 + 401 处理）
9. 实现 `routeInterceptor`（黑名单守卫）

**Phase 3: 基础公共组件**（*依赖 Phase 1，与 Phase 2 并行*）
10. `fg-navbar`、`fg-tabbar`、`toast`、`bottom-sheet`、`confirm-dialog`
11. `empty-state`、`section-card`、`fab-menu`

**Phase 4: 列表模块 M1+M2**（*依赖 Phase 2+3*）
12. `pages/workbench/index` — 工作台首页（数据卡片/阶段进度/治理热区/今日建议）
13. `pages/ledger/index` — 随手拍列表（搜索/筛选/状态Tab/卡片列表/滑动删除）
14. 列表通用组件：`search-bar`、`status-tabs`、`filter-sheet`、`snapshot-card`、`snapshot-status-tag`

**Phase 5: 发起模块 M3**（*依赖 Phase 2+3*）
15. `pages/create/index` — 发起页（上传/识图/描述/分类/紧急程度/提交）
16. 表单组件：`form-field`、`picker-sheet`、`category-picker`、`area-picker`、`level-picker`
17. 上传组件：`upload-media`、`media-thumb`

**Phase 6: 详情模块 M4**（*依赖 Phase 2+3+5 部分组件*）
18. `pages/detail/index` — 详情页（7 个子 Tab：基础信息/处置方案编制/承办部门处置/协同反馈/复核/办结审核/流转意见）
19. `chip-tabs`、`flow-timeline` 组件
20. 各子 Tab 的业务逻辑（只读查看/可编辑回复/审核操作）

**Phase 7: 我的/处理模块 M5**（*依赖 Phase 2+3*）
21. `pages/mine/index` — 我的（个人资料/统计/入口列表）
22. `pages/task-list/index` — 待处理/已办/驳回列表
23. `pages/mine-initiated/index` — 我发起的列表
24. `pages/messages/index` — 消息通知
25. `pages/settings/index` + `pages/profile/index`

**Phase 8: AI 工作台 M6 + AI 组件**（*依赖 Phase 1-7 业务页完成*）
26. `pages/ai-workbench/index` — AI 对话工作台（全屏聊天 + 智能体 + 上下文）
27. 11 个 AI 组件（`xj-*`）
28. `service/ai/` — 6 智能体定义、提示词、上下文组装、输出契约
29. `api/ai.ts` — AI 调用 API（对接 Qwen）
30. 各业务页面嵌入 AI 触点（发起页识图、详情页复核建议等）

---

### 九、样式策略

- **CSS 变量体系**：原型的 `:root` 变量完整迁移（`--brand: #1677ff`, `--bg: #f3f5f8`, `--text: #1f2329`, `--radius-*`, `--shadow-*` 等）
- **UnoCSS**：配置主题色/常用工具类，与 digitSite-applet 保持一致
- **导航栏**：蓝色渐变 `linear-gradient(180deg, #1768dc 0%, #2478f6 58%, #2f86f8 100%)`
- **底部导航**：毛玻璃效果 `backdrop-filter: blur(10px)` + 中间凸起大按钮
- **卡片**：统一 `border-radius: 8px` + `box-shadow: 0 6px 16px rgba(...)` + 浅蓝边框
- **AI 卡片**：特有的渐变背景（`linear-gradient(135deg, rgba(232,240,255,0.78), rgba(255,255,255,0.92))`）+ 机器人图标

---

### 十、关键决策

1. **样式以原型为准**：所有 UI 样式严格遵循 `随手拍 AI工作台 移动端 Prototype.html`，不照搬 digitSite-applet 的样式
2. **架构参考 digitSite-applet**：登录流程、拦截器、Store 模式、useRequest Hook 等代码组织方式复用
3. **数据字典以统一字典 v1.2 为准**：节点 key、状态枚举、来源枚举全部对齐 WEB 端基准
4. **AI 一期用 Mock**：AI 对话/分析结果先用本地 mock 数据（原型已有的 `buildXiaojiangMockResult` 模式），后续替换为真实 Qwen 调用
5. **组件粒度**：每个原型中的独立 UI 块提取为独立 `.vue` 组件（如 `snapshot-card`、`flow-timeline`、`xj-page-card`）
6. **不支持小程序**：第一阶段仅支持 H5（移动端 Web），后续可按需适配

---

### 十一、验证清单

1. 登录页→输入账号密码→token 存储→自动跳转工作台 ✅
2. 未登录访问受限页→自动拦截→跳登录页 ✅
3. 401 响应→清除 token→跳登录页 ✅
4. 工作台首页：总览数据/阶段进度/治理热区/今日建议 正确渲染 ✅
5. 随手拍列表：搜索/筛选/状态Tab/卡片列表/滑动删除草稿 ✅
6. 随手拍发起：上传影像→AI 识图→填写描述→选择分类/紧急程度→提交/保存草稿 ✅
7. 随手拍详情：7 个子 Tab 切换/只读/可编辑/业务操作按钮 ✅
8. 我的页面：个人资料/统计/入口/退出登录 ✅
9. 待处理列表：按状态 Tab 筛选/进入详情处理 ✅
10. 小匠工作台：对话式交互/AI 卡片渲染/智能体切换/历史会话 ✅
11. AI 内嵌触点：发起页识图、详情页复核建议、列表页分析 ✅
12. 所有 UI 样式与原型一致（蓝色品牌色/卡片阴影/圆角/字体/间距） ✅

---

**Relevant files（参考）**
- `d:\FJSKWorkSpace\fjsk-pms3.0-digitSite-applet\src\store\user.ts` — 用户 Store 模式参考
- `d:\FJSKWorkSpace\fjsk-pms3.0-digitSite-applet\src\interceptors\` — 拦截器模式参考
- `d:\FJSKWorkSpace\fjsk-pms3.0-digitSite-applet\src\api\login.ts` — 登录 API 模式参考
- `d:\FJSKWorkSpace\fjsk-pms3.0-digitSite-applet\src\hooks\usePageAuth.ts` — 页面鉴权 Hook 参考
- `随手拍 AI工作台 移动端 Prototype.html` — UI 样式权威来源
- `随手拍双端统一字典_v1.md` — 数据字段/枚举权威来源
- `随手拍 AI能力需求设计文档_v1.md` — AI 智能体需求权威来源
