<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import MarkdownViewer from './components/MarkdownViewer.vue';
import DirectoryViewer from './components/DirectoryViewer.vue';
import GeminiStudio from './components/GeminiStudio.vue';
import { MOCK_POSTS } from './constants';
import { BlogPost, NavMode } from './types';
import { Menu, X, Sparkles } from 'lucide-vue-next';

type ViewType = 'post' | 'directory' | 'studio';

// State
const navMode = ref<NavMode>('latest');
const mobileMenuOpen = ref(false);
const view = ref<ViewType>('post');
const currentPost = ref<BlogPost | null>(MOCK_POSTS.find(p => p.id === '1') || MOCK_POSTS[0]);
const currentPath = ref<string>('');

// Handlers
const handleSelectPost = (post: BlogPost) => {
  currentPost.value = post;
  view.value = 'post';
  // Calculate folder path
  const folderPath = post.path.split('/').slice(0, -1).join('/');
  currentPath.value = folderPath;
  mobileMenuOpen.value = false;
};

const handleNavigateFolder = (path: string) => {
  currentPath.value = path;
  view.value = 'directory';
  navMode.value = 'tree';
  mobileMenuOpen.value = false;
};

const toggleStudio = () => {
  view.value = 'studio';
  mobileMenuOpen.value = false;
};
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden text-gray-800 selection:bg-pink-200 selection:text-pink-900 font-sans">
    
    <!-- Mobile Menu Toggle -->
    <button 
      @click="mobileMenuOpen = !mobileMenuOpen"
      class="md:hidden fixed top-4 right-4 z-50 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg text-pink-500 hover:text-pink-600 border border-white"
    >
      <component :is="mobileMenuOpen ? X : Menu" :size="20" />
    </button>

    <!-- Floating AI Studio Button -->
    <button 
      v-if="view !== 'studio'"
      @click="toggleStudio"
      class="hidden md:flex fixed bottom-8 right-8 z-50 items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold text-sm"
    >
      <Sparkles :size="16" /> AI Studio
    </button>

    <!-- Sidebar -->
    <aside 
      class="fixed md:relative inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out h-full"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <Sidebar 
        :posts="MOCK_POSTS"
        :current-mode="navMode"
        :active-post-id="view === 'post' ? currentPost?.id || null : null"
        :active-path="currentPath"
        @update:mode="navMode = $event"
        @select-post="handleSelectPost"
        @navigate-folder="handleNavigateFolder"
      />
    </aside>

    <!-- Main Content -->
    <main class="flex-1 h-full overflow-y-auto relative scroll-smooth bg-transparent">
      <div class="max-w-7xl mx-auto p-4 md:p-10 pt-20 md:pt-10 min-h-full">
        
        <div v-if="view === 'post' && currentPost" class="animate-fade-in">
          <MarkdownViewer 
            :post="currentPost" 
            @navigate-folder="handleNavigateFolder"
          />
        </div>

        <div v-if="view === 'directory'" class="animate-fade-in">
          <DirectoryViewer 
            :current-path="currentPath"
            :posts="MOCK_POSTS"
            @select-post="handleSelectPost"
            @navigate-folder="handleNavigateFolder"
          />
        </div>

        <div v-if="view === 'studio'" class="animate-fade-in pt-10">
          <GeminiStudio />
        </div>

      </div>
    </main>

    <!-- Overlay -->
    <div 
      v-if="mobileMenuOpen"
      class="fixed inset-0 bg-pink-900/10 backdrop-blur-sm z-30 md:hidden"
      @click="mobileMenuOpen = false"
    ></div>

  </div>
</template>