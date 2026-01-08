<template>
  <div class="absolute inset-0 z-[-2] pointer-events-none" :style="bgStyle"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ 
  isDark: boolean;
  lightUrl: string;
  darkUrl: string;
}>();

const bgStyle = computed(() => ({
  backgroundImage: `url(${props.isDark ? props.darkUrl : props.lightUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  filter: props.isDark ? 'saturate(80%) brightness(0.8)' : 'saturate(120%) brightness(1.0)',
}));
</script>
