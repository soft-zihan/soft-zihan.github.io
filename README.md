# 🌸 Sakura Notes

<div align="center">
    <a href="README_zh.md">简体中文</a>
</div>

> **v1.0**

A pure static personal blog system built with **Vue 3** + **Tailwind CSS**, designed specifically for **GitHub Pages** deployment.

[**Live Demo**](https://soft-zihan.github.io/)

---

## ✨ Features

* **Purely Static Architecture** : Fully based on client-side rendering (CSR), with pre-generated metadata indexes via GitHub Actions.
* **Article and Comment Upload Support** : Inspired by [RyuChan](https://github.com/kobaridev/RyuChan), implemented using [giscus](https://github.com/giscus/giscus) technology.
* **Internationalization Support** : Built-in Chinese/English bilingual switching (i18n). Switching retains the current tab and lab position (only notes are refreshed).
* **Theme Modes** : Supports "Day Sakura" (light) and "Night Sakura" (dark) themes, with wallpaper switching in different themes and music playback.
* **Interactive Petal Effects** : A draggable cherry blossom petal system with stable pointer events, grid stacking, and mobile touch optimization.
* **Sakura Lab** : Built-in interactive lab with visual teaching components.
* **Publishing Studio** : Import preview, selective upload, tags/author metadata injection, and automatic local image upload for Markdown.
* **Backend-Free Personalization** : Uses `localStorage` to store user preferences for font, font size, theme, petal speed, and more.

---

## 📁 Project Structure

This section describes the key files and directories in the project:

### Root Files

- [index.html](/index.html): Main HTML entry point with Sakura-themed styling and Tailwind CSS configuration
- [index.tsx](/index.tsx): Application bootstrap file that mounts the Vue app to the DOM
- [App.vue](/App.vue): Root Vue component (~1150 lines) that orchestrates the entire application
- [vite.config.ts](/vite.config.ts): Vite build configuration for the project
- [package.json](/package.json): Project dependencies and scripts
- [tsconfig.json](/tsconfig.json): TypeScript configuration
- [constants.ts](/constants.ts): Internationalization constants and configuration
- [types.ts](/types.ts): TypeScript type definitions used across the application

### Composables (Reusable Logic)

The project follows Vue 3 best practices with modular composables for separation of concerns:

| File | Responsibility | Lines | Reused By |
|------|---------------|-------|----------|
| [useArticleMeta.ts](/composables/useArticleMeta.ts) | Article metadata extraction (tags, author, contributors) | ~180 | App.vue, useContentRenderer, useRawEditor, useContentClick |
| [useCodeModal.ts](/composables/useCodeModal.ts) | Code modal management, syntax highlighting | ~150 | App.vue |
| [useContentRenderer.ts](/composables/useContentRenderer.ts) | Markdown rendering, TOC generation | ~210 | App.vue |
| [useContentClick.ts](/composables/useContentClick.ts) | Link interception, file visibility filtering | ~250 | App.vue |
| [useRawEditor.ts](/composables/useRawEditor.ts) | Source editing, GitHub commit | ~170 | App.vue |
| [useSelectionMenu.ts](/composables/useSelectionMenu.ts) | Text selection menu, formatting | ~210 | App.vue |
| [useLightbox.ts](/composables/useLightbox.ts) | Image lightbox | ~40 | App.vue |
| [useSearch.ts](/composables/useSearch.ts) | Full-text search indexing | ~260 | App.vue, SearchModal |
| [useFile.ts](/composables/useFile.ts) | File system operations | ~140 | (exported, not yet used) |
| [useGitHubPublish.ts](/composables/useGitHubPublish.ts) | GitHub API integration | ~280 | useRawEditor, WriteEditor |
| [useBackup.ts](/composables/useBackup.ts) | Data backup functionality | ~460 | SettingsModal |
| [useWallpapers.ts](/composables/useWallpapers.ts) | Wallpaper management | ~100 | SettingsModal, BannerSettings, WallpaperLayer |

> **Note**: The primary purpose of these composables is **separation of concerns** rather than multi-component reuse. They extract complex logic from App.vue (~1990→1150 lines) to improve maintainability and allow different developers to work on different features independently.

### Stores (State Management)

- [stores/appStore.ts](/stores/appStore.ts): Global settings (language, theme, wallpaper, UI state)
- [stores/articleStore.ts](/stores/articleStore.ts): Article interactions (likes, favorites, tag filtering)
- [stores/musicStore.ts](/stores/musicStore.ts): Music player state, playlist, lyrics

### Components

- [components/AppHeader.vue](/components/AppHeader.vue): Header component with navigation controls and settings
- [components/AppSidebar.vue](/components/AppSidebar.vue): Sidebar with file navigation and view mode toggles
- [components/FileTree.vue](/components/FileTree.vue): Recursive file tree component for displaying the directory structure
- [components/FolderView.vue](/components/FolderView.vue): Component for displaying folder contents
- [components/SettingsModal.vue](/components/SettingsModal.vue): Modal for user preferences (theme, font, petal speed, wallpaper, etc.)
- [components/WriteEditor.vue](/components/WriteEditor.vue): Publishing studio with Markdown preview, tag/author metadata, and bulk import
- [components/SearchModal.vue](/components/SearchModal.vue): Full-text search modal with highlighting
- [components/MusicPlayer.vue](/components/MusicPlayer.vue): Music player with lyrics display
- [components/GiscusComments.vue](/components/GiscusComments.vue): Giscus comment integration
- [components/PetalBackground.vue](/components/PetalBackground.vue): Optimized animated sakura petal background
- [components/WallpaperLayer.vue](/components/WallpaperLayer.vue): Theme-based wallpaper layer
- [components/petal/usePetals.ts](/components/petal/usePetals.ts): Composable for petal physics and stacking logic

#### Lab Components (Interactive Learning)

- [components/LabDashboard.vue](/components/LabDashboard.vue): Dashboard for Vue learning labs
- [components/LabEventHandling.vue](/components/LabEventHandling.vue): Event handling lab
- [components/LabSlot.vue](/components/LabSlot.vue): Slot system lab
- [components/LabReactivity.vue](/components/LabReactivity.vue): Reactivity demonstration
- [components/LabDirectives.vue](/components/LabDirectives.vue): Vue directives
- [components/LabLifecycle.vue](/components/LabLifecycle.vue): Lifecycle hooks
- [components/LabPropsEmit.vue](/components/LabPropsEmit.vue): Props and emit communication
- [components/LabTypeScript.vue](/components/LabTypeScript.vue): TypeScript fundamentals
- [components/LabTailwind.vue](/components/LabTailwind.vue): TailwindCSS quickstart
- And more...

### Notes

- [notes/](/notes/): Directory containing markdown notes in multiple languages
  - [notes/VUE Learning/](/notes/VUE%20Learning/): English Vue learning notes
  - [notes/VUE学习笔记/](/notes/VUE学习笔记/): Chinese Vue learning notes
  - [notes/en/](/notes/en/): English technical notes
  - [notes/zh/](/notes/zh/): Chinese technical notes

### Scripts

- [scripts/generate-tree.js](/scripts/generate-tree.js): Scan notes directory and generate metadata index
- [scripts/generate-raw.js](/scripts/generate-raw.js): Generate raw source files for code preview
- [scripts/generate-music.js](/scripts/generate-music.js): Generate music playlist metadata
- [scripts/generate-wallpapers.js](/scripts/generate-wallpapers.js): Generate wallpaper configuration

---

## 🛠 Principle & Architecture

1. **Scanner**: A Node.js script scans the `notes/` directory to generate the content index.
2. **Deploy**: All Markdown files and **image assets** are copied directly to the `dist/notes/` directory.
3. **Runtime**: The Vue application intercepts image paths in Markdown and automatically completes them with the real server paths.

---

## 🚀 How to Contribute

We welcome your contributions! If you'd like to share notes or contribute code:

1. Clone the repository.
2. Push your changes directly to the `main` branch.
3. Alternatively, you can submit a **Pull Request (PR)** to the main branch.

---

## 🚀 Self-Deployment

1. **Fork** this repository.
2. Create `.md` files inside the `notes` folder in the project root.
3. Push your code. Select **GitHub Actions** for the source in your repository's Pages settings. Each push will trigger an automatic build and deploy to Pages.

Hope this project becomes your little garden for organizing knowledge and sharing life 🌸
