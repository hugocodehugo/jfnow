# Project Context

最后核对时间：2026-03-18

## 1. 项目是什么

- 这是一个 `Vue 3 + TypeScript + Vite` 的单页前端项目，品牌主名是 `JustFancyNow`，核心业务是 AI 视频/图片生成、模板管理、任务查看、积分充值与分享。
- 当前仓库里真正可依赖的内容是 `src/` 下代码和根目录的部署/支付文档；`README.md` 仍是 Vite 默认模板，几乎不提供业务信息。
- 项目已经安装依赖，根目录存在 `node_modules/` 与 `dist/`，说明本地曾完成安装与构建。

## 2. 技术栈

- 框架：`Vue 3.4` + SFC + `<script setup>`
- 构建：`Vite 5`
- 语言：`TypeScript 5`
- 路由：`vue-router 4`
- 状态管理：`vuex 4`
- 国际化：`vue-i18n 9`
- 网络请求：`axios`
- 样式：`Tailwind CSS` + `PostCSS` + 少量自定义 CSS
- 支付：`Stripe`
- 登录：`Firebase Auth`（主要用于 Google 登录）
- 媒体播放：`video.js` + `@videojs-player/vue`

## 3. 常用命令

```bash
npm run dev
npm run build
npm run preview
npm run check
npm run lint
```

说明：
- 没看到测试文件，当前仓库没有成体系的单测/集成测试。
- `build` 产物输出到 `dist/`。

## 4. 运行时配置

`.env.example` 中声明了这些变量：

```env
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_API_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

但要特别注意：

- `Stripe` 的 publishable key 确实通过 `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY` 在 `src/pages/ProfilePage.vue` 中使用。
- `Firebase` 通过 `import.meta.env.*` 在 `src/lib/firebase.ts` 中使用。
- **API base URL 目前没有走 `VITE_API_BASE_URL`**，而是在 `src/services/api.ts` 中写死了两个 AWS API Gateway 地址：
  - `https://l05mmy1reg.execute-api.ap-northeast-1.amazonaws.com`
  - `https://nlhagwncn2.execute-api.ap-northeast-1.amazonaws.com/prod`

也就是说：如果后续要切环境，优先检查 `src/services/api.ts`，而不是只改 `.env`。

## 5. 目录与模块地图

### 根目录

- `package.json`：脚本和依赖
- `vite.config.ts`：Vite 配置，`@` 指向 `src/`
- `tailwind.config.js`：Tailwind，`darkMode: 'class'`
- `index.html`：默认 SEO、结构化数据、GA 脚本
- `DEPLOYMENT_S3.md`：S3/CloudFront 部署说明
- `STRIPE_SETUP.md`：Stripe 配置说明
- `app.js`：一份旧的原生 JS 页面逻辑，**当前 Vite 应用未引用，基本可视为历史遗留文件**

### `src/`

- `main.ts`：应用入口，注册 `router` / `store` / `i18n`，并执行 `autoLogin(store)`
- `App.vue`：非常薄，只挂 `NavBar`、`router-view`、`CreditToast`
- `router/index.ts`：全部前端路由与登录守卫
- `store/index.ts`：Vuex store，管理认证、积分、任务、模板、UI 状态
- `services/api.ts`：统一 API service，含两个 axios 实例
- `utils/auth.ts`：token 存取、JWT 过期判断、自动登录
- `i18n/index.ts`：加载 `zh/en/ja/ko` 四份 JSON 文案
- `composables/useSEO.ts`：按路由 meta 更新 title/meta/canonical/JSON-LD
- `composables/useTheme.ts`：深浅色主题
- `lib/firebase.ts`：Firebase 初始化和 Google 登录 provider
- `types/`：用户、模板、任务、支付、分页等类型
- `pages/`：业务页面
- `components/`：导航、弹窗、结果查看、任务历史等组件

## 6. 页面与路由

已确认的主要路由：

- `/`：首页，模板展示与入口聚合
- `/auth/login`：登录
- `/auth/register`：注册
- `/video/use-template/:templateId`：基于模板生成视频
- `/dashboard/tasks`：任务列表
- `/dashboard/profile`：个人资料与支付/积分
- `/dashboard/templates`：我的模板
- `/dashboard/my-shares`：我的分享
- `/shared-videos`：公开分享视频
- `/blog`：博客列表
- `/blog/:slug`：博客详情
- `/image-to-video`：图生视频（需要登录）
- `/image-to-image`：图生图（需要登录）
- `/legal/terms-of-service`
- `/legal/privacy-policy`
- `/legal/cookie-policy`

兼容重定向：

