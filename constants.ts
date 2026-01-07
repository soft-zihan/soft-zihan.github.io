import { BlogPost } from './types';

// In a real scenario, this might be fetched from a JSON manifest generated during build time
export const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to My Sakura Blog',
    path: 'intro/welcome.md',
    date: '2023-10-25',
    tags: ['meta', 'intro'],
    banner: 'https://picsum.photos/800/300?grayscale',
    content: `
# Welcome!

This is a personal blog built with **Vue 3** and **Tailwind CSS**. 
Even though it's a Single Page Application (SPA), it mimics a file system structure.

## Features
- 🌸 **Anime Aesthetic**: Clean, pastel colors.
- 📂 **Directory Tree**: Browse files like a pro.
- ⚡ **Latest Updates**: See what's new instantly.
- 🤖 **AI Studio**: Edit images using Gemini 2.5!

## How it works
Content is stored as markdown strings in the code for this demo, but in production, you could fetch raw markdown files from GitHub.
    `
  },
  {
    id: '2',
    title: 'Understanding Vue Composition API',
    path: 'tech/frontend/vue-composition.md',
    date: '2023-11-10',
    tags: ['vue', 'javascript'],
    content: `
# Vue Composition API Deep Dive

The Composition API is a set of APIs that allows us to author Vue components using imported functions instead of declaring options.

## ref and reactive

\`\`\`ts
const count = ref(0);
const state = reactive({ name: 'Vue' });
\`\`\`

## computed

Used for derived state.

> "Composition API allows you to reuse stateful logic without changing your component hierarchy."
    `
  },
  {
    id: '3',
    title: 'Frieren: Beyond Journey\'s End Review',
    path: 'anime/reviews/frieren.md',
    date: '2024-01-15',
    tags: ['anime', 'review'],
    banner: 'https://picsum.photos/800/300?blur=2',
    content: `
# Frieren: Beyond Journey's End

It is not about the adventure, but what happens *after*.

## The Melancholy of Time
Elves live for thousands of years. Humans only live for a blink of an eye. This disparity is the core emotional engine of the show.

![Magic](https://picsum.photos/400/200)

### Rating
10/10 - A Masterpiece.
    `
  },
  {
    id: '4',
    title: 'Gemini API Guide',
    path: 'tech/ai/gemini-api.md',
    date: '2024-05-20',
    tags: ['ai', 'google'],
    content: `
# Using Gemini 2.5 Flash

Gemini 2.5 Flash is incredibly fast and supports multimodal input.

## Image Editing
You can send an image and a text prompt to ask the model to modify the image.

## Code Example
See the **Studio** tab in this app to see it in action!
    `
  },
  {
    id: '5',
    title: '⌨️ 编辑器与终端交互',
    path: 'notes/linux/⌨️ 编辑器与终端交互.md',
    date: '2024-05-22',
    tags: ['linux', 'vim', 'terminal', 'shell'],
    content: `
### 1. Vim 编辑器
Vim 是一种强大的文本编辑器，主要有三种模式：
- **普通模式** (默认)：进行移动、删除、复制等操作
  - \`i\`：进入插入模式
  - \`x\`：删除当前字符
  - \`dd\`：删除当前行
  - \`yy\`：复制当前行
  - \`p\`：粘贴
  - \`u\`：撤销
  - \`/word\`：向后搜索 "word"，按 \`n\` 查找下一个，\`N\` 查找上一个
  - \`Esc\`：回到普通模式
- **插入模式**：进行文本编辑
- **命令模式** (普通模式下按 \`:\` )：
  - \`:w\`：保存
  - \`:q\`：退出
  - \`:wq\`：保存并退出
  - \`:q!\`：强制退出且不保存

### 2. Nano 编辑器 (极简)
Nano 比 Vim 更简单，操作提示直接显示在底部：
- \`nano file\`：打开或创建文件
- \`Ctrl + O\`：保存文件
- \`Ctrl + X\`：退出 (若未保存会询问)
- \`Ctrl + W\`：搜索文本

### 3. 常用编辑快捷键 (终端通用)
- \`Ctrl + C\`：终止当前进程
- \`Ctrl + L\`：清屏 (等同于 \`clear\`)
- \`Ctrl + D\`：退出当前 Shell 或删除光标处字符
- \`Ctrl + A\`：光标移动到行首
- \`Ctrl + E\`：光标移动到行尾
- \`Ctrl + U\`：剪切/删除光标前所有内容
- \`Ctrl + K\`：剪切/删除光标后所有内容
- \`Ctrl + W\`：删除光标前的一个单词

### 4. 终端交互神技 (Shell Shortcuts)
掌握这些快捷键，你的终端操作效率将提升一个量级。

#### 历史记录操作 (History Expansion)
- \`!!\`：执行上一条命令（常用于忘记加 sudo，如 \`sudo !!\`）。
- \`!$\`：引用上一条命令的**最后一个参数**（非常常用）。
  - *场景*：\`mkdir -p /var/www/html/project\` -> \`cd !$\` (直接进入刚创建的目录)。
- \`!^\`：引用上一条命令的**第一个参数**。
- \`!n\`：执行历史记录中第 n 条命令。

#### 高效交互快捷键
- **\`Ctrl + R\`**：**搜索历史命令** (Reverse-i-search)。
  - *技巧*：输入关键字，反复按 \`Ctrl + R\` 可在匹配项中切换。推荐安装 \`fzf\` 替代默认搜索，体验飞升。
- **\`Ctrl + X, Ctrl + E\`**：**在编辑器中编辑当前长命令**。
  - *场景*：当你写了一行超级长的 curl 命令，发现中间写错了，按这个组合键会直接调出 Vim/Nano 编辑这条命令，保存退出后自动执行。
- **\`Alt + .\`**：(MacOS下可能需要配置) 等同于 \`!$\`，快速粘贴上个参数。

### 5. 别名管理 (Alias)
通过 \`alias\` 将长命令变短，配置在 \`~/.bashrc\` 或 \`~/.zshrc\` 中可永久生效。

- \`alias ll='ls -lha'\`：列出所有文件的详细信息。
- \`alias grep='grep --color=auto'\`：让 grep 输出带颜色。
- \`alias update='sudo apt update && sudo apt upgrade'\`：一键更新系统。
    `
  }
];