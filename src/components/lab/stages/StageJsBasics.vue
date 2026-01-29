<template>
  <div class="space-y-12">
    <section>
      <LabJsBasics :lang="lang" />
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? '掌握了 JS 基础，接下来学习异步与网络请求。' : 'Ready for async and networking?'"
      @next="emit('navigate', 'js-advanced')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NextStageGuide from '../NextStageGuide.vue'
import LabJsBasics from '../stage2-js-basics/LabJsBasics.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')
</script>

