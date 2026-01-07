# 01. 基础概念：Vue 与 MVVM 🌸

Vue.js 是一套用于构建用户界面的 **渐进式 JavaScript 框架**。它的核心目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。

## 1. 从 HTML 到 Vue 的演变

在理解 Vue 之前，我们先回顾一下网页开发的“远古时代”。

### 阶段一：静态 HTML
最早的网页只是纯文本和标签。
```html
<h1>Hello World</h1>
```
如果想改文字，必须修改 HTML 文件。

### 阶段二：原生 JS (DOM 操作)
为了让网页“动”起来，我们引入了 JavaScript。通过 JS 操作 DOM（文档对象模型）来修改页面。

```javascript
// 命令式编程 (Imperative)
// 1. 获取元素
const div = document.getElementById('app');
// 2. 定义数据
let count = 0;
// 3. 手动更新视图
div.innerText = count;

btn.onclick = () => {
  count++;
  // 4. 数据变了，必须再次手动更新视图
  div.innerText = count; 
};
```
**痛点**：随着页面变复杂，频繁的手动 DOM 操作不仅代码冗余，而且性能低效，逻辑难以维护。

### 阶段三：Vue 的出现 (声明式编程)
Vue 帮我们把“数据”和“视图”关联起来。你只需要告诉 Vue：“这个 div 显示这个变量”，剩下的同步工作由框架完成。

```html
<!-- 声明式编程 (Declarative) -->
<template>
  <div>{{ count }}</div>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
// 只需要修改数据，视图自动更新！
</script>
```

## 2. MVVM 架构模式

Vue 的设计受到了 **MVVM (Model-View-ViewModel)** 模式的启发。这是一种软件架构设计模式，旨在将 **图形用户界面 (View)** 的开发与 **业务逻辑 (Model)** 的开发分离开来。

*   **Model (模型)**: 
    JavaScript 中的数据对象（如 `ref`, `reactive` 定义的数据）。它是业务逻辑和数据的源头。
    
*   **View (视图)**:
    用户看到的 HTML 模板。它负责结构和布局。

*   **ViewModel (视图模型)**:
    Vue 框架的核心（Vue 实例）。它是一个“调度者”。
    *   **数据绑定 (Data Binding)**: 自动将 Model 的变化同步到 View。
    *   **DOM 监听 (DOM Listeners)**: 自动监听 View 的用户交互（如点击），并更新 Model。

**核心价值**：开发者不再需要直接接触 DOM，只需要关注数据（Model）的变化。

## 3. 核心机制：虚拟 DOM (Virtual DOM)

Vue 如何高效地更新视图？它并不是每次数据变化都重写整个 HTML，而是使用了 **虚拟 DOM**。

1.  **快照**：Vue 在内存中用 JavaScript 对象（VNode）模拟了一棵 DOM 树。
2.  **对比 (Diff)**：当数据变化时，Vue 生成新的 VNode 树，并与旧的 VNode 树进行对比。
3.  **更新 (Patch)**：计算出差异（例如：只是文字变了），然后只修改真实 DOM 中变化的那一小部分。

```javascript
// 虚拟 DOM 大致结构示例
const vnode = {
  tag: 'div',
  props: { id: 'app' },
  children: [ 
    { tag: 'span', text: 'Hello' } 
  ]
}
```

## 总结

Vue 的本质是：
1.  **数据驱动**：通过 MVVM 模式，让视图随数据自动变化。
2.  **组件化**：将 UI 切割成独立可复用的代码块。
3.  **高性能**：通过虚拟 DOM 和高效的 Diff 算法减少页面重绘。