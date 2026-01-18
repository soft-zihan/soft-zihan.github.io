<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_dashboard }}</h1>
      <p class="text-sakura-500">{{ t.lab_dashboard_desc }}</p>
    </div>

    <!-- Tab Navigation -->
    <div class="flex justify-center mb-8 px-4">
      <div class="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl flex flex-wrap justify-center gap-2 shadow-inner">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-3 md:px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center gap-0.5 min-w-[60px] md:min-w-[90px]"
          :class="activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-sakura-600 dark:text-sakura-300 shadow-md transform scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          <span class="text-lg md:text-xl">{{ tab.icon }}</span>
          <span class="text-[10px] md:text-xs">{{ tab.label.split(' ').pop() }}</span>
          <span class="text-[8px] text-gray-400 hidden md:block">{{ lang === 'zh' ? `第${tab.stage}阶段` : `Stage ${tab.stage}` }}</span>
        </button>
      </div>
    </div>

    <!-- Learning Progress Indicator -->
    <div class="max-w-3xl mx-auto mb-8 px-4">
      <div class="flex items-center gap-2">
        <template v-for="(tab, index) in tabs" :key="tab.id">
          <div 
            class="flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer"
            :class="activeTabIndex >= index ? 'bg-sakura-400' : 'bg-gray-200 dark:bg-gray-700'"
            @click="activeTab = tab.id"
          ></div>
        </template>
      </div>
      <div class="flex justify-between mt-2 text-[10px] text-gray-400">
        <span>{{ lang === 'zh' ? '入门' : 'Beginner' }}</span>
        <span>{{ lang === 'zh' ? '进阶' : 'Advanced' }}</span>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-h-[500px] transition-all duration-500">
      
      <!-- Stage Info Banner -->
      <div class="max-w-4xl mx-auto mb-8 px-4">
        <div class="bg-gradient-to-r from-sakura-50 to-purple-50 dark:from-sakura-900/20 dark:to-purple-900/20 rounded-2xl p-4 md:p-6 border border-sakura-100 dark:border-sakura-800/30">
          <div class="flex items-start gap-4">
            <div class="text-4xl">{{ activeTabInfo?.icon }}</div>
            <div class="flex-1">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">
                {{ lang === 'zh' ? `第${activeTabInfo?.stage}阶段：` : `Stage ${activeTabInfo?.stage}: ` }}
                {{ activeTabInfo?.label.replace(/^[^\s]+\s/, '') }}
              </h3>
              <p class="text-sm text-sakura-600 dark:text-sakura-400 mt-1">
                🎯 {{ activeTabInfo?.goal }}
              </p>
              <p class="text-xs text-gray-500 mt-2">
                {{ activeTabInfo?.desc }}
              </p>
            </div>
            <div class="hidden md:block text-right">
              <span class="text-xs text-gray-400">{{ lang === 'zh' ? '前置要求' : 'Prerequisites' }}</span>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <template v-if="activeTab === 'foundation'">{{ lang === 'zh' ? '无需基础' : 'None' }} ✅</template>
                <template v-else-if="activeTab === 'js-basics'">{{ lang === 'zh' ? '完成 Web 基础' : 'Web Basics' }}</template>
                <template v-else-if="activeTab === 'css-layout'">{{ lang === 'zh' ? '完成 JS 基础' : 'JS Basics' }}</template>
                <template v-else-if="activeTab === 'js-advanced'">{{ lang === 'zh' ? '完成 CSS 布局' : 'CSS Layout' }}</template>
                <template v-else-if="activeTab === 'engineering'">{{ lang === 'zh' ? '完成 JS 进阶' : 'JS Advanced' }}</template>
                <template v-else-if="activeTab === 'vue'">{{ lang === 'zh' ? '完成工程化' : 'Engineering' }}</template>
                <template v-else>{{ lang === 'zh' ? '完成所有阶段' : 'All stages' }}</template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 1: Web Foundation (HTML/CSS/JS) -->
      <div v-if="activeTab === 'foundation'" class="space-y-12 animate-fade-in">
        
        <!-- Part 0: Code Evolution Journey (NEW - Entry Point for Beginners) -->
        <section>
          <LabCodeEvolution :lang="lang" />
        </section>

        <!-- Part 1: Web Standards Triad Visualization -->
        <section class="max-w-4xl mx-auto">
          <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 border border-sakura-100 dark:border-gray-700 shadow-xl relative overflow-hidden">
             <!-- Background decoration -->
             <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>
             
             <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_standards_title }}</h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t.lab_standards_desc }}</p>
             </div>

             <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
                <!-- Interactive Figure -->
                <div class="w-48 h-64 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative transition-all duration-500" :class="{'border-sakura-400 dark:border-sakura-500 shadow-lg shadow-sakura-500/20': standards.css}">
                    <!-- CSS Skin Background -->
                    <div v-if="standards.css" class="absolute inset-2 bg-gradient-to-br from-sakura-100 to-purple-100 dark:from-sakura-900/50 dark:to-purple-900/50 rounded-xl transition-all duration-500 animate-fade-in"></div>

                    <!-- HTML Skeleton (Always visible if toggle is on, but styled differently) -->
                    <div v-if="standards.html" class="relative z-10 text-6xl transition-all duration-500" :class="{'animate-bounce': standards.js}">
                       <span v-if="!standards.css">🦴</span>
                       <span v-else>🤵</span>
                    </div>
                    <div v-else class="text-gray-300 dark:text-gray-700 text-sm font-mono text-center px-4">
                      &lt;div&gt;<br>Empty<br>&lt;/div&gt;
                    </div>

                    <!-- JS Effect -->
                    <div v-if="standards.js" class="absolute -right-4 -top-4 text-2xl animate-pulse">✨</div>
                    <div v-if="standards.js" class="absolute -left-4 -bottom-4 text-2xl animate-spin-slow">⚙️</div>
                </div>

                <!-- Controls -->
                <div class="flex flex-col gap-3 w-full md:w-auto">
                   <!-- HTML Toggle -->
                   <button @click="standards.html = !standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="standards.html ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'"
                   >
                      <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300 font-bold text-lg">H</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_html }}</div>
                        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t.lab_st_info_html }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-orange-500 border-orange-500': standards.html}"></div>
                      </div>
                   </button>

                   <!-- CSS Toggle -->
                   <button @click="standards.css = !standards.css" :disabled="!standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="[
                      !standards.html ? 'cursor-not-allowed opacity-40' : '',
                      standards.css ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                    ]"
                   >
                      <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">C</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_css }}</div>
                        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t.lab_st_info_css }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-blue-500 border-blue-500': standards.css}"></div>
                      </div>
                   </button>

                   <!-- JS Toggle -->
                   <button @click="standards.js = !standards.js" :disabled="!standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="[
                       !standards.html ? 'cursor-not-allowed opacity-40' : '',
                       standards.js ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                    ]"
                   >
                      <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300 font-bold text-lg">J</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_js }}</div>
                        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t.lab_st_info_js }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-yellow-500 border-yellow-500': standards.js}"></div>
                      </div>
                   </button>
                </div>
             </div>
          </div>
        </section>

        <!-- Part 2: Browser Kernel Simulator (Enhanced HTML Lab) -->
        <section>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧱</span> {{ t.lab_html_title }}
            <span class="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? 'HTML 解析' : 'HTML Parsing' }}</span>
          </h2>
          <LabHtml :lang="lang" />
        </section>

        <!-- Part 3: HTML Basics (NEW) -->
        <section>
          <LabHtmlBasics :lang="lang" />
        </section>

        <!-- Next Step Guide -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="max-w-2xl mx-auto text-center">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ lang === 'zh' ? '🎉 完成本阶段后' : '🎉 After this stage' }}
            </h3>
            <p class="text-gray-500 text-sm mb-6">
              {{ lang === 'zh' ? '你已经理解了网页的基本结构！接下来学习 JavaScript 基础语法。' : 'You now understand web page structure! Next, learn JavaScript fundamentals.' }}
            </p>
            <button 
              @click="activeTab = 'js-basics'"
              class="px-6 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              {{ lang === 'zh' ? '进入下一阶段 →' : 'Next Stage →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 2: JS Basics (NEW) -->
      <div v-else-if="activeTab === 'js-basics'" class="space-y-12 animate-fade-in">
        <section>
          <LabJsBasics :lang="lang" />
        </section>

        <!-- Next Step Guide -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="max-w-2xl mx-auto text-center">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ lang === 'zh' ? '🎉 完成本阶段后' : '🎉 After this stage' }}
            </h3>
            <p class="text-gray-500 text-sm mb-6">
              {{ lang === 'zh' ? '你已掌握 JS 核心语法！接下来学习 CSS 布局，让页面更美观。' : 'You\'ve mastered JS core syntax! Next, learn CSS layout to make pages beautiful.' }}
            </p>
            <button 
              @click="activeTab = 'css-layout'"
              class="px-6 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              {{ lang === 'zh' ? '进入下一阶段 →' : 'Next Stage →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 3: CSS Layout (NEW) -->
      <div v-else-if="activeTab === 'css-layout'" class="space-y-12 animate-fade-in">
        <section>
          <LabCssBasics :lang="lang" />
        </section>

        <section>
          <LabCssLayout :lang="lang" />
        </section>

        <!-- Next Step Guide -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="max-w-2xl mx-auto text-center">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ lang === 'zh' ? '🎉 完成本阶段后' : '🎉 After this stage' }}
            </h3>
            <p class="text-gray-500 text-sm mb-6">
              {{ lang === 'zh' ? '你已经可以构建精美的页面布局了！接下来学习 JS 进阶，实现复杂交互。' : 'You can now build beautiful layouts! Next, learn advanced JS for complex interactions.' }}
            </p>
            <button 
              @click="activeTab = 'js-advanced'"
              class="px-6 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              {{ lang === 'zh' ? '进入下一阶段 →' : 'Next Stage →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 4: JS Advanced -->
      <div v-else-if="activeTab === 'js-advanced'" class="space-y-12 animate-fade-in">
        
        <!-- JS Core Mechanics -->
        <section>
          <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">⚡</span> {{ lang === 'zh' ? 'JavaScript 核心机制' : 'JavaScript Core Mechanics' }}
            <span class="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? '事件冒泡/this' : 'Event Bubbling/this' }}</span>
          </h2>
          <LabJs :lang="lang" />
        </section>

        <!-- DOM Manipulation -->
        <section>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎮</span> {{ t.lab_dom_title }}
            <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? 'DOM API' : 'DOM API' }}</span>
          </h2>
          <LabDom :lang="lang" />
        </section>

        <!-- Async Programming (Ajax) -->
        <section class="max-w-4xl mx-auto">
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2 justify-center">
            <span class="text-2xl">📡</span> {{ t.lab_ajax_title }}
            <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? 'Promise/async' : 'Promise/async' }}</span>
          </h2>
          <LabAjax :lang="lang" />
        </section>

        <!-- TypeScript Lab -->
        <section>
          <LabTypeScript :lang="lang" />
        </section>

        <!-- Next Step Guide -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="max-w-2xl mx-auto text-center">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ lang === 'zh' ? '🎉 完成本阶段后' : '🎉 After this stage' }}
            </h3>
            <p class="text-gray-500 text-sm mb-6">
              {{ lang === 'zh' ? '你已掌握 JS 高级特性！接下来学习前端工程化，掌握专业开发流程。' : 'You\'ve mastered advanced JS! Next, learn frontend engineering for professional workflow.' }}
            </p>
            <button 
              @click="activeTab = 'engineering'"
              class="px-6 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              {{ lang === 'zh' ? '进入下一阶段 →' : 'Next Stage →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 5: Engineering -->
      <div v-else-if="activeTab === 'engineering'" class="space-y-12 animate-fade-in">
        
        <!-- Module System Lab -->
        <section>
          <LabModuleSystem :lang="lang" />
        </section>

        <!-- NPM Lab -->
        <section>
          <LabNpm :lang="lang" />
        </section>

        <!-- Build Tools Lab -->
        <section>
          <LabBuildTools :lang="lang" />
        </section>

        <!-- Tailwind CSS -->
        <section>
          <LabTailwind :lang="lang" />
        </section>

        <!-- CSS Frameworks Comparison -->
        <section>
          <LabCssFrameworks :lang="lang" />
        </section>

        <!-- Next Step Guide -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="max-w-2xl mx-auto text-center">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ lang === 'zh' ? '🎉 完成本阶段后' : '🎉 After this stage' }}
            </h3>
            <p class="text-gray-500 text-sm mb-6">
              {{ lang === 'zh' ? '你已掌握前端工程化！接下来学习 Vue 3，构建现代化 Web 应用。' : 'You\'ve mastered frontend engineering! Next, learn Vue 3 to build modern web apps.' }}
            </p>
            <button 
              @click="activeTab = 'vue'"
              class="px-6 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              {{ lang === 'zh' ? '进入下一阶段 →' : 'Next Stage →' }}
            </button>
          </div>
        </div>
      </div>

       <!-- Tab 6: Vue Core -->
      <div v-else-if="activeTab === 'vue'" class="space-y-12 animate-fade-in">
         
        <!-- Part 1: Reactivity - Vue's Core Foundation -->
        <section>
           <h2 class="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
             <span class="text-2xl">🧪</span> {{ t.lab_reactivity }}
             <span class="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? '核心基础' : 'Core' }}</span>
           </h2>
           <LabReactivity :lang="lang" />
        </section>

        <!-- Part 2: Directives & Class/Style Binding (Side by Side) -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">👁️</span> {{ t.lab_directives }}
              <span class="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-2 py-0.5 rounded-full ml-2">v-if / v-show</span>
            </h2>
            <LabDirectives :lang="lang" />
          </section>

          <section>
              <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
                <span class="text-2xl">💅</span> {{ t.lab_class_title }}
                <span class="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full ml-2">:class / :style</span>
              </h2>
              <LabClassStyle :lang="lang" />
          </section>
        </div>

        <!-- Part 3: Event Handling (Integrated) -->
        <section>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🖱️</span> {{ lang === 'zh' ? '事件处理' : 'Event Handling' }}
            <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full ml-2">@click / 修饰符</span>
          </h2>
          <LabEventHandling :lang="lang" />
        </section>

        <!-- Part 4: List Rendering - Full Width (Employee Management System) -->
        <section>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📋</span> {{ t.lab_vue_list_title }}
              <span class="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-2 py-0.5 rounded-full ml-2">v-for / v-model</span>
            </h2>
            <LabVueList :lang="lang" />
        </section>

        <!-- Part 5: Component Communication -->
        <section>
            <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📡</span> {{ t.lab_props_title }}
              <span class="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2">Props ↓ Emit ↑</span>
            </h2>
            <LabPropsEmit :lang="lang" />
        </section>

        <!-- Part 6: Slot System (Integrated) -->
        <section>
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎁</span> {{ lang === 'zh' ? '插槽系统' : 'Slot System' }}
            <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full ml-2">slot / v-slot</span>
          </h2>
          <LabSlot :lang="lang" />
        </section>

        <!-- Part 7: Lifecycle -->
        <section>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎢</span> {{ t.lab_lifecycle }}
            <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full ml-2">{{ lang === 'zh' ? '组件生命周期' : 'Component Lifecycle' }}</span>
          </h2>
          <LabLifecycle :lang="lang" />
        </section>

        <!-- Next Step Guide -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="max-w-2xl mx-auto text-center">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ lang === 'zh' ? '🎉 恭喜完成 Vue 3 学习！' : '🎉 Congratulations on completing Vue 3!' }}
            </h3>
            <p class="text-gray-500 text-sm mb-6">
              {{ lang === 'zh' ? '来挑战测验，检验你的综合能力吧！' : 'Take the challenge quiz to test your skills!' }}
            </p>
            <button 
              @click="activeTab = 'challenge'"
              class="px-6 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              {{ lang === 'zh' ? '进入挑战赛 🏆' : 'Take the Challenge 🏆' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 7: Challenge -->
      <div v-else-if="activeTab === 'challenge'" class="animate-fade-in">
         <section class="max-w-3xl mx-auto">
           <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2 justify-center">
             <span class="text-2xl">🥷</span> {{ t.lab_quiz }}
           </h2>
           <LabQuizGame :lang="lang" />
        </section>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { I18N } from '../constants';
