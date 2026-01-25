<template>
  <div class="space-y-12">
    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-400">
          💡 {{ isZh ? 'CSS 负责「穿衣打扮」。通过选择器、属性值的组合，我们可以精确控制每个元素的外观。' : `CSS handles the "styling". Through selectors and property values, we can precisely control each element's appearance.` }}
        </p>
      </div>
      <LabCssBasics :lang="lang" />
    </section>

    <section>
      <LabCssLayout :lang="lang" />
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? '布局搞定！现在进入 JavaScript 的世界。' : 'Layout done! Now enter the world of JavaScript.'"
      @next="emit('navigate', 'js-basics')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NextStageGuide from '../NextStageGuide.vue'
import LabCssBasics from '../stage3-css/LabCssBasics.vue'
import LabCssLayout from '../stage3-css/LabCssLayout.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')
</script>
