# 00. CSS 基础与 Tailwind 🌸

> **学习目标**: 理解 CSS 核心概念，掌握 Tailwind CSS 工具类的使用，为构建美观的 Vue 组件打下基础。
> **配套实验室**: 实验室 → CSS布局 → [LabCssBasics](/components/LabCssBasics.vue), [LabCssLayout](/components/LabCssLayout.vue)
> **Ref**: [📖 MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [📖 Tailwind CSS](https://tailwindcss.com/docs)

## CSS 与 Tailwind 的关系

Tailwind CSS 并不是要取代 CSS，而是把常用的 CSS 属性**封装成工具类**：

| CSS 原生写法 | Tailwind 工具类 |
|-------------|----------------|
| `padding: 1rem` | `p-4` |
| `margin: 0.5rem` | `m-2` |
| `display: flex` | `flex` |
| `justify-content: center` | `justify-center` |
| `background-color: #f472b6` | `bg-sakura-400` |

理解 CSS 基础，才能真正用好 Tailwind。

---

## 1. 选择器：定位你要样式化的元素

### 基础选择器

```css
/* 元素选择器 */
div { margin: 10px; }

/* 类选择器 (最常用) ✨ */
.btn { padding: 0.5rem 1rem; }

/* ID 选择器 (优先级高，少用) */
#app { min-height: 100vh; }
```

### Tailwind 的本质

Tailwind 就是预定义了大量的**类选择器**：

```css
/* Tailwind 内部定义 */
.p-4 { padding: 1rem; }
.m-2 { margin: 0.5rem; }
.rounded-lg { border-radius: 0.5rem; }
```

### 伪类选择器

```css
/* CSS 写法 */
.btn:hover { background: #f9a8d4; }
.btn:active { transform: scale(0.95); }

/* Tailwind 写法 */
<button class="hover:bg-sakura-300 active:scale-95">
```

**本站实战 ([components/AppHeader.vue](/components/AppHeader.vue))**:
```html
<button class="p-2 rounded-lg hover:bg-sakura-100 dark:hover:bg-gray-700">
  <!-- hover: 前缀 = :hover 伪类 -->
  <!-- dark: 前缀 = 暗色模式 -->
</button>
```

---

## 2. 盒模型：理解元素的空间

每个 HTML 元素都是一个"盒子"，由四部分组成：

```
┌─────────────────────────────────────┐
│             margin (外边距)          │
│  ┌───────────────────────────────┐  │
│  │         border (边框)          │  │
│  │  ┌───────────────────────┐    │  │
│  │  │     padding (内边距)    │    │  │
│  │  │  ┌────────────────┐   │    │  │
│  │  │  │   content      │   │    │  │
│  │  │  │   (内容区)      │   │    │  │
│  │  │  └────────────────┘   │    │  │
│  │  └───────────────────────┘    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Tailwind 间距类

```html
<!-- padding (内边距) -->
<div class="p-4">     <!-- 四周 16px -->
<div class="px-4">    <!-- 左右 16px -->
<div class="py-2">    <!-- 上下 8px -->
<div class="pt-4">    <!-- 仅顶部 16px -->

<!-- margin (外边距) -->
<div class="m-4">     <!-- 四周 16px -->
<div class="mx-auto"> <!-- 左右自动 (居中) -->
<div class="mt-8">    <!-- 仅顶部 32px -->
```

### 间距单位换算

Tailwind 的数字 × 4 = px 值：
- `p-1` = 4px
- `p-2` = 8px
- `p-4` = 16px (1rem)
- `p-8` = 32px

**本站实战 ([components/ArticleCard.vue](/components/ArticleCard.vue))**:
```html
<div class="p-4 m-2 border border-sakura-200 rounded-xl">
  <!-- p-4: 内边距 16px -->
  <!-- m-2: 外边距 8px -->
  <!-- border: 1px 边框 -->
  <!-- rounded-xl: 大圆角 -->
</div>
```

---

## 3. Flexbox：一维布局神器

Flexbox 用于在**一个方向**上排列元素。

### 核心概念

```html
<div class="flex">           <!-- 开启 flex 布局 -->
  <div>子元素1</div>
  <div>子元素2</div>
</div>
```

### 主轴对齐 (justify-content)

```html
<div class="flex justify-start">   <!-- 左对齐 (默认) -->
<div class="flex justify-center">  <!-- 居中 -->
<div class="flex justify-end">     <!-- 右对齐 -->
<div class="flex justify-between"> <!-- 两端对齐 -->
```

### 交叉轴对齐 (align-items)

```html
<div class="flex items-start">   <!-- 顶部对齐 -->
<div class="flex items-center">  <!-- 垂直居中 ✨ -->
<div class="flex items-end">     <!-- 底部对齐 -->
```

### 常用组合

```html
<!-- 完全居中 -->
<div class="flex items-center justify-center h-screen">
  <div>我在页面正中央</div>
</div>

<!-- 两端对齐 + 垂直居中 (头部常用) -->
<header class="flex items-center justify-between px-4">
  <Logo />
  <Nav />
  <Settings />
</header>
```

**本站实战 ([components/AppHeader.vue](/components/AppHeader.vue))**:
```html
<header class="flex items-center justify-between px-4 py-2">
  <!-- Logo 区域 -->
  <div class="flex items-center gap-2">
    <span class="text-2xl">🌸</span>
    <span class="font-bold">Sakura Notes</span>
  </div>
  
  <!-- 导航按钮 -->
  <nav class="flex gap-4">
    <!-- gap-4: 子元素间距 16px -->
  </nav>
</header>
```

---

## 4. Grid：二维网格布局

Grid 用于创建**行列网格**布局。

### 基础用法

```html
<!-- 3列等宽网格 -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</div>
```

### 响应式列数

```html
<!-- 移动端1列，平板2列，桌面3列 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <ArticleCard v-for="article in articles" />
</div>
```

### 自适应列数

```html
<!-- 每列最小 280px，自动计算列数 -->
<div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
```

**本站实战 ([components/FolderView.vue](/components/FolderView.vue))**:
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <ArticleCard 
    v-for="file in visibleFiles" 
    :key="file.path"
    :file="file"
  />
</div>
```

---

## 5. 定位：脱离文档流

### position 属性

| 值 | 说明 | Tailwind |
|----|------|----------|
| `static` | 默认，按文档流排列 | (默认) |
| `relative` | 相对自身偏移 | `relative` |
| `absolute` | 相对定位祖先 | `absolute` |
| `fixed` | 相对视口固定 | `fixed` |
| `sticky` | 滚动时固定 | `sticky` |

### 常用场景

```html
<!-- 模态框 (固定在视口) -->
<div class="fixed inset-0 z-50 flex items-center justify-center">
  <div class="bg-white rounded-xl p-6">模态内容</div>
</div>

<!-- 固定头部 -->
<header class="sticky top-0 z-40 bg-white">

<!-- 徽标/角标 -->
<div class="relative">
  <img src="avatar.jpg" />
  <span class="absolute -top-1 -right-1 bg-red-500 rounded-full">3</span>
</div>
```

**本站实战 ([components/SearchModal.vue](/components/SearchModal.vue))**:
```html
<div class="fixed inset-0 z-50 bg-black/50">
  <!-- fixed: 固定定位 -->
  <!-- inset-0: top/right/bottom/left 都是 0 -->
  <!-- z-50: 最高层级 -->
  <!-- bg-black/50: 半透明黑色背景 -->
</div>
```

---

## 6. 响应式设计

### Tailwind 断点前缀

| 前缀 | 最小宽度 | 设备 |
|------|---------|------|
| (无) | 0px | 手机 (基准) |
| `sm:` | 640px | 大手机 |
| `md:` | 768px | 平板 |
| `lg:` | 1024px | 笔记本 |
| `xl:` | 1280px | 桌面 |
| `2xl:` | 1536px | 大屏 |

### 移动优先设计

```html
<!-- 基础样式写给手机，断点样式覆盖 -->
<div class="p-2 md:p-4 lg:p-6">
  <!-- 手机: 8px, 平板: 16px, 桌面: 24px -->
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 手机: 1列, 平板: 2列, 桌面: 3列 -->
</div>

<aside class="hidden md:flex">
  <!-- 手机: 隐藏, 平板: 显示 -->
</aside>
```

**本站实战 ([components/AppSidebar.vue](/components/AppSidebar.vue))**:
```html
<aside class="hidden md:flex w-64 flex-col">
  <!-- 移动端隐藏侧边栏，平板以上显示 -->
</aside>
```

---

## 实验室体验

完成本章学习后，请前往 **实验室 → CSS布局** 进行互动练习：

1. **CSS 基础** - 选择器、盒模型、定位
2. **CSS 布局** - Flexbox、Grid、响应式

---

## 下一步

掌握 CSS 基础后，你可以继续学习：
- [01. Web 标准与 Vue 架构](/notes/VUE学习笔记/01-基础概念与MVVM.md) - Vue 入门
- [02. 响应式变量 Ref](/notes/VUE学习笔记/02-响应式变量Ref.md) - Vue 核心
