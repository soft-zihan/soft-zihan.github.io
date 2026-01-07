<script setup lang="ts">
import { computed } from 'vue';
import { BlogPost } from '../types';
import { Folder, FolderOpen, FileText, Clock, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  currentPath: string;
  posts: BlogPost[];
}>();

const emit = defineEmits<{
  (e: 'selectPost', post: BlogPost): void;
  (e: 'navigateFolder', path: string): void;
}>();

const contents = computed(() => {
  const foldersSet = new Set<string>();
  const filesList: BlogPost[] = [];

  props.posts.forEach(post => {
    if (props.currentPath && !post.path.startsWith(props.currentPath + '/')) return;
    
    const relativePath = props.currentPath 
      ? post.path.slice(props.currentPath.length + 1) 
      : post.path;
    
    const parts = relativePath.split('/');
    
    if (parts.length > 1) {
      foldersSet.add(parts[0]);
    } else {
      filesList.push(post);
    }
  });

  return { 
    folders: Array.from(foldersSet).sort(), 
    files: filesList.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
  };
});

const pathParts = computed(() => props.currentPath.split('/').filter(Boolean));
</script>

<template>
  <div class="animate-fade-in pb-20">
    <!-- Directory Header -->
    <div class="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-pink-500/5 border border-white p-8 mb-8 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-transparent rounded-bl-[4rem] opacity-50 pointer-events-none"></div>
      
      <div class="flex items-center gap-3 text-pink-500 mb-2">
          <FolderOpen :size="32" />
          <h2 class="text-2xl font-bold text-gray-800 capitalize">
            {{ pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'Root' }}
          </h2>
      </div>
      <p class="text-gray-500">
          {{ contents.folders.length }} folder{{ contents.folders.length !== 1 ? 's' : '' }}, {{ contents.files.length }} note{{ contents.files.length !== 1 ? 's' : '' }}
      </p>

      <!-- Interactive Breadcrumbs inside Header -->
      <div class="flex items-center mt-4 text-sm font-medium text-gray-500 bg-pink-50/50 inline-flex px-4 py-2 rounded-xl flex-wrap gap-y-2">
          <span 
            class="cursor-pointer transition-colors"
            :class="pathParts.length === 0 ? 'text-pink-600 font-bold' : 'hover:text-pink-600'"
            @click="$emit('navigateFolder', '')"
          >
            ~
          </span>
          <template v-for="(part, index) in pathParts" :key="index">
            <ChevronRight :size="14" class="mx-2 text-gray-300" />
            <span 
              :class="index === pathParts.length - 1 ? 'text-pink-600 font-bold' : 'cursor-pointer hover:text-pink-600 transition-colors'"
              @click="index !== pathParts.length - 1 && $emit('navigateFolder', pathParts.slice(0, index + 1).join('/'))"
            >
              {{ part }}
            </span>
          </template>
      </div>
    </div>

    <div class="space-y-10">
      <!-- Folders Section -->
      <div v-if="contents.folders.length > 0">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Folders</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div 
            v-for="folderName in contents.folders"
            :key="folderName"
            @click="$emit('navigateFolder', currentPath ? `${currentPath}/${folderName}` : folderName)"
            class="group bg-white/60 hover:bg-white border-2 border-white hover:border-pink-200 p-4 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg aspect-square"
          >
            <Folder class="text-yellow-300 group-hover:text-pink-400 transition-colors drop-shadow-sm transform group-hover:scale-110 duration-300" :size="40" />
            <span class="font-bold text-gray-600 group-hover:text-pink-600 text-sm text-center truncate w-full px-2">{{ folderName }}</span>
          </div>
        </div>
      </div>

      <!-- Files Section -->
      <div v-if="contents.files.length > 0">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Notes</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="post in contents.files"
            :key="post.id"
            @click="$emit('selectPost', post)"
            class="group bg-white/60 backdrop-blur-md border border-white p-6 rounded-2xl cursor-pointer hover:shadow-lg hover:bg-white hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <!-- Card Decor -->
            <div class="absolute top-0 left-0 w-1 h-full bg-pink-200 group-hover:bg-pink-400 transition-colors"></div>
            
            <div class="flex items-start justify-between mb-4">
                <div class="p-2 bg-pink-50 rounded-lg text-pink-400 group-hover:text-pink-600 group-hover:bg-pink-100 transition-colors">
                  <FileText :size="20" />
                </div>
                <span v-if="post.tags[0]" class="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-50 px-2 py-1 rounded-full">
                  {{ post.tags[0] }}
                </span>
            </div>

            <h3 class="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
              {{ post.title }}
            </h3>
            
            <div class="flex items-center gap-2 text-xs text-gray-400 mt-4">
              <Clock :size="12" />
              <span>{{ post.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="contents.folders.length === 0 && contents.files.length === 0" class="text-center py-20 bg-white/40 rounded-3xl border border-white/50 border-dashed">
        <div class="text-6xl mb-4">🍂</div>
        <p class="text-gray-500 font-medium">It's quiet here...</p>
      </div>
    </div>
  </div>
</template>