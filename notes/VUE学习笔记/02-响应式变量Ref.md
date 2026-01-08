
# 02. JS 变量与响应式系统 🌸

> **学习目标**: 回顾 JS 变量声明 (`let`, `const`)，理解 Vue 的响应式原理 (`ref`, `reactive`) 及计算属性。
> **参考教材**: `source-1.md` (JS基础), `source-2.md` (Vue基础)

## 1. JS 基础回顾：变量与类型

根据 `source-1.md`，JavaScript 是一门弱类型语言。

*   **声明变量**: 
    *   `let`: 定义可变变量 (推荐)。
    *   `const`: 定义常量，一旦赋值不可修改 (推荐)。
    *   `var`: 老旧的声明方式，存在作用域缺陷 (不推荐)。
*   **数据类型**: 
    *   基本类型: `number`, `string`, `boolean`, `null`, `undefined`。
    *   引用类型: `Object`, `Array`。

**痛点**: 在原生 JS 中，如果你修改了一个变量 `let name = "Sakura"`, 网页上的文字**不会**自动变化。你需要手动调用 DOM API 来更新视图。

## 2. Vue 的魔法：Ref & Reactive

Vue 3 引入了 **响应式系统**，核心思想是：**数据变了，视图自动更新**。

### Ref (针对基本类型)
`ref` 就像给普通值穿上了一层“铠甲”。

*   **定义**: `const isDark = ref(false);`
*   **原理**: Vue 将 boolean 值包裹在一个对象中，通过 `.value` 属性进行读写拦截。
*   **源码实战 (`App.vue`)**:
    ```typescript
    // 定义一个响应式变量
    const isDark = ref(false); 
    
    // JS 中修改 (必须加 .value)
    const toggleTheme = (val) => {
        isDark.value = val; 
        // 此时，绑定了 :class="{ dark: isDark }" 的 HTML 会自动更新
    };
    ```
    *注意：在 HTML 模板插值 `{{ isDark }}` 中，Vue 会自动解包，不需要加 `.value`。*

### Reactive (针对对象)
`reactive` 利用 ES6 的 **Proxy** (代理) 技术，深度监听对象的变化。

*   **定义**: `const settings = reactive({ fontSize: 'normal' });`
*   **源码实战 (`components/LabVueList.vue`)**:
    在员工管理实验中，我们使用 reactive 管理表单数据：
    ```typescript
    const newItem = reactive({
        name: '',
        gender: 1, // 1:男, 2:女
        job: 1     // 1:讲师, 2:班主任
    });
    
    // 修改时像普通对象一样，不需要 .value
    newItem.name = '谢逊';
    ```

## 3. 计算属性 (Computed)

在 `source-1.md` 中我们学了函数。在 Vue 中，如果我们想根据现有的数据**算**出一个新值，最好使用 `computed`。

**源码实战 (`App.vue`)**:
我们需要根据当前的路径 `currentPath` 生成面包屑导航数据。

```typescript
// 这是一个计算属性，它依赖 currentPath
const breadcrumbs = computed(() => {
  const path = currentPath.value; // 访问依赖
  if (!path) return [];
  // ... 拆分路径逻辑 ...
  return parts; 
});
```

**优势**: `computed` 是**有缓存的**！只要 `currentPath` 不变，多次访问 `breadcrumbs` 不会重新执行函数，性能更高。

## 4. 实验室体验

请前往 **实验室 -> Vue 核心 -> 响应式原理** (`LabReactivity.vue`)，亲自体验数据变化如何自动更新 DOM。