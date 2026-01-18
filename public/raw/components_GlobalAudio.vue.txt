<template>
  <!-- Hidden Audio Element -->
  <audio
    ref="audioEl"
    :src="musicStore.currentTrack?.url"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedMetadata"
    @ended="onEnded"
    @error="onError"
  ></audio>
  
  <!-- Mini FAB Button - Only spinning circle, NO card display -->
  <div v-if="musicStore.currentTrack && !isMusicPage" class="fixed bottom-8 right-8 z-50 pointer-events-auto">
    <!-- Rotating Circle Button -->
    <button
      @click="togglePlay"
      class="w-16 h-16 rounded-full bg-gradient-to-br from-sakura-400 to-sakura-600 shadow-2xl shadow-sakura-500/40 hover:shadow-sakura-500/60 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center relative overflow-hidden group"
    >
      <!-- Rotating Cover Background -->
      <div 
        class="absolute inset-1 rounded-full overflow-hidden"
        :class="{ 'animate-spin-slow': musicStore.isPlaying }"
        :style="{ 
          animationPlayState: musicStore.isPlaying ? 'running' : 'paused',
          background: `url('${musicStore.currentTrack?.cover || '/image/music-default.jpg'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5
        }"
      ></div>
      
      <!-- Center Icon -->
      <div class="relative z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <!-- Visualizer bars when paused -->
        <div v-if="!musicStore.isPlaying" class="w-2.5 h-2.5 flex gap-0.5 items-end justify-center">
          <div class="w-0.5 bg-white h-1.5 rounded-full transition-all duration-300"></div>
          <div class="w-0.5 bg-white h-2 rounded-full transition-all duration-300"></div>
          <div class="w-0.5 bg-white h-1 rounded-full transition-all duration-300"></div>
          <div class="w-0.5 bg-white h-2.5 rounded-full transition-all duration-300"></div>
        </div>
        
        <!-- Play/Pause Icon -->
        <div v-else class="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-0.5">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </div>
      </div>
      
      <!-- Hover tooltip -->
      <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {{ musicStore.isPlaying ? 'Pause' : 'Play' }}
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useMusicStore } from '../stores/musicStore'

const musicStore = useMusicStore()
const audioEl = ref<HTMLAudioElement | null>(null)

// Check if on music page
const isMusicPage = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.includes('/music')
  }
  return false
})

// Simple play/pause toggle
const togglePlay = () => {
  if (musicStore.isPlaying) {
    musicStore.pause()
  } else {
    musicStore.play()
  }
}

// Sync audio element with store state
watch(() => musicStore.isPlaying, (playing) => {
  if (!audioEl.value) return
  if (playing) {
    audioEl.value.play().catch(e => {
      console.warn('Autoplay prevented:', e)
      musicStore.pause()
    })
  } else {
    audioEl.value.pause()
  }
})

watch(() => musicStore.currentIndex, () => {
  if (audioEl.value) {
    audioEl.value.currentTime = 0
    if (musicStore.isPlaying) {
      audioEl.value.play().catch(() => musicStore.pause())
    }
  }
})

watch(() => musicStore.volume, (vol) => {
  if (audioEl.value) {
    audioEl.value.volume = musicStore.isMuted ? 0 : vol
  }
})

watch(() => musicStore.isMuted, (muted) => {
  if (audioEl.value) {
    audioEl.value.volume = muted ? 0 : musicStore.volume
  }
})

const onTimeUpdate = () => {
  if (audioEl.value) {
    musicStore.setCurrentTime(audioEl.value.currentTime)
  }
}

const onLoadedMetadata = () => {
  if (audioEl.value) {
    musicStore.setDuration(audioEl.value.duration)
  }
}

const onEnded = () => {
  if (musicStore.playMode === 'single') {
    if (audioEl.value) {
      audioEl.value.currentTime = 0
      audioEl.value.play()
    }
  } else {
    musicStore.next()
  }
}

const onError = (e: Event) => {
  console.error('Audio error:', e)
}

onMounted(async () => {
  await musicStore.loadPlaylist()
  
  if (audioEl.value) {
    audioEl.value.volume = musicStore.volume
  }
})
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>
