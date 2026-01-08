<template>
  <div 
    class="fixed inset-0 pointer-events-none z-50 overflow-hidden"
  >
    <div 
      v-for="p in petals" 
      :key="p.id" 
      class="absolute select-none cursor-grab active:cursor-grabbing will-change-transform pointer-events-auto"
      :style="{
        transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg) scale(${p.scale})`,
        opacity: p.opacity,
        width: p.size + 'px',
        height: (p.size * 1.3) + 'px',
        background: isDark ? 'linear-gradient(120deg, #be1245 0%, #f43f72 100%)' : 'linear-gradient(120deg, #ffd7e6 0%, #ffc4d6 100%)',
        borderRadius: '150% 0 150% 0',
        boxShadow: isDark ? '0 0 5px rgba(244, 63, 114, 0.3)' : '1px 1px 2px rgba(0,0,0,0.05)',
        transition: p.isDragging ? 'none' : 'opacity 0.5s',
        touchAction: 'none'
      }"
      @pointerdown.prevent="onPointerDown(p, $event)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { createPetal, updatePetals, type Petal } from './petal/usePetals';

const props = defineProps<{
  speed: 'slow' | 'fast';
  isDark: boolean;
}>();

const isDark = ref(props.isDark);
watch(() => props.isDark, (v) => isDark.value = v);

const petals = ref<Petal[]>([]);
let animationFrameId: number;

// Drag state + window listeners for stability
const draggedPetalId = ref<number | null>(null);

const onPointerDown = (p: Petal, e: PointerEvent) => {
  draggedPetalId.value = p.id;
  p.isDragging = true;
  p.isLanded = false;
  p.opacity = 1;
  // ensure correct pointer capture and disable native gestures
  (e.target as Element).setPointerCapture?.(e.pointerId);
  p.dragOffsetX = e.clientX - p.x;
  p.dragOffsetY = e.clientY - p.y;
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp, { passive: false });
};

const onPointerMove = (e: PointerEvent) => {
  if (draggedPetalId.value === null) return;
  const p = petals.value.find(pet => pet.id === draggedPetalId.value);
  if (!p) return;
  e.preventDefault();
  p.x = e.clientX - p.dragOffsetX;
  p.y = e.clientY - p.dragOffsetY;
};

const onPointerUp = () => {
  if (draggedPetalId.value === null) return;
  const p = petals.value.find(pet => pet.id === draggedPetalId.value);
  if (p) p.isDragging = false;
  draggedPetalId.value = null;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
};

const update = (time?: number) => {
  const currentSpeedMult = props.speed === 'fast' ? 2.5 : 1.0;
  updatePetals(petals.value, {
    speedMultiplier: currentSpeedMult,
    isDark: isDark.value
  });
  animationFrameId = requestAnimationFrame(update);
};

onMounted(() => {
  for (let i = 0; i < 15; i++) {
    petals.value.push(createPetal(Math.random() * window.innerHeight * 0.8));
  }
  animationFrameId = requestAnimationFrame(update);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
});
</script>