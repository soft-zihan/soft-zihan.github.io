<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import { BlogPost } from '../types';
import { Download, Copy, FileText, ChevronRight, Hash, Quote } from 'lucide-vue-next';
import Button from './Button.vue';

const props = defineProps<{
  post: BlogPost;
}>();

const emit = defineEmits<{
  (e: 'navigateFolder', path: string): void;
}>();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// Add IDs to headers for TOC
md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const title = tokens[idx + 1].content;
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  token.attrSet('id', slug);
  return self.renderToken(tokens, idx, options);
};

// We wrap images in a div to match React styling
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const src = token.attrGet('src');
  const alt = token.content;
  
  return `
    <div class="my-8 relative group image-wrapper">
      <div class="absolute inset-0 bg-pink-200 rounded-2xl rotate-1 group-hover:rotate-2 transition-transform"></div>
      <img src="${src}" alt="${alt}" class="relative rounded-2xl shadow-lg mx-auto bg-white" />
    </div>
  `;
};

const renderedContent = computed(() => {
  return md.render(props.post.content);
});

interface TocItem {
  id: string;
  text: string;
  level: number;
}
const toc = ref<TocItem[]>([]);

const generateToc = () => {
  const lines = props.post.content.split('\n');
  const items: TocItem[] = [];
  
  lines.forEach((line) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      items.push({ id, text, level });
    }
  });
  toc.value = items;
};

watch(() => props.post.content, () => {
  generateToc();
}, { immediate: true });

const copySource = () => {
  navigator.clipboard.writeText(props.post.content);
  alert('✨ Source copied to clipboard! ✨');
};

