# 🌸 Sakura Notes

> **v1.0**

这是一个基于 **Vue 3** + **Tailwind CSS** 的纯静态个人博客系统，专为 **GitHub Pages** 部署设计。

[**在线演示 (Live Demo)**](https://soft-zihan.github.io/)

---

## ✨ 特性 (Features)

- **纯静态架构**：完全基于客户端渲染 (CSR)，通过 GitHub Actions 预生成元数据索引。
- **支持上传文章和评论**：启发来自[RyuChan](https://github.com/kobaridev/RyuChan)，技术采用[giscus](https://github.com/giscus/giscus).
- **国际化支持**：内置中/英双语切换 (i18n)，切换时保持当前标签页和实验室位置不变（仅笔记刷新）。
- **主题模式**：支持 "Day Sakura" (浅色) 和 "Night Sakura" (深色) 两种主题模式，支持不同主题下切换壁纸，支持音乐播放。
- **交互式花瓣效果**：可拖拽樱花花瓣系统，稳定的指针事件、网格堆叠、移动端触控优化。
- **Sakura Lab**: 内置互动实验室，包含可视化教学组件。
- **发布工作台**：导入预览、选择性上传、标签/作者元信息写入，并自动上传 Markdown 中的本地图片。
- **无后端个性化**：利用 `localStorage` 存储用户选择的字体、字号、主题和花瓣速度偏好等。

---

## 📁 项目结构

本节介绍项目中的关键文件和目录：

### 根目录文件

- [index.html](/index.html): 主 HTML 入口文件，包含樱花主题样式和 Tailwind CSS 配置
- [index.tsx](/index.tsx): 应用程序引导文件，将 Vue 应用挂载到 DOM
- [App.vue](/App.vue): 根 Vue 组件（约 1150 行），协调整个应用程序
- [vite.config.ts](/vite.config.ts): 项目的 Vite 构建配置
- [package.json](/package.json): 项目依赖和脚本
- [tsconfig.json](/tsconfig.json): TypeScript 配置
- [constants.ts](/constants.ts): 国际化常量和配置
- [types.ts](/types.ts): 应用程序中使用的 TypeScript 类型定义

### Composables（可复用逻辑）

项目遵循 Vue 3 最佳实践，使用模块化 composables 实现关注点分离：

| 文件 | 职责 | 行数 | 被复用于 |
|------|------|------|----------|
| [useArticleMeta.ts](/composables/useArticleMeta.ts) | 文章元数据提取（标签、作者、贡献者） | ~180 | App.vue, useContentRenderer, useRawEditor, useContentClick |
| [useCodeModal.ts](/composables/useCodeModal.ts) | 代码弹窗管理、语法高亮 | ~150 | App.vue |
| [useContentRenderer.ts](/composables/useContentRenderer.ts) | Markdown 渲染、目录生成 | ~210 | App.vue |
| [useContentClick.ts](/composables/useContentClick.ts) | 链接拦截、文件可见性过滤 | ~250 | App.vue |
| [useRawEditor.ts](/composables/useRawEditor.ts) | 源码编辑、GitHub 提交 | ~170 | App.vue |
| [useSelectionMenu.ts](/composables/useSelectionMenu.ts) | 文本选择菜单、格式化 | ~210 | App.vue |
| [useLightbox.ts](/composables/useLightbox.ts) | 图片灯箱 | ~40 | App.vue |
| [useSearch.ts](/composables/useSearch.ts) | 全文搜索索引 | ~260 | App.vue, SearchModal |
| [useFile.ts](/composables/useFile.ts) | 文件系统操作 | ~140 | (已导出，暂未使用) |
| [useGitHubPublish.ts](/composables/useGitHubPublish.ts) | GitHub API 集成 | ~280 | useRawEditor, WriteEditor |
| [useBackup.ts](/composables/useBackup.ts) | 数据备份功能 | ~460 | SettingsModal |
| [useWallpapers.ts](/composables/useWallpapers.ts) | 壁纸管理 | ~100 | SettingsModal, BannerSettings, WallpaperLayer |

> **说明**：这些 composables 的主要目的是**关注点分离**而非多组件复用。它们将复杂逻辑从 App.vue（约1990→1150行）中提取出来，提高可维护性，并允许不同开发者独立开发不同功能模块。

### Stores（状态管理）

- [stores/appStore.ts](/stores/appStore.ts): 全局设置（语言、主题、壁纸、UI 状态）
- [stores/articleStore.ts](/stores/articleStore.ts): 文章交互（点赞、收藏、标签筛选）
- [stores/musicStore.ts](/stores/musicStore.ts): 音乐播放器状态、播放列表、歌词

### 组件 (Components)

- [components/AppHeader.vue](/components/AppHeader.vue): 包含导航控件和设置的头部组件
- [components/AppSidebar.vue](/components/AppSidebar.vue): 带有文件导航和视图模式切换的侧边栏
- [components/FileTree.vue](/components/FileTree.vue): 用于显示目录结构的递归文件树组件
- [components/FolderView.vue](/components/FolderView.vue): 用于显示文件夹内容的组件
- [components/SettingsModal.vue](/components/SettingsModal.vue): 用户偏好设置模态框（主题、字体、花瓣速度、壁纸等）
- [components/WriteEditor.vue](/components/WriteEditor.vue): 发布工作台，支持 Markdown 预览、标签/作者元信息、批量导入
- [components/SearchModal.vue](/components/SearchModal.vue): 全文搜索模态框，支持高亮显示
- [components/MusicPlayer.vue](/components/MusicPlayer.vue): 音乐播放器，支持歌词显示
- [components/GiscusComments.vue](/components/GiscusComments.vue): Giscus 评论集成
- [components/PetalBackground.vue](/components/PetalBackground.vue): 优化的交互式樱花花瓣背景
- [components/WallpaperLayer.vue](/components/WallpaperLayer.vue): 主题壁纸层
- [components/petal/usePetals.ts](/components/petal/usePetals.ts): 花瓣物理与堆叠逻辑的可复用组合式函数

#### 实验室组件（交互学习）

- [components/LabDashboard.vue](/components/LabDashboard.vue): Vue 学习实验室的仪表板
- [components/LabEventHandling.vue](/components/LabEventHandling.vue): 事件处理实验室
- [components/LabSlot.vue](/components/LabSlot.vue): 插槽系统实验室
- [components/LabReactivity.vue](/components/LabReactivity.vue): 响应式原理演示
- [components/LabDirectives.vue](/components/LabDirectives.vue): Vue 指令
- [components/LabLifecycle.vue](/components/LabLifecycle.vue): 生命周期钩子
- [components/LabPropsEmit.vue](/components/LabPropsEmit.vue): Props 和 Emit 通信
- [components/LabTypeScript.vue](/components/LabTypeScript.vue): TypeScript 基础
- [components/LabTailwind.vue](/components/LabTailwind.vue): TailwindCSS 快速入门
- 更多...

### 笔记 (Notes)

- [notes/](/notes/): 包含多种语言的 markdown 笔记的目录
  - [notes/VUE Learning/](/notes/VUE%20Learning/): 英文 Vue 学习笔记
  - [notes/VUE学习笔记/](/notes/VUE学习笔记/): 中文 Vue 学习笔记
  - [notes/en/](/notes/en/): 英文技术笔记
  - [notes/zh/](/notes/zh/): 中文技术笔记

### 脚本 (Scripts)

- [scripts/generate-tree.js](/scripts/generate-tree.js): 扫描 notes 目录并生成元数据索引
- [scripts/generate-raw.js](/scripts/generate-raw.js): 生成代码预览所需的原始源文件
- [scripts/generate-music.js](/scripts/generate-music.js): 生成音乐播放列表元数据
- [scripts/generate-wallpapers.js](/scripts/generate-wallpapers.js): 生成壁纸配置

---

## 🛠 原理与架构

1. **Scanner**: Node.js 脚本扫描 `notes/` 目录生成索引。
2. **Deploy**: 所有的 Markdown 和 **图片资源** 都会被原样复制到 `dist/notes/` 目录。
3. **Runtime**: Vue 应用拦截 Markdown 中的图片路径，自动补全为服务器上的真实路径。

---

## 🚀 如何投稿 (Contributing)

我们非常欢迎您的贡献！如果您想分享笔记或贡献代码：

1. 克隆仓库。
2. 直接推送到 `main` 分支。
3. 或者您可以提交 **Pull Request (PR)** 到主分支。

---

## 🚀 自行部署

1. **Fork** 此仓库。
2. 在项目根目录下 `notes` 文件夹中创建 `.md` 文件。
3. Push 代码，在 GitHub 仓库的 **Settings -> Pages** 中选择 **GitHub Actions** 作为构建源。每次 push 会自动构建并部署到 Pages。

希望这个项目能成为你整理知识、分享生活的小小花园 🌸