- `/login -> /auth/login`
- `/register -> /auth/register`
- `/tasks -> /dashboard/tasks`
- `/profile -> /dashboard/profile`
- `/terms -> /legal/terms-of-service`
- `/privacy -> /legal/privacy-policy`
- `/cookies -> /legal/cookie-policy`
- `/video/quick-create -> /image-to-video`

需要记住的异常点：

- `src/router/index.ts` 里 **导入了** `QuickCreatePage.vue`，但当前并没有真实挂载这个页面。
- 还存在一个旧重定向：`/create -> /video/create`，但当前代码里 **没有** `/video/create` 这个路由，疑似遗留错误。

## 7. 状态管理与本地缓存

### Vuex state 结构

- `user`
  - `isAuthenticated`
  - `token`
  - `userInfo`
  - `credits`
- `tasks`
  - `list`
  - `loading`
- `templates`
  - `list`
  - `loading`
- `ui`
  - `language`
  - `theme`
  - `creditToast`

### 本地存储 key

- `video_gen_token`
- `video_gen_user`
- `language`
- `theme`

### 认证机制

- `main.ts` 启动时会调用 `autoLogin(store)`。
- `utils/auth.ts` 和 `store/index.ts` 都会用 JWT 的 `exp` 字段判断 token 是否过期。
- 自动登录不会请求后端校验用户状态，而是直接根据本地缓存恢复登录。
- 请求头里的 `Authorization: Bearer <token>` 由 `src/services/api.ts` 拦截器统一注入。

### 当前 store 的成熟度

- 认证与积分读取是可工作的。
- `fetchTasks` / `fetchTemplates` / `fetchUserInfo` 还是占位实现，很多页面直接自己调用 `apiService`，而不是完全依赖 Vuex action。
- 因此这个项目是“**半集中式状态管理**”：有 store，但页面内也保留了不少 API/轮询逻辑。

## 8. API 设计与关键端点

`src/services/api.ts` 里有两个 axios 实例：

- `api`
  - baseURL: `https://l05mmy1reg.execute-api.ap-northeast-1.amazonaws.com`
  - timeout: `30000`
- `apiWithLongTimeout`
  - baseURL: `https://nlhagwncn2.execute-api.ap-northeast-1.amazonaws.com/prod`
  - timeout: `300000`

### 已封装的主要能力

- 认证
  - `POST /auth/login`
  - `POST /auth/register`
- 用户
  - `GET /users/profile`
  - `PUT /users/profile`
  - `PUT /user/password`
- 模板
  - `POST /video/templates` + `action`
  - 常见 action：
    - `getTemplates`
    - `get_public_templates`
    - `get_all_public_templates`
    - `get_user_templates`
    - `get_supported_models`
    - `add_template`
    - `delete_template`
    - `increment_likes`
    - `calculate_price`
    - `get_user_tasks`
    - `update_task_instance`
- 生成
  - `POST /video/gen-video` + `action: generateVideo`
  - `POST /video/gen-video` + `action: getVideoStatus`
- 支付
  - `POST /payment/stripe/intent`
  - `POST /payment/stripe/verify`
  - `GET /payment/credits`
- 邀请
  - `POST /invite/generate`
- 视频处理
  - `POST /video/process` + `action: get_video_last_frame`
  - `POST /video/process` + `action: merge_videos_async`
  - `POST /video/process` + `action: get_task_status`

### 401 行为

- 除公开端点外，遇到 401 会清空本地登录状态，并通过 `window.location.href = '/login'` 跳走。
- 因为 `/login` 会再次重定向到 `/auth/login`，所以用户体验上仍然可用。

## 9. 主要业务流

### 模板视频生成

最核心页面是 `src/pages/TemplateVideoCreatePage.vue`：

- 根据 `templateId` 拉取模板详情
- 获取支持的模型列表
- 上传图片并转 base64
- 调用生成接口
- 按固定轮询查询状态
- 成功后展示结果、下载、分享
- 生成成功后刷新积分余额

这是目前“模板驱动视频生成”的主通路。

### 首页模板浏览

`src/pages/HomePage.vue` 负责：

- 拉取模板列表
- 分页展示模板
- 打开创建模板/邀请码/角色等弹窗
- 切换语言
- 跳转到模板生成页或其他能力页

### 任务页

`src/pages/TasksPage.vue` 负责：

- 展示任务状态
- 自动刷新/轮询
- 删除任务
- 下载视频
- 处理播放状态与结果查看

### 个人中心 / 支付

`src/pages/ProfilePage.vue` 负责：

- 展示用户资料与积分
- 初始化 Stripe
- 创建 payment intent
- 完成支付验证
- 同步积分

### 图像能力

目前仓库里已有独立页面：

- `src/pages/ImageToVideoPage.vue`
- `src/pages/ImageToImagePage.vue`

