# 00. CSS Basics & Tailwind 🌸

> **Learning Goals**: Understand CSS core concepts, master Tailwind CSS utility classes for building beautiful Vue components.
> **Lab**: Laboratory → CSS Layout → [LabCssBasics](/components/LabCssBasics.vue), [LabCssLayout](/components/LabCssLayout.vue)
> **Ref**: [📖 MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [📖 Tailwind CSS](https://tailwindcss.com/docs)

## CSS & Tailwind Relationship

Tailwind CSS doesn't replace CSS—it **wraps common CSS properties into utility classes**:

| Native CSS | Tailwind Class |
|------------|----------------|
| `padding: 1rem` | `p-4` |
| `margin: 0.5rem` | `m-2` |
| `display: flex` | `flex` |
| `justify-content: center` | `justify-center` |
| `background-color: #f472b6` | `bg-sakura-400` |

Understanding CSS fundamentals helps you use Tailwind effectively.

---

## 1. Selectors: Target Elements to Style

### Basic Selectors

```css
/* Element selector */
div { margin: 10px; }

/* Class selector (most common) ✨ */
.btn { padding: 0.5rem 1rem; }

/* ID selector (high specificity, use sparingly) */
#app { min-height: 100vh; }
```

### The Essence of Tailwind

Tailwind is essentially a massive collection of **class selectors**:

```css
/* Tailwind internally defines */
.p-4 { padding: 1rem; }
.m-2 { margin: 0.5rem; }
.rounded-lg { border-radius: 0.5rem; }
```

### Pseudo-class Selectors

```css
/* CSS syntax */
.btn:hover { background: #f9a8d4; }
.btn:active { transform: scale(0.95); }

/* Tailwind syntax */
<button class="hover:bg-sakura-300 active:scale-95">
```

**From This Site ([components/AppHeader.vue](/components/AppHeader.vue))**:
```html
<button class="p-2 rounded-lg hover:bg-sakura-100 dark:hover:bg-gray-700">
  <!-- hover: prefix = :hover pseudo-class -->
  <!-- dark: prefix = dark mode -->
</button>
```

---

## 2. Box Model: Understanding Element Space

Every HTML element is a "box" with four parts:

```
┌─────────────────────────────────────┐
│             margin                   │
│  ┌───────────────────────────────┐  │
│  │         border                 │  │
│  │  ┌───────────────────────┐    │  │
│  │  │     padding            │    │  │
│  │  │  ┌────────────────┐   │    │  │
│  │  │  │   content      │   │    │  │
│  │  │  └────────────────┘   │    │  │
│  │  └───────────────────────┘    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Tailwind Spacing Classes

```html
<!-- padding (inside) -->
<div class="p-4">     <!-- all sides 16px -->
<div class="px-4">    <!-- left & right 16px -->
<div class="py-2">    <!-- top & bottom 8px -->
<div class="pt-4">    <!-- top only 16px -->

<!-- margin (outside) -->
<div class="m-4">     <!-- all sides 16px -->
<div class="mx-auto"> <!-- left & right auto (center) -->
<div class="mt-8">    <!-- top only 32px -->
```

### Spacing Unit Conversion

Tailwind number × 4 = px value:
- `p-1` = 4px
- `p-2` = 8px
- `p-4` = 16px (1rem)
- `p-8` = 32px

---

## 3. Flexbox: One-Dimensional Layout

Flexbox arranges elements in **one direction**.

### Core Concept

```html
<div class="flex">           <!-- Enable flex layout -->
  <div>Child 1</div>
  <div>Child 2</div>
</div>
```

### Main Axis Alignment (justify-content)

```html
<div class="flex justify-start">   <!-- Left align (default) -->
<div class="flex justify-center">  <!-- Center -->
<div class="flex justify-end">     <!-- Right align -->
<div class="flex justify-between"> <!-- Space between -->
```

### Cross Axis Alignment (align-items)

```html
<div class="flex items-start">   <!-- Top align -->
<div class="flex items-center">  <!-- Vertical center ✨ -->
<div class="flex items-end">     <!-- Bottom align -->
```

### Common Combinations

```html
<!-- Perfect center -->
<div class="flex items-center justify-center h-screen">
  <div>I'm centered!</div>
</div>

<!-- Header layout -->
<header class="flex items-center justify-between px-4">
  <Logo />
  <Nav />
  <Settings />
</header>
```

---

## 4. Grid: Two-Dimensional Layout

Grid creates **row and column** layouts.

### Basic Usage

```html
<!-- 3-column equal width grid -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

### Responsive Columns

```html
<!-- Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <ArticleCard v-for="article in articles" />
</div>
```

---

## 5. Position: Breaking Document Flow

| Value | Description | Tailwind |
|-------|-------------|----------|
| `static` | Default, normal flow | (default) |
| `relative` | Offset from self | `relative` |
| `absolute` | Relative to positioned ancestor | `absolute` |
| `fixed` | Fixed to viewport | `fixed` |
| `sticky` | Sticks on scroll | `sticky` |

### Common Patterns

```html
<!-- Modal (fixed to viewport) -->
<div class="fixed inset-0 z-50 flex items-center justify-center">
  <div class="bg-white rounded-xl p-6">Modal content</div>
</div>

<!-- Sticky header -->
<header class="sticky top-0 z-40 bg-white">

<!-- Badge/indicator -->
<div class="relative">
  <img src="avatar.jpg" />
  <span class="absolute -top-1 -right-1 bg-red-500 rounded-full">3</span>
</div>
```

---

## 6. Responsive Design

### Tailwind Breakpoint Prefixes

| Prefix | Min Width | Device |
|--------|-----------|--------|
| (none) | 0px | Mobile (base) |
| `sm:` | 640px | Large phone |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large screen |

### Mobile-First Design

```html
<!-- Base styles for mobile, breakpoints override -->
<div class="p-2 md:p-4 lg:p-6">
  <!-- Mobile: 8px, Tablet: 16px, Desktop: 24px -->
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols -->
</div>

<aside class="hidden md:flex">
  <!-- Mobile: hidden, Tablet+: visible -->
</aside>
```

---

## Lab Practice

After this chapter, go to **Laboratory → CSS Layout** for interactive practice:

1. **CSS Basics** - Selectors, Box Model, Position
2. **CSS Layout** - Flexbox, Grid, Responsive

---

## Next Steps

After mastering CSS basics, continue with:
- [01. Web Standards & Vue Architecture](/notes/VUE%20Learning/01-Basic%20Concepts%20and%20MVVM.md) - Vue intro
- [02. Reactivity and Ref](/notes/VUE%20Learning/02-Reactivity%20and%20Ref.md) - Vue core
