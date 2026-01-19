<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl max-w-2xl w-full animate-fade-in border border-white/50 dark:border-gray-700 max-h-[85vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          📥 {{ lang === 'zh' ? '批量下载笔记' : 'Batch Download Notes' }}
        </h3>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Filter Tabs -->
      <div class="flex gap-2 mb-4">
        <button 
          @click="downloadFilter = 'all'" 
          class="flex-1 py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-1"
          :class="downloadFilter === 'all' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
        >
          📁 {{ lang === 'zh' ? '全部' : 'All' }}
        </button>
        <button 
          @click="downloadFilter = 'favorites'" 
          class="flex-1 py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-1"
          :class="downloadFilter === 'favorites' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
        >
          ⭐ {{ lang === 'zh' ? '收藏' : 'Favorites' }} ({{ favoritesCount }})
        </button>
        <button 
          @click="downloadFilter = 'tags'" 
          class="flex-1 py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-1"
          :class="downloadFilter === 'tags' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
        >
          🏷️ {{ lang === 'zh' ? '标签' : 'Tags' }}
        </button>
        <button 
          @click="downloadFilter = 'custom'" 
          class="flex-1 py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-1"
          :class="downloadFilter === 'custom' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'"
        >
          ✅ {{ lang === 'zh' ? '自选' : 'Custom' }}
        </button>
      </div>
      
      <!-- Tag Selection (when filter is tags) -->
      <div v-if="downloadFilter === 'tags'" class="mb-4">
        <div class="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl max-h-24 overflow-y-auto">
          <button
            v-for="tag in availableTags"
            :key="tag"
            @click="toggleDownloadTag(tag)"
            class="px-2 py-1 text-xs rounded-full transition-colors"
            :class="selectedDownloadTags.includes(tag) ? 'bg-sakura-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'"
          >
            {{ tag === 'notag' ? (lang === 'zh' ? '无标签' : 'No Tag') : tag }}
          </button>
        </div>
      </div>
      
      <!-- File Tree (for custom selection) -->
      <div class="flex-1 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div class="p-3">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-between">
            <span>
              {{ lang === 'zh' ? '当前语言文件夹' : 'Current Language Folder' }}: 
              <span class="font-bold text-sakura-500">notes/{{ lang }}/</span>
            </span>
            <span class="text-sakura-600 dark:text-sakura-400 font-medium">
              {{ filteredFiles.length }} {{ lang === 'zh' ? '个文件已选' : 'files selected' }}
            </span>
          </div>
          
          <!-- Tree View -->
          <div class="space-y-1">
            <template v-for="node in langFileTree" :key="node.path">
              <DownloadTreeNode 
                :node="node" 
                :depth="0"
                :selected-paths="selectedPaths"
                :show-checkbox="downloadFilter === 'custom'"
                @toggle="toggleNodeSelection"
                @expand="toggleExpand"
                :expanded-paths="expandedPaths"
              />
            </template>
          </div>
        </div>
      </div>
      
      <!-- Download Actions -->
      <div class="flex flex-col gap-3">
        <!-- Row 1: Notes Download -->
        <div class="flex gap-3">
          <button 
            @click="downloadNotes"
            :disabled="isDownloading || filteredFiles.length === 0"
            class="flex-1 py-3 border rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
            :class="isDownloading || filteredFiles.length === 0 
              ? 'border-gray-300 bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'"
          >
            <span v-if="isDownloading" class="animate-spin">⏳</span>
            <span v-else>📦</span>
            {{ isDownloading 
              ? (lang === 'zh' ? '打包中...' : 'Packaging...') 
              : (lang === 'zh' ? `下载 ${filteredFiles.length} 个文件` : `Download ${filteredFiles.length} files`) 
            }}
          </button>
        </div>
        
        <!-- Row 2: Special Downloads -->
        <div class="flex gap-3">
          <button 
            @click="downloadVueNotes"
            :disabled="isDownloading"
            class="flex-1 py-2.5 border rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            :class="{ 'opacity-50 cursor-not-allowed': isDownloading }"
          >
            <span>📚</span>
            {{ lang === 'zh' ? 'VUE笔记' : 'VUE Notes' }}
          </button>
          
          <button 
            @click="downloadSourceCode"
            :disabled="isDownloading"
            class="flex-1 py-2.5 border rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
            :class="{ 'opacity-50 cursor-not-allowed': isDownloading }"
          >
            <span>💻</span>
            {{ lang === 'zh' ? '源码(含笔记)' : 'Source+Notes' }}
          </button>
        </div>
      </div>
      
      <!-- Status Message -->
      <p v-if="downloadMessage" class="mt-3 text-center text-sm" :class="downloadSuccess ? 'text-green-500' : 'text-red-500'">
        {{ downloadMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useArticleStore } from '../stores/articleStore'
import JSZip from 'jszip'
import DownloadTreeNode from './DownloadTreeNode.vue'

const props = defineProps<{
  lang: 'zh' | 'en'
  fileSystem: any[]
  labFolder?: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const articleStore = useArticleStore()

// State
const downloadFilter = ref<'all' | 'favorites' | 'tags' | 'custom'>('all')
const selectedDownloadTags = ref<string[]>([])
const selectedPaths = ref<Set<string>>(new Set())
const expandedPaths = ref<Set<string>>(new Set(['']))
const isDownloading = ref(false)
const downloadMessage = ref('')
const downloadSuccess = ref(false)

// Get available tags (including 'notag' for files without tags)
const availableTags = computed(() => {
  const tags = new Set<string>()
  let hasNoTagFiles = false
  
  const processFiles = (files: any[]) => {
    for (const file of files) {
      if (file.children) {
        processFiles(file.children)
      } else {
        if (file.tags && Array.isArray(file.tags) && file.tags.length > 0) {
          file.tags.forEach((tag: string) => tags.add(tag))
        } else {
          hasNoTagFiles = true
        }
      }
    }
  }
  processFiles(props.fileSystem || [])
  
  const sortedTags = Array.from(tags).sort()
  // Add 'notag' at the beginning if there are files without tags
  if (hasNoTagFiles) {
    return ['notag', ...sortedTags]
  }
  return sortedTags
})

// Get favorites count
const favoritesCount = computed(() => articleStore.favoritesCount)

// Build tree for current language
const langFileTree = computed(() => {
  const langFolder = props.fileSystem?.find(f => f.name === props.lang)
  if (!langFolder?.children) return []
  return langFolder.children
})

// Toggle tag selection
const toggleDownloadTag = (tag: string) => {
  const idx = selectedDownloadTags.value.indexOf(tag)
  if (idx >= 0) {
    selectedDownloadTags.value.splice(idx, 1)
  } else {
    selectedDownloadTags.value.push(tag)
  }
}

// Toggle node selection (for custom mode)
const toggleNodeSelection = (node: any) => {
  if (node.children) {
    // Folder: select/deselect all children
    const allChildPaths = getAllFilePaths(node)
    const allSelected = allChildPaths.every(p => selectedPaths.value.has(p))
    
    if (allSelected) {
      allChildPaths.forEach(p => selectedPaths.value.delete(p))
    } else {
      allChildPaths.forEach(p => selectedPaths.value.add(p))
    }
  } else {
    // File
    if (selectedPaths.value.has(node.path)) {
      selectedPaths.value.delete(node.path)
    } else {
      selectedPaths.value.add(node.path)
    }
  }
  selectedPaths.value = new Set(selectedPaths.value) // Trigger reactivity
}

// Get all file paths in a folder
const getAllFilePaths = (node: any): string[] => {
  if (!node.children) return node.path ? [node.path] : []
  return node.children.flatMap((child: any) => getAllFilePaths(child))
}

// Toggle expand/collapse
const toggleExpand = (path: string) => {
  if (expandedPaths.value.has(path)) {
    expandedPaths.value.delete(path)
  } else {
    expandedPaths.value.add(path)
  }
  expandedPaths.value = new Set(expandedPaths.value)
}

// Get filtered files based on current filter
// Note: file.path in fileSystem does NOT include 'notes/' prefix
// Actual fetch path should be `./notes/${file.path}`
const filteredFiles = computed(() => {
  const result: any[] = []
  
  // Get current language folder (zh or en)
  const langFolder = props.fileSystem?.find(f => f.name === props.lang)
  if (!langFolder?.children) return result
  
  const processFiles = (items: any[], basePath: string = '') => {
    for (const item of items) {
      if (item.children) {
        processFiles(item.children, item.path)
      } else if (item.type === 'file' || item.name?.endsWith('.md')) {
        let include = false
        
        switch (downloadFilter.value) {
          case 'all':
            include = true
            break
          case 'favorites':
            include = articleStore.isFavorite(item.path)
            break
          case 'tags':
            if (selectedDownloadTags.value.length === 0) {
              include = true
            } else {
              const fileTags = item.tags || []
              const hasNoTags = !fileTags || fileTags.length === 0
              include = selectedDownloadTags.value.some(tag => {
                if (tag === 'notag') return hasNoTags
                return fileTags.includes(tag)
              })
            }
            break
          case 'custom':
            include = selectedPaths.value.has(item.path)
            break
        }
        
        if (include) {
          // Calculate relative path from lang folder
          const langPrefix = `${props.lang}/`
          const relativePath = item.path.startsWith(langPrefix) 
            ? item.path.slice(langPrefix.length) 
            : item.path
          result.push({
            ...item,
            relativePath,
            // Fetch path: ./notes/ + original path
            fetchPath: `./notes/${encodeURIComponent(item.path).replace(/%2F/g, '/')}`
          })
        }
      }
    }
  }
  
  processFiles(langFolder.children, props.lang)
  return result
})

// Download notes as zip
const downloadNotes = async () => {
  if (isDownloading.value || filteredFiles.value.length === 0) return
  isDownloading.value = true
  downloadMessage.value = ''
  
  try {
    const zip = new JSZip()
    const files = filteredFiles.value
    let successCount = 0
    
    for (const file of files) {
      try {
        // Use fetchPath which has correct format: ./notes/path
        const fetchUrl = file.fetchPath || `./notes/${encodeURIComponent(file.path).replace(/%2F/g, '/')}`
        
        const res = await fetch(fetchUrl)
        if (res.ok) {
          const content = await res.text()
          zip.file(file.relativePath, content)
          successCount++
        } else {
          console.warn('Failed to fetch file:', fetchUrl, res.status)
        }
      } catch (e) {
        console.error('Failed to fetch file:', file.path, e)
      }
    }
    
    if (successCount === 0) {
      downloadMessage.value = props.lang === 'zh' ? '没有成功获取任何文件' : 'Failed to fetch any files'
      downloadSuccess.value = false
      return
    }
    
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sakura-notes-${props.lang}-${new Date().toISOString().split('T')[0]}.zip`
    a.click()
    URL.revokeObjectURL(url)
    
    downloadMessage.value = `${props.lang === 'zh' ? '下载成功' : 'Download success'}: ${successCount}/${files.length} ${props.lang === 'zh' ? '个文件' : 'files'}`
    downloadSuccess.value = true
  } catch (e) {
    console.error('Download error:', e)
    downloadMessage.value = props.lang === 'zh' ? '下载失败' : 'Download failed'
    downloadSuccess.value = false
  } finally {
    isDownloading.value = false
    setTimeout(() => { downloadMessage.value = '' }, 5000)
  }
}

// Download VUE learning notes
const downloadVueNotes = async () => {
  if (isDownloading.value) return
  isDownloading.value = true
  downloadMessage.value = ''
  
  try {
    const zip = new JSZip()
    
    let vueFiles: any[] = []
    if (props.labFolder?.children) {
      vueFiles = props.labFolder.children.filter((f: any) => f.name.endsWith('.md'))
    } else {
      const findVueFolder = (items: any[]): any[] => {
        for (const item of items) {
          if (item.name.includes('VUE') && item.children) {
            return item.children.filter((f: any) => f.name.endsWith('.md'))
          }
          if (item.children) {
            const found = findVueFolder(item.children)
            if (found.length > 0) return found
          }
        }
        return []
      }
      vueFiles = findVueFolder(props.fileSystem || [])
    }
    
    if (vueFiles.length === 0) {
      downloadMessage.value = props.lang === 'zh' ? '未找到 VUE 学习笔记' : 'VUE notes not found'
      downloadSuccess.value = false
      return
    }
    
    let successCount = 0
    for (const file of vueFiles) {
      try {
        // Correct fetch path: ./notes/ + file.path
        const fetchUrl = `./notes/${encodeURIComponent(file.path).replace(/%2F/g, '/')}`
        
        const res = await fetch(fetchUrl)
        if (res.ok) {
          const content = await res.text()
          zip.file(file.name, content)
          successCount++
        } else {
          console.warn('Failed to fetch VUE note:', fetchUrl, res.status)
        }
      } catch (e) {
        console.error('Failed to fetch VUE note:', file.path, e)
      }
    }
    
    if (successCount === 0) {
      downloadMessage.value = props.lang === 'zh' ? '没有成功获取任何文件' : 'Failed to fetch any files'
      downloadSuccess.value = false
      return
    }
    
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vue-learning-notes-${new Date().toISOString().split('T')[0]}.zip`
    a.click()
    URL.revokeObjectURL(url)
    
    downloadMessage.value = `${props.lang === 'zh' ? '下载成功' : 'Download success'}: ${successCount}/${vueFiles.length} ${props.lang === 'zh' ? '个文件' : 'files'}`
    downloadSuccess.value = true
  } catch (e) {
    console.error('Download error:', e)
    downloadMessage.value = props.lang === 'zh' ? '下载失败' : 'Download failed'
    downloadSuccess.value = false
  } finally {
    isDownloading.value = false
    setTimeout(() => { downloadMessage.value = '' }, 5000)
  }
}

// Source code file list (same as SourceCodeViewer)
const sourceCodeFiles = [
  'index.html', 'index.tsx', 'App.vue', 'constants.ts', 'types.ts', 
  'vite.config.ts', 'package.json', 'tsconfig.json',
  'components/AppHeader.vue', 'components/AppSidebar.vue', 'components/ArticleCard.vue',
  'components/FileTree.vue', 'components/FolderView.vue', 'components/SearchModal.vue',
  'components/SettingsModal.vue', 'components/WriteEditor.vue', 'components/MusicPlayer.vue',
  'components/GiscusComments.vue', 'components/PetalBackground.vue', 'components/WallpaperLayer.vue',
  'components/DownloadModal.vue', 'components/DownloadTreeNode.vue',
  'components/lab/index.ts', 'components/lab/LabDashboard.vue', 
  'components/lab/LabProjectTour.vue', 'components/lab/SourceCodeViewer.vue',
  'components/lab/DualColumnView.vue', 'components/lab/PanelContent.vue',
  'components/lab/SourceFileTree.vue',
  'components/petal/usePetals.ts',
  'composables/index.ts', 'composables/useArticleMeta.ts', 'composables/useBackup.ts',
  'composables/useCodeModal.ts', 'composables/useContentClick.ts', 'composables/useContentRenderer.ts',
  'composables/useFile.ts', 'composables/useGitHubPublish.ts', 'composables/useLightbox.ts',
  'composables/useMarkdown.ts', 'composables/useRawEditor.ts', 'composables/useSearch.ts',
  'composables/useSelectionMenu.ts', 'composables/useWallpapers.ts', 'composables/useTokenSecurity.ts',
  'stores/index.ts', 'stores/appStore.ts', 'stores/articleStore.ts', 
  'stores/learningStore.ts', 'stores/musicStore.ts',
  'scripts/generate-tree.js', 'scripts/generate-raw.js', 
  'scripts/generate-music.js', 'scripts/generate-wallpapers.js'
]

// Download source code with embedded notes
const downloadSourceCode = async () => {
  if (isDownloading.value) return
  isDownloading.value = true
  downloadMessage.value = ''
  
  try {
    const zip = new JSZip()
    let successCount = 0
    
    // Load preset notes for embedding
    let presetNotes: Record<string, Array<{line: number, content: string}>> = {}
    try {
      const baseUrl = (import.meta as any).env?.BASE_URL || './'
      const notesRes = await fetch(`${baseUrl}source-notes-preset.json`)
      if (notesRes.ok) {
        const data = await notesRes.json()
        presetNotes = data.notes || {}
      }
    } catch (e) {
      console.warn('Failed to load preset notes:', e)
    }
    
    // Fetch and process source files
    for (const filePath of sourceCodeFiles) {
      try {
        const baseUrl = (import.meta as any).env?.BASE_URL || './'
        const fetchUrl = `${baseUrl}raw/${filePath}`
        
        const res = await fetch(fetchUrl)
        if (res.ok) {
          let content = await res.text()
          
          // Embed notes as comments if available
          const fileNotes = presetNotes[filePath]
          if (fileNotes && fileNotes.length > 0) {
            const lines = content.split('\n')
            const ext = filePath.split('.').pop()?.toLowerCase()
            const commentStyle = getCommentStyle(ext || '')
            
            // Insert notes from bottom to top to preserve line numbers
            const sortedNotes = [...fileNotes].sort((a, b) => b.line - a.line)
            for (const note of sortedNotes) {
              if (note.line > 0 && note.line <= lines.length && note.content) {
                const commentedNote = formatNoteAsComment(note.content, commentStyle)
                lines.splice(note.line, 0, commentedNote)
              }
            }
            content = lines.join('\n')
          }
          
          zip.file(filePath, content)
          successCount++
        } else {
          console.warn('Failed to fetch source:', fetchUrl, res.status)
        }
      } catch (e) {
        console.error('Failed to fetch source:', filePath, e)
      }
    }
    
    if (successCount === 0) {
      downloadMessage.value = props.lang === 'zh' ? '没有成功获取任何文件' : 'Failed to fetch any files'
      downloadSuccess.value = false
      return
    }
    
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sakura-notes-source-${new Date().toISOString().split('T')[0]}.zip`
    a.click()
    URL.revokeObjectURL(url)
    
    downloadMessage.value = `${props.lang === 'zh' ? '源码下载成功' : 'Source download success'}: ${successCount} ${props.lang === 'zh' ? '个文件' : 'files'}`
    downloadSuccess.value = true
  } catch (e) {
    console.error('Download error:', e)
    downloadMessage.value = props.lang === 'zh' ? '下载失败' : 'Download failed'
    downloadSuccess.value = false
  } finally {
    isDownloading.value = false
    setTimeout(() => { downloadMessage.value = '' }, 5000)
  }
}

// Get comment style based on file extension
const getCommentStyle = (ext: string): { start: string, end: string, line: string } => {
  switch (ext) {
    case 'html':
    case 'vue':
      return { start: '<!-- ', end: ' -->', line: '// ' }
    case 'css':
      return { start: '/* ', end: ' */', line: '// ' }
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
    case 'json':
      return { start: '/* ', end: ' */', line: '// ' }
    default:
      return { start: '# ', end: '', line: '# ' }
  }
}

// Format note content as comment
const formatNoteAsComment = (content: string, style: { start: string, end: string, line: string }): string => {
  const lines = content.split('\n')
  if (lines.length === 1) {
    return `${style.line}📝 [Note] ${content}`
  }
  return lines.map((line, i) => {
    if (i === 0) return `${style.line}📝 [Note] ${line}`
    return `${style.line}    ${line}`
  }).join('\n')
}
</script>