import LabQuizGame from './LabQuizGame.vue';
import LabReactivity from './LabReactivity.vue';
import LabDirectives from './LabDirectives.vue';
import LabLifecycle from './LabLifecycle.vue';
import LabHtml from './LabHtml.vue';
import LabHtmlBasics from './LabHtmlBasics.vue';
import LabJs from './LabJs.vue';
import LabJsBasics from './LabJsBasics.vue';
import LabCssBasics from './LabCssBasics.vue';
import LabCssLayout from './LabCssLayout.vue';
import LabDom from './LabDom.vue';
import LabAjax from './LabAjax.vue';
import LabVueList from './LabVueList.vue';
import LabPropsEmit from './LabPropsEmit.vue';
import LabClassStyle from './LabClassStyle.vue';
import LabCodeEvolution from './LabCodeEvolution.vue';
import LabTypeScript from './LabTypeScript.vue';
import LabModuleSystem from './LabModuleSystem.vue';
import LabNpm from './LabNpm.vue';
import LabBuildTools from './LabBuildTools.vue';
import LabTailwind from './LabTailwind.vue';
import LabCssFrameworks from './LabCssFrameworks.vue';
import LabEventHandling from './LabEventHandling.vue';
import LabSlot from './LabSlot.vue';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang as 'en' | 'zh']);

