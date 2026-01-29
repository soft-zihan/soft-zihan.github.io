<template>
  <div class="max-w-4xl mx-auto px-4">
    <div class="bg-gradient-to-r from-[var(--primary-50)] to-purple-50 dark:from-[var(--primary-900)]/20 dark:to-purple-900/20 rounded-2xl p-4 md:p-6 border border-[var(--primary-100)] dark:border-[var(--primary-800)]/30">
      <div class="flex items-start gap-4">
        <div class="text-4xl">{{ activeTabInfo?.icon }}</div>
        <div class="flex-1">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">
            {{ activeTabInfo?.noteNum ? (isZh ? `笔记${activeTabInfo?.noteNum}：` : `Note ${activeTabInfo?.noteNum}: `) : '' }}
            {{ activeTabInfo?.label }}
          </h3>
          <p class="text-sm text-[var(--primary-600)] dark:text-[var(--primary-400)] mt-1">
            🎯 {{ activeTabInfo?.goal }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {{ activeTabInfo?.desc }}
          </p>
        </div>
        <div class="hidden md:block text-right">
          <span class="text-xs text-gray-400">{{ isZh ? '关联本站代码' : 'Related Code' }}</span>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ activeTabInfo?.relatedCode }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isZh: boolean
  activeTabInfo?: any
}>()
</script>