从当前已暂存改动看，这两页属于最近一轮开发重点。

## 10. i18n / SEO / 主题

### i18n

- 文案文件：`src/i18n/locales/{zh,en,ja,ko}.json`
- `i18n`、Vuex、`NavBar` 与首页现已统一使用 `localStorage.language`，默认语言统一为 `en`。

### SEO

- 路由 `meta` 里配置了 `title/description/keywords`
- `useSEO()` 会动态更新 document title、meta、OG、Twitter Card、canonical
- `index.html` 里有默认站点级 SEO 和 JSON-LD

### 主题

- Tailwind 配置为 `darkMode: 'class'`
- `useTheme()` 使用 `localStorage.theme`
- store 初始 `theme` 写死为 `dark`，但 composable 会按保存值/系统偏好再覆盖

## 11. 预渲染与部署现状

- `src/prerender.ts` 存在，说明项目曾尝试做预渲染/SSR 风格的静态输出。
- `package.json` 里安装了 `vite-prerender-plugin`。
- 但当前 `vite.config.ts` **没有启用** prerender 插件配置，因此它现在更像“保留中的方案”而不是现行流程。
- 部署文档主要围绕 `AWS S3 + CloudFront`。

## 12. 当前工作区状态（这次分析时）

`git status --short` 显示当前已有暂存改动，说明仓库不是干净状态。已暂存文件包括：

- `src/App.vue`
- `src/components/HistoryPanel.vue`
- `src/components/NavBar.vue`
- `src/components/ResultViewerModal.vue`
- `src/i18n/locales/en.json`
- `src/i18n/locales/ja.json`
- `src/i18n/locales/ko.json`
- `src/i18n/locales/zh.json`
- `src/pages/HomePage.vue`
- `src/pages/ImageToImagePage.vue`
- `src/pages/ImageToVideoPage.vue`
- `src/pages/ProfilePage.vue`
- `src/pages/TasksPage.vue`
- `src/router/index.ts`
- `src/types/task.ts`

`git diff --cached --stat` 显示这些改动规模较大：

- 新增 `HistoryPanel.vue`
- 新增 `ResultViewerModal.vue`
- 新增 `ImageToVideoPage.vue`
- 新增 `ImageToImagePage.vue`
- 同时调整 `NavBar`、`HomePage`、`ProfilePage`、`TasksPage`、`router`、`task` 类型和多语言文案

基于文件名的保守推断：当前最近的开发主题，应该围绕“图像生成/图像转视频能力、结果查看、历史记录展示，以及相关导航与文案补齐”。

## 13. 已确认的坑点 / 不一致点

这些是下次接手时最值得先检查的地方：

1. `README.md` 仍是默认模板，不要把它当项目文档。
2. API 地址写死在 `src/services/api.ts`，`.env` 里的 `VITE_API_BASE_URL` 目前没有接上。
3. 语言 key 已统一为 `language`，多语言异常时优先检查该 key。
4. 品牌/域名存在历史残留：
   - 主体是 `justfancynow.com`
   - 但 `src/prerender.ts` 中 OG URL 还写着 `vmiraga.com`
   - `src/pages/HomePage.vue` 里也有 `vmiraga.com` 链接
5. `QuickCreatePage.vue` 被导入但未实际路由使用。
6. `/create -> /video/create` 这个重定向目前看起来是坏的。
7. 根目录 `app.js` 很像旧版本原生实现，当前 Vite 应用不依赖它。
8. store 中有若干 action 仍是占位，页面层自己发请求的比例较高。
9. 没有测试文件，修改后主要依赖人工验证或 `npm run check` / `npm run lint`。

## 14. 下次恢复上下文时的建议顺序

如果下次重新接手，建议按这个顺序快速恢复：

1. `git status --short`
   - 先确认工作区是否仍是带暂存改动的状态。
2. `src/router/index.ts`
   - 看当前入口路由和最新页面接线是否又变化。
3. `src/pages/ImageToVideoPage.vue`
4. `src/pages/ImageToImagePage.vue`
5. `src/components/HistoryPanel.vue`
6. `src/components/ResultViewerModal.vue`
7. `src/pages/HomePage.vue`
8. `src/pages/TasksPage.vue`
9. `src/pages/ProfilePage.vue`
10. `src/services/api.ts`
    - 最后确认接口、超时、base URL、401 行为。

如果需要快速做健康检查，优先运行：

```bash
npm run check
npm run lint
```

## 15. 一句话总结

这个项目目前是一个已经上线思路明确、但仍带有历史遗留与局部重构痕迹的 AI 媒体生成前端；最近工作的焦点明显偏向 `image-to-video / image-to-image / history / result viewer` 这一条新能力线。
