# 00. JavaScript Fundamentals Quick Reference 🌸

> **Learning Goals**: Master JavaScript core syntax to build a solid foundation for Vue 3 Composition API.
> **Lab**: Laboratory → JS Basics → [LabJsBasics](/components/LabJsBasics.vue)
> **Ref**: [📖 MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Why Learn JavaScript First?

Vue 3's Composition API heavily uses modern JavaScript features:
- `ref()` and `reactive()` return **objects**
- `computed()` accepts **arrow functions**
- Component communication uses **destructuring**
- Async operations require **Promise/async-await**

Mastering JS fundamentals helps you understand the "magic" behind Vue.

---

## 1. Variable Declaration: const vs let vs var

### Prefer const

In Vue development, we almost always use `const`:

```javascript
// ✅ Recommended: const for ref, reactive, functions
const count = ref(0);
const user = reactive({ name: 'Sakura' });
const handleClick = () => { /* ... */ };

// Can't reassign, but can modify .value
count.value++;  // ✅ OK
user.name = 'Cherry';  // ✅ OK
```

### Use let for reassignment

```javascript
// Loop variables
for (let i = 0; i < items.length; i++) { /* ... */ }

// Temporary variables that need reassignment
let result = null;
if (condition) {
  result = calculate();
}
```

### Avoid var

`var` has hoisting and function-scope issues. Avoid in modern JS.

**From This Site ([App.vue](/App.vue))**:
```typescript
// All reactive variables use const
const isDark = ref(false);
const activeTab = ref('latest');
const searchQuery = ref('');
```

---

## 2. Data Types

JavaScript has 7 primitive types and 1 reference type:

| Type | Example | Vue Use Case |
|------|---------|--------------|
| string | `'Sakura'` | titles, content, paths |
| number | `42`, `3.14` | counts, indexes, sizes |
| boolean | `true`, `false` | v-if conditions, toggles |
| undefined | `undefined` | unassigned variables |
| null | `null` | explicitly "empty" |
| symbol | `Symbol('id')` | unique keys (rare) |
| bigint | `9007199254740991n` | big integers (rare) |
| object | `{}`, `[]` | reactive objects, arrays |

### typeof for type checking

```javascript
typeof 'hello'    // 'string'
typeof 42         // 'number'
typeof true       // 'boolean'
typeof undefined  // 'undefined'
typeof null       // 'object' (historical bug!)
typeof {}         // 'object'
typeof []         // 'object' (arrays are objects)

// Use Array.isArray() for arrays
Array.isArray([1, 2, 3])  // true
```

---

## 3. Functions: Arrow Functions Are Key

### Three common function forms in Vue

```typescript
// 1. Arrow function (most common ✨)
const double = (x) => x * 2;
const handleClick = () => {
  console.log('clicked');
};

// 2. Function expression
const calculate = function(a, b) {
  return a + b;
};

// 3. Method shorthand (in objects)
const store = {
  count: 0,
  increment() {  // not an arrow function!
    this.count++;
  }
};
```

### Arrow function vs regular function

The key difference is `this` binding:

```typescript
// ⚠️ Arrow functions don't have their own `this`
const obj = {
  name: 'Sakura',
  arrowFn: () => console.log(this.name),  // ❌ this points to outer scope
  normalFn() { console.log(this.name); }  // ✅ this points to obj
};
```

**From This Site ([composables/useSearch.ts](/composables/useSearch.ts))**:
```typescript
export function useSearch() {
  const buildIndex = () => {
    // Arrow function, concise and good for callbacks
    files.forEach(file => {
      index.add(file.path, file.content);
    });
  };
  return { buildIndex };
}
```

---

## 4. Array Methods: Essential for Vue

Vue list handling relies heavily on array methods:

### .map() - Transform each element

```typescript
// Rendering list items
const items = ['🌸', '🌺', '🌷'];
const listItems = items.map((item, index) => ({
  id: index,
  emoji: item
}));
```

### .filter() - Filter elements

```typescript
// Search filtering
const filtered = files.filter(file => 
  file.name.includes(searchQuery.value)
);
```

### .find() - Find first match

```typescript
// Find by ID
const user = users.find(u => u.id === targetId);
```

### .reduce() - Accumulate values

```typescript
// Calculate total
const total = items.reduce((sum, item) => sum + item.count, 0);
```

---

## 5. Destructuring: Simplify Your Code

### Object destructuring

```typescript
// From props
const { title, content, tags } = props;

// From store (with storeToRefs)
const { isDark, lang, fontSize } = storeToRefs(appStore);

// Function returning multiple values
const { toc, html } = renderMarkdown(content);
```

### Array destructuring

```typescript
// Get first and rest
const [first, ...rest] = items;

// Common Vue composable pattern
const [isOpen, toggle] = useToggle();
```

---

## 6. Spread Operator: Merge and Copy

```typescript
// Merge arrays
const all = [...oldItems, ...newItems];

// Copy object (shallow)
const copy = { ...original };

// Merge objects
const merged = { ...defaults, ...userConfig };

// Update reactive array in Vue
items.value = [...items.value, newItem];
```

---

## 7. Control Flow

### Ternary operator (Vue template favorite)

```html
<!-- Dynamic class -->
<div :class="isDark ? 'bg-gray-900' : 'bg-white'">

<!-- Conditional text -->
<span>{{ user ? user.name : 'Guest' }}</span>
```

### Optional chaining (?.) and nullish coalescing (??)

```typescript
// Safe deep property access
const name = user?.profile?.name ?? 'Default';
```

---

## Lab Practice

After completing this chapter, go to **Laboratory → JS Basics** for interactive practice:

1. **Variables** - Understand const/let/var differences
2. **Data Types** - Test values with typeof
3. **Functions** - Compare arrow and regular functions
4. **Array Methods** - Visualize map/filter/reduce
5. **Control Flow** - Practice ternary operators

---

## Next Steps

After mastering JS fundamentals, continue with:
- [00-B. CSS Basics & Tailwind](/notes/VUE%20Learning/00-B-CSS-Basics-Tailwind.md) - Styling system
- [01. Web Standards & Vue Architecture](/notes/VUE%20Learning/01-Basic%20Concepts%20and%20MVVM.md) - Vue intro
