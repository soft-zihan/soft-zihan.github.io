<template>
  <div
    class="border-b border-gray-100 dark:border-gray-700 bg-black/5 dark:bg-black/30 rounded-xl backdrop-blur-sm"
    :style="{
      padding: 'var(--reader-header-padding, 1.5rem)',
      marginBottom: 'var(--reader-header-margin-bottom, 2rem)',
      paddingBottom: 'var(--reader-header-padding-bottom, 1.5rem)'
    }"
  >
    <div class="flex justify-between items-start gap-4">
      <div class="flex flex-wrap items-center gap-3 flex-1">
        <span v-if="authorName || authorUrl" class="text-sm text-gray-400 flex items-center gap-1">
          <span>👤</span>
          <a
            v-if="authorUrl"
            :href="authorUrl"
            target="_blank"
            rel="noopener"
            class="hover:underline"
            :style="authorLinkStyle"
          >
            {{ authorName || authorUrl }}
          </a>
          <span v-else>{{ authorName }}</span>
        </span>
      </div>
      <span v-if="isSource" class="bg-gray-100 dark:bg-gray-700 text-gray-500 px-3 py-1 rounded text-xs font-mono">Read Only</span>
    </div>

    <div class="flex items-center gap-4 mt-4 flex-wrap" v-if="!isSource">
      <button
        @click="onLike"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
        :class="liked ? 'bg-red-50 dark:bg-red-900/30 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-red-50'"
      >
        <span>{{ liked ? '❤️' : '🤍' }}</span>
        <span class="font-bold">{{ likes }}</span>
      </button>

      <button
        @click="onToggleFavorite"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
        :class="favorite ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-amber-50'"
      >
        <span>{{ favorite ? '⭐' : '☆' }}</span>
        <span>{{ favoriteText }}</span>
      </button>

      <div class="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700">
        <input
          type="color"
          :value="backgroundColor"
          @input="emit('update:backgroundColor', ($event.target as HTMLInputElement).value)"
          class="w-7 h-7 rounded-xl overflow-hidden cursor-pointer border-0 p-0 bg-transparent"
          :title="lang === 'zh' ? '文章背景色' : 'Article Background Color'"
        />
        <button
          v-if="backgroundColor"
          @click="onResetBackgroundColor"
          class="text-xs text-gray-400 hover:text-red-500"
          title="Reset"
        >
          ✕
        </button>
      </div>

      <span class="text-xs text-gray-400 flex items-center gap-1">
        <span class="text-sm">🧑‍🎓</span>
        {{ views }} {{ viewsLabel }}
      </span>

      <button
        v-if="showTocButton"
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)]/30"
        @click="onOpenToc"
      >
        <span>📑</span>
        <span>{{ lang === 'zh' ? '目录' : 'TOC' }}</span>
      </button>

      <span class="text-xs text-gray-400 flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h6m-6 8l-4-4V4a2 2 0 012-2h12a2 2 0 01-2 2H7z"/>
        </svg>
        {{ comments }} {{ commentsLabel }}
      </span>

      <span class="text-xs text-gray-400">📝 {{ wordCount }} {{ wordsLabel }}</span>

      <span class="text-xs text-gray-400 flex items-center gap-1">🕐 {{ updatedLabel }}: {{ updatedDate }}</span>

      <span v-if="tags.length" class="text-xs text-gray-400 flex items-center gap-1">
        🏷️
        <span class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in tags"
            :key="tag"
            class="text-[10px] px-2 py-0.5 rounded-full"
            :style="tagBadgeStyle"
          >
            {{ tag }}
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
type LinkStyle = Record<string, string>
type BadgeStyle = Record<string, string>

const props = defineProps<{
  lang: 'en' | 'zh'
  isSource: boolean
  authorName: string
  authorUrl: string
  authorLinkStyle: LinkStyle
  liked: boolean
  likes: number
  onLike: () => void
  favorite: boolean
  favoriteText: string
  onToggleFavorite: () => void
  backgroundColor: string
  onResetBackgroundColor: () => void
  views: number
  viewsLabel: string
  comments: number
  commentsLabel: string
  wordCount: number
  wordsLabel: string
  updatedLabel: string
  updatedDate: string
  tags: string[]
  tagBadgeStyle: BadgeStyle
  showTocButton: boolean
  onOpenToc: () => void
}>()

const emit = defineEmits(['update:backgroundColor'])
</script>
