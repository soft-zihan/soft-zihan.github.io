<template>
  <div class="space-y-12">
    <section class="max-w-4xl mx-auto">
      <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 border border-[var(--primary-100)] dark:border-gray-700 shadow-xl relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>

        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_standards_title }}</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t.lab_standards_desc }}</p>
        </div>

        <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div
            class="w-48 h-64 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative transition-all duration-500"
            :class="{'border-[var(--primary-400)] dark:border-[var(--primary-500)] shadow-lg shadow-[var(--primary-500)]/20': standards.css}"
          >
            <div v-if="standards.css" class="absolute inset-2 bg-gradient-to-br from-[var(--primary-100)] to-purple-100 dark:from-[var(--primary-900)]/50 dark:to-purple-900/50 rounded-xl transition-all duration-500"></div>
            <div v-if="standards.html" class="relative z-10 text-6xl transition-all duration-500" :class="{'animate-bounce': standards.js}">
              <span v-if="!standards.css">🦴</span>
              <span v-else>🤵</span>
            </div>
            <div v-else class="text-gray-300 dark:text-gray-700 text-sm font-mono text-center px-4">
              &lt;div&gt;<br>Empty<br>&lt;/div&gt;
            </div>
            <div v-if="standards.js" class="absolute -right-4 -top-4 text-2xl animate-pulse">✨</div>
            <div v-if="standards.js" class="absolute -left-4 -bottom-4 text-2xl animate-spin">⚙️</div>
          </div>

          <div class="flex flex-col gap-3 w-full md:w-auto">
            <button
              @click="standards.html = !standards.html"
              class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
              :class="standards.html ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'"
            >
              <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300 font-bold text-lg">H</div>
              <div>
                <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_html }}</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{{ t.lab_st_info_html }}</div>
              </div>
              <div class="ml-auto">
                <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-orange-500 border-orange-500': standards.html}"></div>
              </div>
            </button>

            <button
              @click="standards.css = !standards.css"
              :disabled="!standards.html"
              class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
              :class="[!standards.html ? 'cursor-not-allowed opacity-40' : '', standards.css ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100']"
            >
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">C</div>
              <div>
                <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_css }}</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{{ t.lab_st_info_css }}</div>
              </div>
              <div class="ml-auto">
                <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-blue-500 border-blue-500': standards.css}"></div>
              </div>
            </button>

            <button
              @click="standards.js = !standards.js"
              :disabled="!standards.html"
              class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
              :class="[!standards.html ? 'cursor-not-allowed opacity-40' : '', standards.js ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100']"
            >
              <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300 font-bold text-lg">J</div>
              <div>
                <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_js }}</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{{ t.lab_st_info_js }}</div>
              </div>
              <div class="ml-auto">
                <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-yellow-500 border-yellow-500': standards.js}"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-orange-400">
          💡 {{ isZh ? '理解了 Web 标准后，我们来深入学习 HTML——网页的「骨架」。HTML 使用标签来描述页面结构，每个标签都有特定的语义含义。' : `After understanding web standards, let's dive into HTML — the "skeleton" of web pages. HTML uses tags to describe page structure, each with specific semantic meaning.` }}
        </p>
      </div>
      <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
        <span class="text-2xl">🧱</span> {{ t.lab_html_title }}
      </h2>
      <LabHtml :lang="lang" />
    </section>

    <section>
      <LabHtmlSemantic :lang="lang" />
    </section>

    <section>
      <LabHtmlBasics :lang="lang" />
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? '你已经理解了网页的基本结构与样式！接下来深入学习 CSS 布局。' : 'You understand web structure and basics! Next, dive into CSS layout.'"
      @next="emit('navigate', 'css-layout')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { I18N } from '../../../constants'
import NextStageGuide from '../NextStageGuide.vue'
import LabHtml from '../stage1-foundation/LabHtml.vue'
import LabHtmlBasics from '../stage1-foundation/LabHtmlBasics.vue'
import LabHtmlSemantic from '../stage1-foundation/LabHtmlSemantic.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const t = computed(() => I18N[lang.value])
const isZh = computed(() => lang.value === 'zh')

const standards = reactive({
  html: true,
  css: false,
  js: false
})
</script>
