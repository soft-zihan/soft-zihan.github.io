<template>
  <div class="space-y-12">
    <section>
      <LabModuleSystem :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-red-400">
          💡 {{ isZh ? 'NPM 是 Node.js 的包管理器。' : 'NPM is Node.js package manager.' }}
        </p>
      </div>
      <LabNpm :lang="lang" />
    </section>

    <section>
      <div class="max-w-3xl mx-auto px-4 mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 border-orange-400">
          💡 {{ isZh ? 'Vite 是新一代构建工具。' : 'Vite is next-gen build tool.' }}
        </p>
      </div>
      <LabBuildTools :lang="lang" />
    </section>

    <NextStageGuide
      :is-zh="isZh"
      :next-text="isZh ? '工程化基础掌握了！接下来进入 Vue 核心。' : 'Engineering basics done! Next: Vue core.'"
      @next="emit('navigate', 'vue-core')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NextStageGuide from '../NextStageGuide.vue'
import LabModuleSystem from '../stage5-engineering/LabModuleSystem.vue'
import LabNpm from '../stage5-engineering/LabNpm.vue'
import LabBuildTools from '../stage5-engineering/LabBuildTools.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const lang = computed(() => props.lang)
const isZh = computed(() => lang.value === 'zh')
</script>
