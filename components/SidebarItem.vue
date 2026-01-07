<script setup lang="ts">
import { ref, watch } from 'vue';
import { BlogPost, FileNode } from '../types';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown, Flower } from 'lucide-vue-next';

const props = defineProps<{
  node: FileNode;
  activePostId: string | null;
  activePath: string | null;
}>();

const emit = defineEmits<{
  (e: 'selectPost', post: BlogPost): void;
  (e: 'navigateFolder', path: string): void;
}>();

const isOpen = ref(false);

watch(() => props.activePath, (newPath) => {
  if (newPath && newPath.startsWith(props.node.path)) {
    isOpen.value = true;
  }
}, { immediate: true });

const toggleOpen = (e: Event) => {
  e.stopPropagation();
  isOpen.value = !isOpen.value;
};

const handleClickFolder = () => {
  emit('navigateFolder', props.node.path);
};
</script>

<template>
  <div>
    <!-- File -->
    <div 
      v-if="node.type === 'file'"
      @click="node.post && emit('selectPost', node.post)"
      class="flex items-center gap-2 py-2 px-3 rounded-2xl cursor-pointer text-sm transition-all duration-300 ml-4 mb-1"
      :class="activePostId === node.post?.id 
        ? 'bg-pink-100 text-pink-600 font-bold shadow-sm translate-x-1' 
        : 'text-gray-600 hover:bg-white/60 hover:text-pink-400'"
    >
      <Flower v-if="activePostId === node.post?.id" :size="14" class="animate-spin-slow" />
      <FileText v-else :size="14" />
      <span class="truncate">{{ node.name }}</span>
    </div>

    <!-- Folder -->
    <div v-else class="ml-2">
      <div 
        class="flex items-center gap-2 py-2 px-2 rounded-xl cursor-pointer text-sm font-bold transition-colors"
        :class="activePath === node.path ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-white/40'"
      >
        <!-- Toggle Icon -->
        <div 
          @click="toggleOpen"
          class="p-1 hover:bg-white rounded-full transition-colors"
        >
          <component :is="isOpen ? ChevronDown : ChevronRight" :size="14" :class="isOpen ? 'text-pink-400' : 'text-gray-400'" />
        </div>

        <!-- Content -->
        <div 
          class="flex items-center gap-2 flex-1"
          @click="handleClickFolder"
        >
          <component :is="isOpen || activePath === node.path ? FolderOpen : Folder" :size="16" :class="isOpen || activePath === node.path ? 'text-pink-500' : 'text-yellow-400'" />
          <span>{{ node.name }}</span>
        </div>
      </div>

      <!-- Recursive Children -->
      <div v-if="isOpen" class="border-l-2 border-pink-100 ml-3 pl-1 animate-fade-in">
        <SidebarItem 
          v-for="child in node.children" 
          :key="child.path"
          :node="child"
          :active-post-id="activePostId"
          :active-path="activePath"
          @select-post="$emit('selectPost', $event)"
          @navigate-folder="$emit('navigateFolder', $event)"
        />
      </div>
    </div>
  </div>
</template>