
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <p class="text-xs text-gray-500 dark:text-gray-400 flex-1">{{ t.lab_html_info }}</p>
      
      <!-- View Mode Toggle -->
      <div class="bg-indigo-50 dark:bg-gray-900 p-1 rounded-lg flex gap-1 flex-shrink-0">
         <button 
           @click="debugMode = true"
           class="px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1"
           :class="debugMode ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
         >
           <span>📐</span> {{ t.lab_html_debug }}
         </button>
         <button 
           @click="debugMode = false"
           class="px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1"
           :class="!debugMode ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
         >
           <span>👁️</span> {{ t.lab_html_preview }}
         </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Editor -->
      <div class="flex flex-col h-full min-h-[400px]">
        <div class="bg-gray-800 text-gray-300 text-xs px-4 py-2 rounded-t-lg font-bold flex justify-between items-center border-b border-gray-700">
          <div class="flex gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span class="text-[10px] bg-gray-700 px-2 py-0.5 rounded opacity-70">index.html (Editable)</span>
        </div>
        <textarea 
          v-model="htmlCode" 
          @input="simulateRender"
          class="w-full flex-1 bg-[#1e1e1e] text-blue-300 p-4 font-mono text-sm focus:outline-none resize-none shadow-inner custom-scrollbar leading-relaxed"
          spellcheck="false"
        ></textarea>
        
        <!-- Preset Buttons -->
        <div class="bg-[#252526] p-2 flex gap-2 overflow-x-auto rounded-b-lg border-t border-gray-700 scrollbar-none">
           <button @click="setTemplate('news')" class="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 text-[10px] font-medium rounded transition-colors whitespace-nowrap border border-indigo-500/30">📰 News Article</button>
           <button @click="setTemplate('card')" class="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 text-[10px] font-medium rounded transition-colors whitespace-nowrap border border-indigo-500/30">🪪 ID Card</button>
           <button @click="setTemplate('list')" class="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 text-[10px] font-medium rounded transition-colors whitespace-nowrap border border-indigo-500/30">📝 Todo List</button>
        </div>
      </div>

      <!-- Preview & Kernel Simulator -->
      <div class="flex flex-col h-full min-h-[400px]">
         <!-- Kernel Status Bar (Simulation) -->
         <div class="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3 rounded-t-lg flex flex-col gap-2">
            <div class="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400">
               <span>{{ t.lab_html_process }}</span>
               <span class="text-indigo-500">{{ renderStatusText }}</span>
            </div>
            <!-- Progress Bar -->
            <div class="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
               <div 
                 class="h-full bg-indigo-500 transition-all duration-300 ease-out"
                 :style="{ width: renderProgress + '%' }"
               ></div>
            </div>
            <!-- Phases Indicators -->
            <div class="flex justify-between text-[8px] uppercase font-bold text-gray-400">
               <span :class="{'text-indigo-500': renderStep >= 1}">Parse</span>
               <span :class="{'text-indigo-500': renderStep >= 2}">DOM Tree</span>
               <span :class="{'text-indigo-500': renderStep >= 3}">Layout</span>
               <span :class="{'text-indigo-500': renderStep >= 4}">Paint</span>
            </div>
         </div>

        <div class="relative flex-1 bg-white dark:bg-gray-800 p-4 rounded-b-lg border border-gray-200 dark:border-gray-600 overflow-hidden shadow-inner">
           <!-- Rendered Content with Scoped Styles -->
           <div 
             class="html-visualizer-sandbox h-full w-full overflow-auto custom-scrollbar transition-opacity duration-300" 
             :class="{'debug-mode': debugMode, 'opacity-50 blur-[1px]': renderStep < 4}"
             v-html="renderedCode"
           ></div>

           <!-- Loading Overlay Simulation -->
           <div v-if="renderStep < 4" class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="bg-black/70 text-white px-4 py-2 rounded-lg text-xs font-mono animate-pulse">
                 ⚙️ Kernel Working...
              </div>
           </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { I18N } from '../constants';
import _ from 'lodash';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);
const debugMode = ref(false);

// Kernel Simulation State
const renderProgress = ref(100);
const renderStep = ref(4); // 0: Idle, 1: Parse, 2: DOM, 3: Style/Layout, 4: Paint
const renderStatusText = ref('Idle');