const activeTab = ref('foundation');
const labTabStorageKey = computed(() => `lab_active_tab_${props.lang}`);

type LabTab = {
  id: string;
  label: string;
  icon: string;
  stage: number;
  desc: string;
  goal: string;
};

// Learning path stages - progressive learning from basics to advanced
const tabs = computed<LabTab[]>(() => [
  { 
    id: 'foundation', 
    label: props.lang === 'zh' ? '🌐 Web基础' : '🌐 Web Basics', 
    icon: '🌐',
    stage: 1,
    desc: props.lang === 'zh' ? 'HTML/CSS/JS 概念入门' : 'HTML/CSS/JS Intro',
    goal: props.lang === 'zh' ? '理解网页的组成结构' : 'Understand web page structure'
  },
  { 
    id: 'js-basics', 
    label: props.lang === 'zh' ? '🟨 JS基础' : '🟨 JS Basics', 
    icon: '🟨',
    stage: 2,
    desc: props.lang === 'zh' ? '变量/函数/数组/对象' : 'Variables/Functions/Arrays',
    goal: props.lang === 'zh' ? '掌握 JS 核心语法' : 'Master JS core syntax'
  },
  { 
    id: 'css-layout', 
    label: props.lang === 'zh' ? '🎨 CSS布局' : '🎨 CSS Layout', 
    icon: '🎨',
    stage: 3,
    desc: props.lang === 'zh' ? '盒模型/Flex/Grid/响应式' : 'Box Model/Flex/Grid',
    goal: props.lang === 'zh' ? '构建任意页面布局' : 'Build any page layout'
  },
  { 
    id: 'js-advanced', 
    label: props.lang === 'zh' ? '⚡ JS进阶' : '⚡ JS Advanced', 
    icon: '⚡',
    stage: 4,
    desc: props.lang === 'zh' ? 'DOM/异步/TypeScript' : 'DOM/Async/TypeScript',
    goal: props.lang === 'zh' ? '实现复杂交互逻辑' : 'Implement complex interactions'
  },
  { 
    id: 'engineering', 
    label: props.lang === 'zh' ? '🔧 工程化' : '🔧 Engineering', 
    icon: '🔧',
    stage: 5,
    desc: props.lang === 'zh' ? '模块化/NPM/构建/Tailwind' : 'Modules/NPM/Build/Tailwind',
    goal: props.lang === 'zh' ? '专业项目开发流程' : 'Professional dev workflow'
  },
  { 
    id: 'vue', 
    label: props.lang === 'zh' ? '🥝 Vue 3' : '🥝 Vue 3', 
    icon: '🥝',
    stage: 6,
    desc: props.lang === 'zh' ? '响应式/组件/事件/插槽' : 'Reactivity/Components/Events/Slots',
    goal: props.lang === 'zh' ? '构建现代 Web 应用' : 'Build modern web apps'
  },
  { 
    id: 'challenge', 
    label: props.lang === 'zh' ? '🏆 挑战赛' : '🏆 Challenge', 
    icon: '🏆',
    stage: 7,
    desc: props.lang === 'zh' ? '综合测验' : 'Quiz',
    goal: props.lang === 'zh' ? '检验综合能力' : 'Test your skills'
  },
]);

const activeTabInfo = computed<LabTab | undefined>(() => tabs.value.find((tab: LabTab) => tab.id === activeTab.value));
const activeTabIndex = computed(() => tabs.value.findIndex((tab: LabTab) => tab.id === activeTab.value));

onMounted(() => {
  const saved = localStorage.getItem(labTabStorageKey.value);
  if (saved && tabs.value.some((tab: LabTab) => tab.id === saved)) {
    activeTab.value = saved;
  }
});

watch(activeTab, (val: string) => {
  localStorage.setItem(labTabStorageKey.value, val);
});

watch(() => props.lang, () => {
  const saved = localStorage.getItem(labTabStorageKey.value);
  if (saved && tabs.value.some((tab: LabTab) => tab.id === saved)) {
    activeTab.value = saved;
  }
});

// Web Standards State
const standards = reactive({
  html: true,
  css: false,
  js: false
});
</script>