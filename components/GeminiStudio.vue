<script setup lang="ts">
import { ref } from 'vue';
import { Upload, Wand2, RefreshCw, AlertCircle, Download } from 'lucide-vue-next';
import Button from './Button.vue';
import { editImageWithGemini } from '../services/geminiService';
import { GeminiImageState } from '../types';

const state = ref<GeminiImageState>({
  originalImage: null,
  generatedImage: null,
  prompt: '',
  isLoading: false,
  error: null,
});

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      state.value.error = "Image too large. Max 5MB.";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      state.value.originalImage = reader.result as string;
      state.value.generatedImage = null;
      state.value.error = null;
    };
    reader.readAsDataURL(file);
  }
};

const handleGenerate = async () => {
  if (!state.value.originalImage || !state.value.prompt) return;

  state.value.isLoading = true;
  state.value.error = null;

  try {
    const result = await editImageWithGemini(state.value.originalImage, state.value.prompt);
    state.value.generatedImage = result;
  } catch (err: any) {
    state.value.error = err.message || "Failed to generate image. Try again.";
  } finally {
    state.value.isLoading = false;
  }
};

const triggerUpload = () => {
  fileInput.value?.click();
};

const downloadGenerated = () => {
  if (state.value.generatedImage) {
    const a = document.createElement('a');
    a.href = state.value.generatedImage;
    a.download = `gemini-edit-${Date.now()}.png`;
    a.click();
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-pink-100 rounded-lg text-pink-500">
              <Wand2 :size="24" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-800">AI Image Studio</h2>
            <p class="text-gray-500 text-sm">Powered by Gemini 2.5 Flash Image</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- Input Area -->
            <div class="space-y-4">
              <div 
                @click="triggerUpload"
                class="border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors"
                :class="state.originalImage ? 'border-pink-300 bg-pink-50/50' : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'"
              >
                <img v-if="state.originalImage" :src="state.originalImage" alt="Original" class="h-full w-full object-contain rounded-lg" />
                <div v-else class="flex flex-col items-center">
                  <Upload class="text-gray-400 mb-2" :size="32" />
                  <p class="text-gray-500 font-medium">Click to upload image</p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileChange" 
                accept="image/*" 
                class="hidden" 
              />
            </div>

            <!-- Output Area -->
            <div class="space-y-4">
              <div class="border border-gray-200 rounded-xl h-64 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  <div v-if="state.isLoading" class="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center gap-3">
                    <RefreshCw class="animate-spin text-pink-500" :size="32" />
                    <span class="text-sm font-medium text-gray-600 animate-pulse">Gemini is dreaming...</span>
                  </div>
                  
                  <img v-if="state.generatedImage" :src="state.generatedImage" alt="Generated" class="h-full w-full object-contain rounded-lg" />
                  <div v-else class="text-center text-gray-400">
                    <p>Generated result will appear here</p>
                  </div>
              </div>
            </div>
        </div>

        <!-- Controls -->
        <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Magic Prompt</label>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="state.prompt"
                  placeholder="E.g., Make it look like a cyberpunk city, Add a cat in the corner..."
                  class="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  @keydown.enter="handleGenerate"
                />
                <Button 
                  @click="handleGenerate" 
                  :disabled="!state.originalImage || !state.prompt || state.isLoading"
                  :icon="Wand2"
                >
                  Generate
                </Button>
              </div>
            </div>

            <div v-if="state.error" class="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg text-sm">
              <AlertCircle :size="16" />
              {{ state.error }}
            </div>
            
            <div v-if="state.generatedImage" class="flex justify-end">
                <Button variant="secondary" @click="downloadGenerated" :icon="Download">
                  Download Result
                </Button>
            </div>
        </div>
      </div>
  </div>
</template>