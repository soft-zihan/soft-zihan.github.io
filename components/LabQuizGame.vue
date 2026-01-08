<template>
  <div class="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden border-2 border-orange-100 dark:border-gray-700 max-w-2xl mx-auto transition-all duration-500 relative min-h-[500px] flex flex-col">
    
    <!-- Phase 1: Game Start (Category Selection) -->
    <div v-if="gameState === 'start'" class="p-8 flex flex-col items-center justify-center text-center flex-1 animate-fade-in">
      <div class="text-6xl mb-4 animate-bounce">🥷</div>
      <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">{{ t.lab_quiz_title }}</h2>
      <p class="text-gray-500 mb-8">{{ t.lab_quiz_subtitle }}</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mb-8">
        <button @click="selectCategory('all')" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center gap-2 group">
          <span class="text-2xl group-hover:scale-110 transition-transform">🎲</span>
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ t.quiz_cat_all }}</span>
        </button>
        <button @click="selectCategory('basic')" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center gap-2 group">
          <span class="text-2xl group-hover:scale-110 transition-transform">🎨</span>
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ t.quiz_cat_basic }}</span>
        </button>
        <button @click="selectCategory('js')" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center gap-2 group">
          <span class="text-2xl group-hover:scale-110 transition-transform">⚡</span>
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ t.quiz_cat_js }}</span>
        </button>
        <button @click="selectCategory('vue')" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center gap-2 group">
          <span class="text-2xl group-hover:scale-110 transition-transform">🥝</span>
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ t.quiz_cat_vue }}</span>
        </button>
      </div>
    </div>

    <!-- Phase 2: Playing Screen -->
    <div v-if="gameState === 'playing'" class="p-6 md:p-8 flex flex-col flex-1 animate-fade-in relative">
      
      <!-- Top Bar: Streak & Score -->
      <div class="flex justify-between items-center mb-6 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
         <div class="flex items-center gap-4">
            <div class="text-xs font-bold uppercase text-gray-400">Q {{ currentQuestionIndex + 1 }} / {{ activeQuestions.length }}</div>
            <div class="flex items-center gap-1 font-bold text-orange-500 transition-all" :class="{'scale-125': streak > 2}">
               <span>🔥</span> {{ t.quiz_streak }}: {{ streak }}
            </div>
         </div>
         <div class="font-mono font-bold text-sakura-600 dark:text-sakura-400">{{ t.quiz_score }}: {{ totalScore }}</div>
      </div>

      <!-- Timer Bar -->
      <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
        <div 
          class="h-full transition-all duration-1000 ease-linear" 
          :class="timer < 5 ? 'bg-red-500' : 'bg-orange-500'"
          :style="{ width: (timer / 15 * 100) + '%' }"
        ></div>
      </div>

      <!-- Question -->
      <div class="flex-1 flex items-center justify-center mb-8 min-h-[120px]">
        <h3 class="text-xl md:text-2xl font-bold text-center text-gray-800 dark:text-gray-100 leading-relaxed">
          {{ currentQuestion.text }}
        </h3>
      </div>

      <!-- Options -->
      <div class="grid grid-cols-1 gap-3 mb-6">
        <button 
          v-for="(opt, idx) in currentQuestion.options" 
          :key="idx"
          @click="selectAnswer(idx)"
          class="p-4 rounded-xl border-2 font-bold text-left transition-all relative overflow-hidden group flex items-center"
          :class="[
             hiddenOptions.includes(idx) ? 'opacity-20 pointer-events-none filter blur-sm' : '',
             selectedAnswer === null 
               ? 'border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700' 
               : (idx === currentQuestion.correct ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : (idx === selectedAnswer ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'opacity-40'))
          ]"
          :disabled="selectedAnswer !== null || hiddenOptions.includes(idx)"
        >
          <span class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center mr-3 text-xs flex-shrink-0 group-hover:bg-white transition-colors">
            {{ ['A', 'B', 'C', 'D'][idx] }}
          </span>
          <span class="flex-1">{{ opt }}</span>
          
          <!-- Result Icon -->
          <span v-if="selectedAnswer !== null && idx === currentQuestion.correct" class="text-green-500 ml-2">✓</span>
          <span v-if="selectedAnswer !== null && idx === selectedAnswer && idx !== currentQuestion.correct" class="text-red-500 ml-2">✗</span>
        </button>
      </div>

      <!-- Bottom Bar: Lifelines -->
      <div class="mt-auto flex justify-between items-center h-12">
         <div class="text-sm font-bold" :class="feedbackClass">{{ feedback }}</div>
         
         <!-- Lifeline: 50/50 -->
         <button 
           @click="use5050" 
           :disabled="lifelines.fiftyFiftyUsed || selectedAnswer !== null"
           class="px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition-all"
           :class="lifelines.fiftyFiftyUsed ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-400'"
           title="Remove 2 wrong answers"
         >
           <span>✂️</span> {{ t.quiz_lifeline_5050 }}
         </button>
      </div>
    </div>

    <!-- Phase 3: Result Screen -->
    <div v-if="gameState === 'ended'" class="p-8 flex flex-col items-center text-center animate-fade-in flex-1">
       <div class="text-6xl mb-4">{{ totalScore > activeQuestions.length * 8 ? '🏆' : (totalScore > activeQuestions.length * 5 ? '🥈' : '📚') }}</div>
       <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Training Complete!</h2>
       
       <div class="flex gap-8 my-6">
          <div class="flex flex-col">
             <span class="text-3xl font-bold text-orange-500">{{ correctCount }}</span>
             <span class="text-xs text-gray-400 uppercase">Correct</span>
          </div>
          <div class="flex flex-col">
             <span class="text-3xl font-bold text-sakura-500">{{ totalScore }}</span>
             <span class="text-xs text-gray-400 uppercase">Score</span>
          </div>
           <div class="flex flex-col">
             <span class="text-3xl font-bold text-blue-500">{{ maxStreak }}</span>
             <span class="text-xs text-gray-400 uppercase">Best Streak</span>
          </div>
       </div>
       
       <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 italic">
         "{{ getEndMessage() }}"
       </p>

       <!-- Wrong Answers Review -->
       <div v-if="reviewList.length > 0" class="w-full bg-red-50 dark:bg-gray-900/50 rounded-xl p-4 mb-8 text-left border border-red-100 dark:border-red-900/30">
          <h3 class="font-bold text-red-500 mb-4 flex items-center gap-2">
            <span>📝</span> {{ t.quiz_review }}
          </h3>
          <div class="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
             <div v-for="(item, idx) in reviewList" :key="idx" class="text-sm border-b border-red-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <div class="font-bold text-gray-700 dark:text-gray-200 mb-1">{{ idx + 1 }}. {{ item.question.content[props.lang].text }}</div>
                <div class="text-red-500 text-xs mb-1">✗ {{ item.question.content[props.lang].options[item.userAnswer] }}</div>
                <div class="text-green-600 text-xs mb-1">✓ {{ item.question.content[props.lang].options[item.question.correct] }}</div>
                <div class="text-gray-500 dark:text-gray-400 text-xs italic bg-white dark:bg-gray-800 p-2 rounded mt-2">
                   <span class="font-bold text-gray-400">{{ t.quiz_explanation }}:</span> {{ item.question.content[props.lang].explanation }}
                </div>
             </div>
          </div>
       </div>

       <div class="flex gap-4">
         <button @click="resetGame" class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-bold rounded-xl transition-all">
           Categories
         </button>
         <button @click="startGame(lastCategory)" class="px-8 py-2 bg-sakura-500 hover:bg-sakura-600 text-white font-bold rounded-xl shadow-lg transition-all">
           Try Again
         </button>
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import _ from 'lodash';
import { I18N } from '../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