const downloadSource = () => {
  const blob = new Blob([props.post.content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.post.path.split('/').pop()}`;
  a.click();
  URL.revokeObjectURL(url);
};

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const pathParts = computed(() => props.post.path.split('/'));
const filename = computed(() => pathParts.value[pathParts.value.length - 1]);
const breadcrumbs = computed(() => pathParts.value.slice(0, -1));
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-8 relative">
    <!-- Main Content Area -->
    <div class="flex-1 min-w-0">
      
      <!-- Breadcrumb & Actions Bar -->
      <div class="sticky top-4 z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 bg-white/80 backdrop-blur-md p-3 px-5 rounded-2xl border border-white shadow-lg shadow-pink-100/20">
          <div class="flex items-center text-xs sm:text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            <FileText class="w-4 h-4 mr-2 text-pink-500 shrink-0" />
            
            <span 
              class="hover:text-pink-500 cursor-pointer transition-colors"
              @click="$emit('navigateFolder', '')"
            >
              root
            </span>
            <ChevronRight class="w-3 h-3 mx-1 text-gray-300" />
            
            <template v-for="(part, i) in breadcrumbs" :key="i">
              <span 
                class="hover:text-pink-500 cursor-pointer transition-colors"
                @click="$emit('navigateFolder', pathParts.slice(0, i + 1).join('/'))"
              >
                {{ part }}
              </span>
              <ChevronRight class="w-3 h-3 mx-1 text-gray-300" />
            </template>
            <span class="font-bold text-gray-800 bg-pink-50 px-2 py-0.5 rounded-lg">{{ filename }}</span>
          </div>
          
          <div class="flex gap-2 shrink-0">
            <Button variant="ghost" @click="copySource" :icon="Copy" class-name="text-xs px-3 py-1.5 h-auto rounded-lg hover:bg-pink-100">Copy</Button>
            <Button variant="secondary" @click="downloadSource" :icon="Download" class-name="text-xs px-3 py-1.5 h-auto rounded-lg border-pink-200 text-pink-600 hover:bg-pink-50">Download</Button>
          </div>
      </div>

      <!-- Post Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-pink-500/5 border border-white p-8 sm:p-12 animate-fade-in relative overflow-hidden">
          
          <!-- Decorative corner -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-transparent rounded-bl-[4rem] opacity-50 pointer-events-none"></div>

          <!-- Banner Image -->
          <div v-if="post.banner" class="mb-10 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 rounded-b-[2.5rem] overflow-hidden h-56 sm:h-80 relative group shadow-md">
            <img :src="post.banner" alt="Banner" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 sm:p-12">
              <h1 class="text-white text-3xl sm:text-5xl font-bold drop-shadow-lg tracking-tight leading-tight">{{ post.title }}</h1>
            </div>
          </div>
          
          <div v-else class="mb-8 border-b-2 border-pink-100 pb-6">
            <h1 class="text-4xl font-bold text-gray-800 mb-2 tracking-tight">{{ post.title }}</h1>
          </div>
          
          <!-- Meta Data -->
          <div class="flex flex-wrap gap-4 mb-10 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span class="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-green-400"></span>
              {{ post.date }}
            </span>
            <div class="flex gap-2">
              <span v-for="tag in post.tags" :key="tag" class="text-pink-500 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">#{{ tag }}</span>
            </div>
          </div>

          <!-- Markdown Content -->
          <!-- We use Deep Selectors in Style block to style this -->
          <div class="markdown-body" v-html="renderedContent"></div>

          <!-- Cute Footer -->
          <div class="mt-12 pt-8 border-t border-dashed border-pink-200 text-center">
            <span class="text-2xl animate-bounce inline-block">🌸</span>
            <p class="text-sm text-gray-400 mt-2 font-medium">Thanks for reading!</p>
          </div>
      </div>
    </div>

    <!-- Floating TOC Sidebar (Right) -->
    <div class="hidden xl:block w-72 shrink-0">
        <div class="sticky top-24 bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-lg shadow-pink-500/5">
          <h4 class="font-bold text-gray-700 mb-6 flex items-center gap-2 border-b border-pink-100 pb-2">
            <div class="w-1.5 h-6 bg-pink-400 rounded-full"></div>
            Table of Contents
          </h4>
          <ul class="space-y-3 text-sm relative">
            <!-- Vertical line connector -->
            <div class="absolute left-[5px] top-2 bottom-2 w-0.5 bg-gray-100 rounded-full"></div>

            <li 
              v-for="item in toc"
              :key="item.id" 
              class="cursor-pointer transition-all duration-200 relative pl-4"
              :class="item.level === 1 ? 'font-bold text-gray-800' : 'text-gray-500 hover:text-pink-500'"
              :style="{ marginLeft: `${(item.level - 1) * 12}px` }"
              @click="scrollToHeading(item.id)"
            >
              <span 
                class="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm z-10"
                :class="item.level === 1 ? 'bg-pink-400' : 'bg-gray-300'"
              ></span>
              {{ item.text }}
            </li>
            <li v-if="toc.length === 0" class="text-gray-400 italic pl-4">No headings found...</li>
          </ul>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Deep selectors to style the rendered HTML from Markdown-It */
:deep(.markdown-body h1) {
  @apply text-3xl font-bold text-gray-800 mb-6 mt-10 flex items-center gap-3 relative;
}
:deep(.markdown-body h1)::before {
  content: '#';
  @apply text-pink-400 opacity-50 mr-2;
}

:deep(.markdown-body h2) {
  @apply text-2xl font-bold text-gray-700 mb-4 mt-8 pb-2 border-b-2 border-pink-100 flex items-center gap-2;
}
:deep(.markdown-body h2)::before {
  content: '';
  @apply w-2 h-2 rounded-full bg-pink-400 inline-block;
}

:deep(.markdown-body h3) {
  @apply text-xl font-bold text-gray-600 mb-3 mt-6 ml-2;
}

:deep(.markdown-body p) {
  @apply text-gray-600 leading-8 mb-4;
}

:deep(.markdown-body ul) {
  @apply list-none mb-4 text-gray-600 space-y-2;
}

:deep(.markdown-body li) {
  @apply flex items-start gap-2;
}
:deep(.markdown-body li)::before {
  content: '•';
  @apply text-pink-300 mt-0;
}

:deep(.markdown-body ol) {
  @apply list-decimal list-inside mb-4 text-gray-600 ml-4 space-y-2;
}
:deep(.markdown-body ol li)::before {
  content: none;
}

:deep(.markdown-body blockquote) {
  @apply relative my-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-gray-600 italic;
}

:deep(.markdown-body pre) {
  @apply bg-[#282c34] text-gray-200 p-5 rounded-2xl overflow-x-auto mb-6 font-mono text-sm shadow-lg border-4 border-white/50;
}

:deep(.markdown-body code) {
  @apply bg-pink-50 text-pink-600 px-2 py-0.5 rounded-md font-mono text-sm border border-pink-100 shadow-sm;
}
:deep(.markdown-body pre code) {
  @apply bg-transparent text-inherit p-0 border-0 shadow-none;
}
</style>