// Templates based on Source.md concepts
const templates = {
  news: `<!-- News Article Structure -->
<article style="font-family: serif; max-width: 400px; margin: 0 auto;">
  <h1 style="color: #333; border-bottom: 2px solid #d00;">Frontend News</h1>
  <p style="color: #666; font-style: italic;">Published on: 2023-11-18</p>
  
  <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&q=80" style="width: 100%; border-radius: 8px; margin: 10px 0;" />
  
  <p style="line-height: 1.6;">
    HTML provides the structure, while CSS handles the presentation. 
    Notice how this text is styled to be readable.
  </p>
  
  <a href="#" style="display: inline-block; background: #d00; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Read More</a>
</article>`,
  
  card: `<div style="border: 1px solid #ddd; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px; background: #fafafa; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <img src="https://ui-avatars.com/api/?name=Sakura+Vue&background=f43f72&color=fff" style="width: 60px; height: 60px; border-radius: 50%;" />
  <div>
    <h3 style="margin: 0; color: #333;">Sakura Vue</h3>
    <p style="margin: 5px 0 0 0; color: #777; font-size: 14px;">Frontend Developer</p>
    <div style="margin-top: 8px;">
       <span style="background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 10px; font-size: 10px;">HTML</span>
       <span style="background: #fce7f3; color: #db2777; padding: 2px 8px; border-radius: 10px; font-size: 10px;">CSS</span>
    </div>
  </div>
</div>`,

  list: `<h3 style="color: #4f46e5;">My Learning Path</h3>
<ul style="padding-left: 20px;">
  <li style="margin-bottom: 8px;">
    <strong>HTML5</strong> - Structure
  </li>
  <li style="margin-bottom: 8px; color: #db2777;">
    <strong>CSS3</strong> - Presentation (Current)
  </li>
  <li style="color: #9ca3af;">
    JavaScript - Behavior (Pending)
  </li>
</ul>`
};

const htmlCode = ref(templates.news);
const renderedCode = ref(templates.news);

// Simulation Logic
const updateRender = () => {
    // 1. Parse
    renderStep.value = 1;
    renderProgress.value = 25;
    renderStatusText.value = t.value.lab_html_status_parse;

    setTimeout(() => {
        // 2. DOM
        renderStep.value = 2;
        renderProgress.value = 50;
        renderStatusText.value = t.value.lab_html_status_dom;
        
        setTimeout(() => {
            // 3. Style
            renderStep.value = 3;
            renderProgress.value = 75;
            renderStatusText.value = t.value.lab_html_status_style;

            setTimeout(() => {
                // 4. Paint
                renderStep.value = 4;
                renderProgress.value = 100;
                renderStatusText.value = t.value.lab_html_status_paint;
                renderedCode.value = htmlCode.value; // Actually apply HTML
                
                setTimeout(() => {
                    renderStatusText.value = t.value.lab_html_status_idle;
                }, 500);
            }, 300);
        }, 300);
    }, 200);
};

const simulateRender = _.debounce(updateRender, 1000);

const setTemplate = (key: keyof typeof templates) => {
  htmlCode.value = templates[key];
  updateRender();
};

onMounted(() => {
    renderStatusText.value = t.value.lab_html_status_idle;
});
</script>

<style scoped>
/* 
  Debug Mode Styles using :deep() to penetrate v-html content
*/
.html-visualizer-sandbox.debug-mode :deep(*) {
  outline: 1px dashed rgba(99, 102, 241, 0.5) !important; /* Indigo */
  position: relative;
}

.html-visualizer-sandbox.debug-mode :deep(*):hover {
  outline: 2px solid #f43f72 !important; /* Sakura */
  background-color: rgba(244, 63, 114, 0.05);
  cursor: default;
}

/* Tooltip on hover in debug mode */
.html-visualizer-sandbox.debug-mode :deep(*):hover::after {
  content: "<" attr(tagName) ">"; /* Note: standard CSS can't grab tagName easily without JS, this is pseudo */
  content: "Element";
  position: absolute;
  top: -15px;
  left: 0;
  background: #f43f72;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  z-index: 10;
}
</style>
