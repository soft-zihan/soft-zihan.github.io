<script setup lang="ts">
import { computed } from 'vue';
import { BlogPost, FileNode, NavMode } from '../types';
import { Clock, Folder, FolderOpen, Star, Github, Flower } from 'lucide-vue-next';
import SidebarItem from './SidebarItem.vue';

const props = defineProps<{
  posts: BlogPost[];
  currentMode: NavMode;
  activePostId: string | null;
  activePath: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:mode', mode: NavMode): void;
  (e: 'selectPost', post: BlogPost): void;
  (e: 'navigateFolder', path: string): void;
}>();

const fileTree = computed(() => {
  const root: FileNode = { name: 'root', path: '', type: 'folder', children: [] };
    
  props.posts.forEach(post => {
    const parts = post.path.split('/');
    let currentLevel = root.children!;
    
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existingNode = currentLevel.find(n => n.name === part);
      
      if (existingNode) {
        if (!isFile) {
          currentLevel = existingNode.children!;
        }
      } else {
        const newNode: FileNode = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          post: isFile ? post : undefined
        };
        currentLevel.push(newNode);
        if (!isFile) {
          currentLevel = newNode.children!;
        }
      }
    });
  });
  return root.children || [];
});

const sortedPosts = computed(() => {
  return [...props.posts].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
</script>

<template>
  <div class="h-full flex flex-col bg-white/60 backdrop-blur-xl border-r border-white/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
    <!-- Header Branding -->
    <div 
      class="p-6 pb-4 text-center cursor-pointer hover:opacity-80 transition-opacity"
      @click="$emit('navigateFolder', '')"
    >
      <div class="inline-block relative">
          <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 p-1 shadow-lg">
            <div class="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Sakura" alt="Avatar" class="w-full h-full" />
            </div>
          </div>
          <div class="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
            <Flower :size="20" class="text-pink-500 animate-pulse" />
          </div>
      </div>
      <h2 class="mt-3 font-bold text-xl text-gray-800 tracking-tight">Sakura Notes</h2>
      <p class="text-xs text-pink-500 font-medium bg-pink-50 inline-block px-3 py-1 rounded-full mt-1">
        Reference Garden
      </p>
    </div>

    <!-- Navigation Tabs -->
    <div class="px-6 mb-2">
      <div class="flex bg-pink-50/80 p-1.5 rounded-2xl border border-pink-100">
        <button 
          @click="$emit('update:mode', 'latest')"
          class="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all duration-300"
          :class="currentMode === 'latest' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400 hover:text-pink-400'"
        >
          <Clock :size="12" /> Latest
        </button>
        <button 
            @click="$emit('update:mode', 'tree')"
            class="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all duration-300"
            :class="currentMode === 'tree' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400 hover:text-pink-400'"
        >
          <Folder :size="12" /> Files
        </button>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-auto px-4 pb-6 space-y-1 scroll-smooth">
      
      <!-- Latest Posts -->
      <div v-if="currentMode === 'latest'" class="space-y-3 animate-fade-in pt-2">
          <h3 class="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 px-2 flex items-center gap-1">
            <Star :size="10" /> Newest First
          </h3>
          <div 
            v-for="post in sortedPosts"
            :key="post.id"
            @click="$emit('selectPost', post)"
            class="group p-4 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden"
            :class="activePostId === post.id 
              ? 'bg-white border-pink-200 shadow-md translate-x-1' 
              : 'bg-white/40 border-transparent hover:bg-white hover:border-pink-100 hover:shadow-sm'"
          >
            <div v-if="activePostId === post.id" class="absolute left-0 top-0 bottom-0 w-1 bg-pink-400 rounded-l-2xl"></div>
            <h4 
              class="font-bold text-sm mb-1"
              :class="activePostId === post.id ? 'text-pink-600' : 'text-gray-700 group-hover:text-pink-500'"
            >
              {{ post.title }}
            </h4>
            <div class="flex items-center gap-2 text-[10px] text-gray-400">
              <Clock :size="10" />
              <span>{{ post.date }}</span>
              <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="bg-pink-100 text-pink-500 px-1.5 py-0.5 rounded-full">#{{ tag }}</span>
            </div>
          </div>
      </div>

      <!-- File Tree -->
      <div v-if="currentMode === 'tree'" class="animate-fade-in pt-2">
          <h3 class="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 px-2 flex items-center gap-1">
            <FolderOpen :size="10" /> Directory
          </h3>
          <SidebarItem 
            v-for="node in fileTree" 
            :key="node.path" 
            :node="node" 
            :active-post-id="activePostId" 
            :active-path="activePath"
            @select-post="$emit('selectPost', $event)"
            @navigate-folder="$emit('navigateFolder', $event)"
          />
      </div>

    </div>
    
    <!-- Footer -->
    <div class="p-4 border-t border-white/40">
      <a 
        href="https://github.com/soft-zihan" 
        target="_blank" 
        rel="noopener noreferrer"
        class="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-800 transition-colors mb-2 group"
      >
        <div class="p-1.5 bg-white/50 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all text-gray-500 group-hover:text-black">
            <Github :size="16" />
        </div>
        <span class="text-xs font-medium">soft-zihan</span>
      </a>
      <p class="text-[10px] text-center text-pink-300/80">Made with 💖 & Vue</p>
    </div>
  </div>
</template>