type Category = 'basic' | 'js' | 'vue' | 'all';

// Dual-language Content
type LocalizedContent = {
  text: string;
  options: string[];
  explanation: string;
}

type Question = {
  category: Category;
  correct: number;
  content: {
    en: LocalizedContent;
    zh: LocalizedContent;
  }
};

// --- Data: 50 Questions Pool (Dual Language) ---
const allQuestions: Question[] = [
  // HTML/CSS (Basic)
  { 
    category: 'basic', 
    correct: 0, 
    content: {
      en: { text: "What does the <a> tag stand for?", options: ["Anchor", "Article", "Aside", "Application"], explanation: "<a> stands for Anchor, defining a hyperlink." },
      zh: { text: "<a> 标签代表什么？", options: ["锚点 (Anchor)", "文章 (Article)", "旁注 (Aside)", "应用 (Application)"], explanation: "<a> 代表 Anchor，用于定义超链接。" }
    }
  },
  { 
    category: 'basic', 
    correct: 2, 
    content: {
      en: { text: "Which HTML5 tag is used for semantic navigation?", options: ["<div class='nav'>", "<navigation>", "<nav>", "<menu>"], explanation: "<nav> is the correct semantic tag for navigation links." },
      zh: { text: "哪个 HTML5 标签用于语义化导航？", options: ["<div class='nav'>", "<navigation>", "<nav>", "<menu>"], explanation: "<nav> 是定义导航链接区域的正确语义标签。" }
    }
  },
  { 
    category: 'basic', 
    correct: 2, 
    content: {
      en: { text: "Which CSS property changes text color?", options: ["font-color", "text-color", "color", "foreground"], explanation: "The 'color' property sets the color of the text." },
      zh: { text: "哪个 CSS 属性改变文字颜色？", options: ["font-color", "text-color", "color", "foreground"], explanation: "'color' 属性用于设置文本颜色。" }
    }
  },
  { 
    category: 'basic', 
    correct: 1, 
    content: {
      en: { text: "How do you center a flex item horizontally?", options: ["align-items: center", "justify-content: center", "text-align: center", "vertical-align: middle"], explanation: "In a flex row, 'justify-content' controls horizontal alignment." },
      zh: { text: "如何在 Flex 布局中水平居中元素？", options: ["align-items: center", "justify-content: center", "text-align: center", "vertical-align: middle"], explanation: "在默认的 Flex 行布局中，'justify-content' 控制主轴（水平）对齐。" }
    }
  },
  { 
    category: 'basic', 
    correct: 1, 
    content: {
      en: { text: "What is the Box Model order (inside out)?", options: ["Content > Margin > Border > Padding", "Content > Padding > Border > Margin", "Border > Content > Padding > Margin", "Padding > Content > Margin > Border"], explanation: "Content is core, surrounded by Padding, then Border, then Margin." },
      zh: { text: "盒模型从内到外的顺序是什么？", options: ["内容 > 外边距 > 边框 > 内边距", "内容 > 内边距 > 边框 > 外边距", "边框 > 内容 > 内边距 > 外边距", "内边距 > 内容 > 外边距 > 边框"], explanation: "最内层是内容，被内边距包围，然后是边框，最后是外边距。" }
    }
  },
  { 
    category: 'basic', 
    correct: 1, 
    content: {
      en: { text: "Which unit is relative to the root HTML element font size?", options: ["em", "rem", "px", "%"], explanation: "'rem' stands for Root EM." },
      zh: { text: "哪个单位是相对于根 HTML 元素字体大小的？", options: ["em", "rem", "px", "%"], explanation: "'rem' 代表 Root EM，即相对于根元素的 em。" }
    }
  },
  { 
    category: 'basic', 
    correct: 1, 
    content: {
      en: { text: "Which selector has the highest specificity?", options: [".class", "#id", "div", "*"], explanation: "ID selectors (#) have higher specificity than classes and tags." },
      zh: { text: "下列哪个选择器优先级最高？", options: [".class", "#id", "div", "*"], explanation: "ID 选择器 (#) 的优先级高于类选择器、标签选择器和通配符。" }
    }
  },
  { 
    category: 'basic', 
    correct: 0, 
    content: {
      en: { text: "How to make a grid with 3 equal columns?", options: ["display: grid; grid-template-columns: 1fr 1fr 1fr;", "display: grid; columns: 3;", "display: flex; flex: 3;", "grid-columns: auto auto auto;"], explanation: "1fr 1fr 1fr creates three equal fractional columns." },
      zh: { text: "如何创建一个三列等宽的 Grid 布局？", options: ["display: grid; grid-template-columns: 1fr 1fr 1fr;", "display: grid; columns: 3;", "display: flex; flex: 3;", "grid-columns: auto auto auto;"], explanation: "1fr 1fr 1fr 会创建三个相等的比例空间列。" }
    }
  },
  { 
    category: 'basic', 
    correct: 2, 
    content: {
      en: { text: "Which pseudo-class selects the mouse-over state?", options: [":active", ":focus", ":hover", ":visited"], explanation: ":hover applies when the user mouses over an element." },
      zh: { text: "哪个伪类用于选中鼠标悬停状态？", options: [":active", ":focus", ":hover", ":visited"], explanation: ":hover 在用户鼠标悬停在元素上时生效。" }
    }
  },
  { 
    category: 'basic', 
    correct: 1, 
    content: {
      en: { text: "What is the default display value of <div>?", options: ["inline", "block", "inline-block", "flex"], explanation: "<div> is a block-level element by default." },
      zh: { text: "<div> 的默认 display 属性值是什么？", options: ["inline", "block", "inline-block", "flex"], explanation: "<div> 是块级元素，默认为 block。" }
    }
  },

  // JavaScript (JS)
  { 
    category: 'js', 
    correct: 2, 
    content: {
      en: { text: "Which keyword creates a constant variable?", options: ["var", "let", "const", "final"], explanation: "'const' declares variables that cannot be reassigned." },
      zh: { text: "哪个关键字用于声明常量？", options: ["var", "let", "const", "final"], explanation: "'const' 声明的变量引用不能被重新赋值。" }
    }
  },
  { 
    category: 'js', 
    correct: 1, 
    content: {
      en: { text: "What is 'Closure'?", options: ["A function closing the app", "A function remembering its lexical scope", "A block of code inside {}", "An object method"], explanation: "A closure gives a function access to its outer function's scope even after the outer function has returned." },
      zh: { text: "什么是“闭包” (Closure)？", options: ["关闭应用的函数", "能记住其词法作用域的函数", "{} 中的代码块", "对象方法"], explanation: "闭包允许函数访问其外部作用域，即使外部函数已经执行完毕。" }
    }
  },
  { 
    category: 'js', 
    correct: 2, 
    content: {
      en: { text: "What does '===' operator do?", options: ["Assignment", "Loose equality (value only)", "Strict equality (value & type)", "Reference check"], explanation: "=== checks both value and type without type coercion." },
      zh: { text: "'===' 运算符的作用是？", options: ["赋值", "宽松相等 (仅值)", "严格相等 (值和类型)", "引用检查"], explanation: "=== 会同时检查值和类型，不会进行类型转换。" }
    }
  },
  { 
    category: 'js', 
    correct: 2, 
    content: {
      en: { text: "Which array method returns a new array with transformed elements?", options: ["forEach", "filter", "map", "reduce"], explanation: ".map() creates a new array by applying a function to every element." },
      zh: { text: "哪个数组方法返回一个转换元素后的新数组？", options: ["forEach", "filter", "map", "reduce"], explanation: ".map() 通过对每个元素应用函数来创建一个新数组。" }
    }
  },
  { 
    category: 'js', 
    correct: 2, 
    content: {
      en: { text: "What is the output of: console.log(typeof null)?", options: ["'null'", "'undefined'", "'object'", "'number'"], explanation: "This is a historical bug in JS. typeof null returns 'object'." },
      zh: { text: "console.log(typeof null) 的输出是什么？", options: ["'null'", "'undefined'", "'object'", "'number'"], explanation: "这是 JS 的历史遗留 Bug，typeof null 返回 'object'。" }
    }
  },
  { 
    category: 'js', 
    correct: 1, 
    content: {
      en: { text: "How do you handle asynchronous code in modern JS?", options: ["Callbacks only", "Promise & async/await", "XMLHttpRequest", "Threads"], explanation: "Promises and async/await are the modern standard for async operations." },
      zh: { text: "现代 JS 如何处理异步代码？", options: ["仅回调函数", "Promise & async/await", "XMLHttpRequest", "多线程"], explanation: "Promise 和 async/await 是处理异步操作的现代标准。" }
    }
  },
  { 
    category: 'js', 
    correct: 2, 
    content: {
      en: { text: "What keyword refers to the object executing the current function?", options: ["self", "it", "this", "me"], explanation: "'this' refers to the context object." },
      zh: { text: "哪个关键字指向执行当前函数的对象？", options: ["self", "it", "this", "me"], explanation: "'this' 指向当前的执行上下文对象。" }
    }
  },
  { 
    category: 'js', 
    correct: 1, 
    content: {
      en: { text: "How to parse a JSON string into an object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.toObj()"], explanation: "JSON.parse() converts a JSON string to a JS object." },
      zh: { text: "如何将 JSON 字符串解析为对象？", options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.toObj()"], explanation: "JSON.parse() 用于将 JSON 字符串转换为 JavaScript 对象。" }
    }
  },
  { 
    category: 'js', 
    correct: 1, 
    content: {
      en: { text: "What is Event Bubbling?", options: ["Events stop at target", "Events go from target up to window", "Events go from window down to target", "Creating a custom event"], explanation: "Bubbling propagates the event from the target element up to the root." },
      zh: { text: "什么是事件冒泡 (Event Bubbling)？", options: ["事件在目标处停止", "事件从目标向上传播到 Window", "事件从 Window 向下传播到目标", "创建自定义事件"], explanation: "冒泡是指事件从触发的目标元素开始，逐级向上传播到根节点。" }
    }
  },
  { 
    category: 'js', 
    correct: 2, 
    content: {
      en: { text: "Which is NOT a primitive type?", options: ["String", "Boolean", "Array", "Symbol"], explanation: "Array is a subtype of Object in JS." },
      zh: { text: "下列哪个不是基本数据类型 (Primitive Type)？", options: ["String", "Boolean", "Array", "Symbol"], explanation: "Array 在 JS 中属于对象 (Object) 类型。" }
    }
  },

  // Vue Core & Ecosystem (Vue)
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "Which function creates reactive state for primitives?", options: ["reactive()", "ref()", "computed()", "watch()"], explanation: "ref() is used for primitives (and objects), reactive() is essentially for objects." },
      zh: { text: "哪个函数用于为基本类型创建响应式状态？", options: ["reactive()", "ref()", "computed()", "watch()"], explanation: "ref() 用于基本类型（也可用于对象），而 reactive() 主要用于对象。" }
    }
  },
  { 
    category: 'vue', 
    correct: 2, 
    content: {
      en: { text: "How do you emit an event in <script setup>?", options: ["this.$emit", "defineProps", "defineEmits", "useEmit"], explanation: "defineEmits is the compiler macro used in script setup." },
      zh: { text: "在 <script setup> 中如何触发事件？", options: ["this.$emit", "defineProps", "defineEmits", "useEmit"], explanation: "defineEmits 是 script setup 中用于定义和触发事件的编译器宏。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "Which directive creates two-way binding?", options: ["v-bind", "v-model", "v-on", "v-sync"], explanation: "v-model implements two-way binding for form inputs and components." },
      zh: { text: "哪个指令实现双向数据绑定？", options: ["v-bind", "v-model", "v-on", "v-sync"], explanation: "v-model 用于在表单输入和组件上实现双向绑定。" }
    }
  },
  { 
    category: 'vue', 
    correct: 2, 
    content: {
      en: { text: "Which hook runs after DOM is rendered?", options: ["onCreated", "onSetup", "onMounted", "onUpdated"], explanation: "onMounted is called after the component is mounted to the DOM." },
      zh: { text: "哪个钩子在 DOM 渲染完成后执行？", options: ["onCreated", "onSetup", "onMounted", "onUpdated"], explanation: "onMounted 在组件挂载到 DOM 之后调用。" }
    }
  },
  { 
    category: 'vue', 
    correct: 2, 
    content: {
      en: { text: "Difference between v-if and v-show?", options: ["v-show removes element", "v-if toggles CSS display", "v-if removes element", "No difference"], explanation: "v-if physically adds/removes the element; v-show just toggles 'display: none'." },
      zh: { text: "v-if 和 v-show 的区别是？", options: ["v-show 移除元素", "v-if 切换 CSS display", "v-if 移除元素", "没有区别"], explanation: "v-if 真实地从 DOM 中添加/移除元素；v-show 只是切换 'display: none'。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "Shorthand for v-bind?", options: ["@", ":", "#", "$"], explanation: ":href is shorthand for v-bind:href." },
      zh: { text: "v-bind 的缩写是？", options: ["@", ":", "#", "$"], explanation: ":href 是 v-bind:href 的缩写。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "What is Pinia used for?", options: ["Routing", "State Management", "Styling", "Testing"], explanation: "Pinia is the official state management library for Vue." },
      zh: { text: "Pinia 的用途是什么？", options: ["路由", "状态管理", "样式", "测试"], explanation: "Pinia 是 Vue 官方推荐的状态管理库。" }
    }
  },
  { 
    category: 'vue', 
    correct: 0, 
    content: {
      en: { text: "Which component keeps dynamic components alive?", options: ["<keep-alive>", "<live>", "<cache>", "<persist>"], explanation: "<keep-alive> caches component instances." },
      zh: { text: "哪个组件可以缓存动态组件？", options: ["<keep-alive>", "<live>", "<cache>", "<persist>"], explanation: "<keep-alive> 用于缓存组件实例，避免销毁。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "In Vue Router, how to create a link?", options: ["<a href='...'>", "<router-link>", "<go-to>", "<link>"], explanation: "<router-link> (or RouterLink) creates a navigational link." },
      zh: { text: "在 Vue Router 中如何创建链接？", options: ["<a href='...'>", "<router-link>", "<go-to>", "<link>"], explanation: "<router-link> 用于创建导航链接，防止页面刷新。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "What is the purpose of 'computed'?", options: ["Side effects", "Caching derived state", "Fetching data", "Defining constants"], explanation: "Computed properties cache results based on dependencies." },
      zh: { text: "'computed' 的主要目的是？", options: ["副作用", "缓存派生状态", "获取数据", "定义常量"], explanation: "计算属性基于依赖进行缓存，只有依赖变化时才重新计算。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "What replaces 'this' in Composition API?", options: ["self", "Nothing (variables directly)", "ctx", "scope"], explanation: "In Composition API, we use variables directly within the setup scope." },
      zh: { text: "组合式 API 中什么替代了 'this'？", options: ["self", "无 (直接使用变量)", "ctx", "scope"], explanation: "在组合式 API (setup) 中，我们直接定义和使用变量，不需要 'this'。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "How to pass content into a component?", options: ["Props", "Slots", "Emits", "Provide"], explanation: "Slots allow passing template content into a component." },
      zh: { text: "如何将模板内容传入组件？", options: ["Props", "Slots (插槽)", "Emits", "Provide"], explanation: "Slots (插槽) 允许我们将内容分发到组件内部。" }
    }
  },
  { 
    category: 'vue', 
    correct: 2, 
    content: {
      en: { text: "Which directive loops over an array?", options: ["v-loop", "v-map", "v-for", "v-each"], explanation: "v-for='item in items' is the loop directive." },
      zh: { text: "哪个指令用于遍历数组？", options: ["v-loop", "v-map", "v-for", "v-each"], explanation: "v-for='item in items' 是 Vue 的循环指令。" }
    }
  },
  { 
    category: 'vue', 
    correct: 0, 
    content: {
      en: { text: "What is 'Prop Drilling' solution in Vue?", options: ["Provide/Inject", "Props", "Emits", "Refs"], explanation: "Provide/Inject allows passing data deep into the component tree without prop drilling." },
      zh: { text: "解决 'Prop Drilling' (层层传递) 的方案是？", options: ["Provide/Inject", "Props", "Emits", "Refs"], explanation: "Provide/Inject 允许跨层级传递数据，避免逐层透传 Props。" }
    }
  },
  { 
    category: 'vue', 
    correct: 1, 
    content: {
      en: { text: "Vue 3's build tool?", options: ["Webpack", "Vite", "Gulp", "Grunt"], explanation: "Vite is the default, ultra-fast build tool for Vue 3." },
      zh: { text: "Vue 3 默认的构建工具是？", options: ["Webpack", "Vite", "Gulp", "Grunt"], explanation: "Vite 是 Vue 3 默认的极速构建工具。" }
    }
  }
];

// --- State ---
const gameState = ref<'start' | 'playing' | 'ended'>('start');
const activeQuestions = ref<Question[]>([]);
const currentQuestionIndex = ref(0);
const lastCategory = ref<Category>('all');

// Scoring & Gamification
const correctCount = ref(0);
const totalScore = ref(0);
const streak = ref(0);
const maxStreak = ref(0);
const timer = ref(15);
const selectedAnswer = ref<number | null>(null);
const feedback = ref('');
const reviewList = ref<{question: Question, userAnswer: number}[]>([]);
const lifelines = ref({ fiftyFiftyUsed: false });
const hiddenOptions = ref<number[]>([]);

let timerInterval: any = null;

// --- Computed ---
// Retrieve localized content dynamically based on props.lang
const currentQuestion = computed(() => {
  const q = activeQuestions.value[currentQuestionIndex.value];
  if (!q) return null;
  return {
    ...q,
    ...q.content[props.lang] // Flatten localized text/options into the object
  }
});
const feedbackClass = computed(() => feedback.value.includes('✓') ? 'text-green-500 animate-bounce' : 'text-red-500 animate-pulse');

// --- Methods ---

const selectCategory = (cat: Category) => {
  lastCategory.value = cat;
  startGame(cat);
};

const startGame = (cat: Category) => {
  // Filter & Shuffle
  let pool = cat === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => q.category === cat || (cat === 'vue' && q.category === 'basic')); // Fallback slightly if not enough
  
  if (pool.length < 5) pool = allQuestions; // Safety net

  // Pick 10 random questions
  activeQuestions.value = _.sampleSize(pool, 10);
  
  // Reset State
  gameState.value = 'playing';
  currentQuestionIndex.value = 0;
  correctCount.value = 0;
  totalScore.value = 0;
  streak.value = 0;
  maxStreak.value = 0;
  reviewList.value = [];
  lifelines.value = { fiftyFiftyUsed: false };
  
  startTimer();
};

const startTimer = () => {
  timer.value = 15;
  selectedAnswer.value = null;
  feedback.value = '';
  hiddenOptions.value = []; // Reset hidden options
  
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer.value--;
    if (timer.value <= 0) {
      handleTimeout();
    }
  }, 1000);
};

const handleTimeout = () => {
  clearInterval(timerInterval);
  selectedAnswer.value = -1; // -1 indicates timeout/no selection
  feedback.value = "⏰ Time's up!";
  streak.value = 0; // Reset streak
  
  // Add to review
  if (currentQuestion.value) {
      // Store reference to original question object
      reviewList.value.push({
        question: activeQuestions.value[currentQuestionIndex.value],
        userAnswer: -1
      });
  }

  setTimeout(nextQuestion, 2000);
};

const selectAnswer = (idx: number) => {
  if (!currentQuestion.value) return;

  clearInterval(timerInterval);
  selectedAnswer.value = idx;
  
  const isCorrect = idx === currentQuestion.value.correct;

  if (isCorrect) {
    correctCount.value++;
    streak.value++;
    if (streak.value > maxStreak.value) maxStreak.value = streak.value;
    
    // Calculate Score: Base 100 + Time Bonus + Streak Bonus
    const timeBonus = timer.value * 10;
    const streakBonus = (streak.value - 1) * 20;
    totalScore.value += (100 + timeBonus + streakBonus);

    feedback.value = "✓ Correct! " + (streak.value > 1 ? `${streak.value} Streak! 🔥` : '');
  } else {
    streak.value = 0;
    feedback.value = "✗ Wrong!";
    // Add to review
    reviewList.value.push({
      question: activeQuestions.value[currentQuestionIndex.value],
      userAnswer: idx
    });
  }

  setTimeout(nextQuestion, 1500);
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < activeQuestions.value.length - 1) {
    currentQuestionIndex.value++;
    startTimer();
  } else {
    gameState.value = 'ended';
  }
};

const use5050 = () => {
  if (lifelines.value.fiftyFiftyUsed || !currentQuestion.value) return;
  
  lifelines.value.fiftyFiftyUsed = true;
  const correct = currentQuestion.value.correct;
  const wrongIndices = [0, 1, 2, 3].filter(i => i !== correct);
  
  // Randomly hide 2 wrong answers
  const toHide = _.sampleSize(wrongIndices, 2);
  hiddenOptions.value = toHide;
};

const getEndMessage = () => {
  const percentage = correctCount.value / activeQuestions.value.length;
  if (percentage === 1) return t.value.quiz_perfect;
  if (percentage >= 0.6) return t.value.quiz_good;
  return t.value.quiz_try;
};

const resetGame = () => {
   gameState.value = 'start';
};
</script>