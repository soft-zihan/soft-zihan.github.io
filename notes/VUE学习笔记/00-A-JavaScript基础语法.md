# 00. JavaScript 基础语法速查 🌸

> **学习目标**: 掌握 JavaScript 核心语法，为学习 Vue 3 Composition API 打下坚实基础。
> **配套实验室**: 实验室 → JS基础 → [LabJsBasics](/components/LabJsBasics.vue)
> **Ref**: [📖 MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 为什么先学 JavaScript？

Vue 3 的 Composition API (组合式 API) 大量使用现代 JavaScript 特性：
- `ref()` 和 `reactive()` 返回的是 **对象**
- `computed()` 接收的是 **箭头函数**
- 组件间通信使用 **解构赋值**
- 异步操作需要 **Promise/async-await**

掌握 JS 基础，才能真正理解 Vue 的"魔法"背后的原理。

---

## 1. 变量声明：const vs let vs var

### 推荐使用 const

在 Vue 开发中，我们几乎总是使用 `const`：

```javascript
// ✅ 推荐：const 用于 ref、reactive、函数
const count = ref(0);
const user = reactive({ name: 'Sakura' });
const handleClick = () => { /* ... */ };

// 虽然不能重新赋值，但可以修改 .value
count.value++;  // ✅ OK
user.name = 'Cherry';  // ✅ OK
```

### let 用于需要重新赋值的场景

```javascript
// 循环变量
for (let i = 0; i < items.length; i++) { /* ... */ }

// 需要重新赋值的临时变量
let result = null;
if (condition) {
  result = calculate();
}
```

### 避免使用 var

`var` 有变量提升和函数作用域问题，在现代 JS 中应避免使用。

**本站实战 ([App.vue](/App.vue))**:
```typescript
// 所有响应式变量都用 const
const isDark = ref(false);
const activeTab = ref('latest');
const searchQuery = ref('');
```

---

## 2. 数据类型

JavaScript 有 7 种原始类型和 1 种引用类型：

| 类型 | 示例 | Vue 中的使用场景 |
|------|------|------------------|
| string | `'Sakura'` | 标题、内容、路径 |
| number | `42`, `3.14` | 计数、索引、尺寸 |
| boolean | `true`, `false` | v-if 条件、开关状态 |
| undefined | `undefined` | 变量未赋值 |
| null | `null` | 明确表示"空" |
| symbol | `Symbol('id')` | 唯一键（较少用） |
| bigint | `9007199254740991n` | 超大整数（较少用） |
| object | `{}`, `[]` | reactive 对象、数组 |

### typeof 检测类型

```javascript
typeof 'hello'    // 'string'
typeof 42         // 'number'
typeof true       // 'boolean'
typeof undefined  // 'undefined'
typeof null       // 'object' (历史遗留 bug！)
typeof {}         // 'object'
typeof []         // 'object' (数组也是对象)

// 判断数组用 Array.isArray()
Array.isArray([1, 2, 3])  // true
```

---

## 3. 函数：箭头函数是核心

### Vue 中最常用的三种函数形式

```typescript
// 1. 箭头函数 (最常用 ✨)
const double = (x) => x * 2;
const handleClick = () => {
  console.log('clicked');
};

// 2. 函数表达式
const calculate = function(a, b) {
  return a + b;
};

// 3. 方法简写 (对象中)
const store = {
  count: 0,
  increment() {  // 不是箭头函数！
    this.count++;
  }
};
```

### 箭头函数 vs 普通函数

关键区别在于 `this` 的绑定：

```typescript
// ⚠️ 箭头函数没有自己的 this
const obj = {
  name: 'Sakura',
  arrowFn: () => console.log(this.name),  // ❌ this 指向外层
  normalFn() { console.log(this.name); }  // ✅ this 指向 obj
};
```

**本站实战 ([composables/useSearch.ts](/composables/useSearch.ts))**:
```typescript
export function useSearch() {
  const buildIndex = () => {
    // 箭头函数，简洁且适合回调
    files.forEach(file => {
      index.add(file.path, file.content);
    });
  };
  return { buildIndex };
}
```

---

## 4. 数组方法：Vue 开发必备

Vue 中处理列表数据离不开数组方法：

### .map() - 转换每个元素

```typescript
// 渲染列表项
const items = ['🌸', '🌺', '🌷'];
const listItems = items.map((item, index) => ({
  id: index,
  emoji: item
}));
// [{ id: 0, emoji: '🌸' }, ...]
```

### .filter() - 过滤元素

```typescript
// 搜索过滤
const filtered = files.filter(file => 
  file.name.includes(searchQuery.value)
);
```

### .find() - 找第一个匹配

```typescript
// 根据 ID 查找
const user = users.find(u => u.id === targetId);
```

### .reduce() - 累积计算

```typescript
// 计算总数
const total = items.reduce((sum, item) => sum + item.count, 0);
```

**本站实战 ([composables/useContentClick.ts](/composables/useContentClick.ts))**:
```typescript
const visibleFiles = computed(() => 
  allFiles.filter(f => !f.hidden && f.lang === currentLang.value)
);
```

---

## 5. 解构赋值：简化代码

### 对象解构

```typescript
// 从 props 中解构
const { title, content, tags } = props;

// 从 store 中解构 (配合 storeToRefs)
const { isDark, lang, fontSize } = storeToRefs(appStore);

// 函数返回多个值
const { toc, html } = renderMarkdown(content);
```

### 数组解构

```typescript
// 获取第一个和剩余
const [first, ...rest] = items;

// Vue composable 常见模式
const [isOpen, toggle] = useToggle();
```

**本站实战 ([stores/appStore.ts](/stores/appStore.ts))**:
```typescript
// Pinia store 的标准用法
const appStore = useAppStore();
const { isDark, lang } = storeToRefs(appStore);
```

---

## 6. 展开运算符：合并与复制

```typescript
// 合并数组
const all = [...oldItems, ...newItems];

// 复制对象 (浅拷贝)
const copy = { ...original };

// 合并对象
const merged = { ...defaults, ...userConfig };

// 在 Vue 中更新响应式数组
items.value = [...items.value, newItem];
```

---

## 7. 流程控制

### 三元运算符 (Vue 模板最爱)

```html
<!-- 动态 class -->
<div :class="isDark ? 'bg-gray-900' : 'bg-white'">

<!-- 条件文本 -->
<span>{{ user ? user.name : '游客' }}</span>
```

### 可选链 (?.) 和空值合并 (??)

```typescript
// 安全访问深层属性
const name = user?.profile?.name ?? '默认名';

// 等价于
const name = user && user.profile && user.profile.name 
             ? user.profile.name 
             : '默认名';
```

---

## 实验室体验

完成本章学习后，请前往 **实验室 → JS基础** 进行互动练习：

1. **变量声明** - 理解 const/let/var 的区别
2. **数据类型** - 使用 typeof 测试各种值
3. **函数** - 对比箭头函数和普通函数
4. **数组方法** - 可视化 map/filter/reduce 效果
5. **流程控制** - 三元运算符实战演练

---

## 下一步

掌握 JS 基础后，你可以继续学习：
- [00-B. CSS 基础与 Tailwind](/notes/VUE学习笔记/00-B-CSS基础与Tailwind.md) - 样式系统
- [01. Web 标准与 Vue 架构](/notes/VUE学习笔记/01-基础概念与MVVM.md) - Vue 入门
