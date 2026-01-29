<template>
  <div class="space-y-12">
    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-400">
          💡 {{ isZh ? '变量和函数是编程的基础。理解作用域、闭包等核心概念，能帮助你写出更健壮的代码。' : 'Variables and functions are programming fundamentals. Understanding scope and closures helps write more robust code.' }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">⚡</span> {{ isZh ? 'JavaScript 核心机制' : 'JavaScript Core Mechanics' }}
      </h2>
      <LabJs :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
          💡 {{ isZh ? 'DOM（文档对象模型）是 JS 与 HTML 的桥梁。通过 DOM API，我们可以动态修改页面内容、样式和结构。' : 'DOM bridges JS and HTML. Through DOM APIs, we can dynamically modify page content, styles, and structure.' }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🎮</span> {{ t.lab_dom_title }}
      </h2>
      <LabDom :lang="lang" />
    </section>

    <section>
      <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🧠</span> {{ isZh ? '闭包与作用域' : 'Closures & Scope' }}
      </h2>
      <LabJsAdvanced :lang="lang" />
    </section>

    <section>
      <LabEventLoop />
    </section>

    <section class="max-w-4xl mx-auto">
      <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2 justify-center">
        <span class="text-2xl">📡</span> {{ t.lab_ajax_title }}
      </h2>
      <LabAjax :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-400">
          💡 {{ isZh ? 'Promise 和 async/await 是处理异步操作的核心。' : 'Promise and async/await are core for async operations.' }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">⚡</span> {{ isZh ? '异步编程' : 'Async Programming' }}
      </h2>
      <LabAsync :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
          💡 {{ isZh ? 'TypeScript 是 JavaScript 的超集，添加了类型系统。' : 'TypeScript is a superset of JavaScript with a type system.' }}
        </p>
      </div>
      <LabTypeScript :lang="lang" />
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? 'JS 进阶掌握了！下一步：工程化。' : 'JS advanced done! Next: engineering.'"
      @next="emit('navigate', 'engineering')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { I18N } from '../../../constants'
import NextStageGuide from '../NextStageGuide.vue'
import LabJs from '../stage4-js-advanced/LabJs.vue'
import LabDom from '../stage4-js-advanced/LabDom.vue'
import LabJsAdvanced from '../stage4-js-advanced/LabJsAdvanced.vue'
import LabEventLoop from '../stage4-js-advanced/LabEventLoop.vue'
import LabAjax from '../stage4-js-advanced/LabAjax.vue'
import LabAsync from '../stage4-js-advanced/LabAsync.vue'
import LabTypeScript from '../stage4-js-advanced/LabTypeScript.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')
const t = computed(() => I18N[lang.value])
</script>
