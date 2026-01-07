<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: any;
  className?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  className: '',
});

const emit = defineEmits(['click']);

const baseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = computed(() => {
  const map = {
    primary: "bg-pink-500 hover:bg-pink-600 text-white shadow-md hover:shadow-lg shadow-pink-500/30",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:border-pink-300 hover:bg-pink-50 shadow-sm",
    ghost: "text-gray-600 hover:bg-pink-100/50 hover:text-pink-600"
  };
  return map[props.variant];
});
</script>

<template>
  <button 
    :class="`${baseStyles} ${variantClasses} ${props.className}`"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <component :is="icon" v-if="icon" class="w-4 h-4" />
    <slot />
  </button>
</template>