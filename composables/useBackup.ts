import { ref } from 'vue'

export interface BackupFile {
  name: string
  path: string
  sha: string
  size: number
  download_url: string
  created_at?: string
}

export interface BackupResult {
  success: boolean
  message: string
  filename?: string
}

// localStorage 中不需要备份的 key（敏感信息或临时数据）
const EXCLUDED_KEYS = [
  'github_pat',  // GitHub token 不备份
]

export function useBackup() {
  const isBackingUp = ref(false)
  const isRestoring = ref(false)
  const backupError = ref('')
  const backupList = ref<BackupFile[]>([])
  
  const getToken = (): string | null => {
    return localStorage.getItem('github_pat')
  }
  
  /**
   * 收集需要备份的 localStorage 数据
   */
  const collectBackupData = (): Record<string, any> => {
    const data: Record<string, any> = {}
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && !EXCLUDED_KEYS.includes(key)) {
        try {
          const value = localStorage.getItem(key)
          if (value) {
            // 尝试解析 JSON
            try {
              data[key] = JSON.parse(value)
            } catch {
              // 如果不是 JSON，保存原始字符串
              data[key] = value
            }
          }
        } catch (e) {
          console.warn(`Failed to read localStorage key: ${key}`, e)
        }
      }
    }
    
    return data
  }
  
  /**
   * 生成备份文件名
   */
  const generateBackupFilename = (authorName: string): string => {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .slice(0, 19)
    const safeName = authorName.replace(/[^\w\u4e00-\u9fa5]/g, '_') || 'anonymous'
    return `${safeName}_${timestamp}.json`
  }
  
  /**
   * 确保 backup 分支存在，如果不存在则创建
   */
  const ensureBackupBranch = async (
    owner: string,
    repo: string,
    token: string
  ): Promise<boolean> => {
    try {
      // 检查 backup 分支是否存在
      const branchResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/branches/backup`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (branchResponse.ok) {
        return true // 分支已存在
      }
      
      // 获取 main 分支的最新 commit SHA
      const mainResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (!mainResponse.ok) {
        // 尝试 master 分支
        const masterResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/master`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json'
            }
          }
        )
        
        if (!masterResponse.ok) {
          throw new Error('Cannot find main or master branch')
        }
        
        const masterData = await masterResponse.json()
        const sha = masterData.object.sha
        
        // 创建 backup 分支
        const createResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/refs`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ref: 'refs/heads/backup',
              sha: sha
            })
          }
        )
        
        return createResponse.ok
      }
      
      const mainData = await mainResponse.json()
      const sha = mainData.object.sha
      
      // 创建 backup 分支
      const createResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ref: 'refs/heads/backup',
            sha: sha
          })
        }
      )
      
      return createResponse.ok
    } catch (e) {
      console.error('Failed to ensure backup branch:', e)
      return false
    }
  }
  
  /**
   * 备份 localStorage 到 GitHub backup 分支
   */
  const backupToGitHub = async (
    owner: string,
    repo: string,
    authorName: string
  ): Promise<BackupResult> => {
    const token = getToken()
    if (!token) {
      return { success: false, message: '请先设置 GitHub Token' }
    }
    
    isBackingUp.value = true
    backupError.value = ''
    
    try {
      // 确保 backup 分支存在
      const branchReady = await ensureBackupBranch(owner, repo, token)
      if (!branchReady) {
        throw new Error('无法创建或访问 backup 分支')
      }
      
      // 收集备份数据
      const backupData = collectBackupData()
      const filename = generateBackupFilename(authorName)
      const path = `backups/${filename}`
      
      // 添加元数据
      const fullBackupData = {
        _meta: {
          author: authorName,
          timestamp: new Date().toISOString(),
          version: '1.0',
          note: '此备份不包含 GitHub Token，恢复后需要重新设置'
        },
        data: backupData
      }
      
      const content = JSON.stringify(fullBackupData, null, 2)
      
      // 上传到 GitHub
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Backup: ${authorName} - ${new Date().toLocaleString('zh-CN')}`,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: 'backup'
          })
        }
      )
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '备份上传失败')
      }
      
      return {
        success: true,
        message: '备份成功！注意：GitHub Token 未包含在备份中',
        filename
      }
    } catch (e: any) {
      backupError.value = e.message
      return {
        success: false,
        message: e.message || '备份失败'
      }
    } finally {
      isBackingUp.value = false
    }
  }
  
  /**
   * 获取备份文件列表
   */
  const listBackups = async (
    owner: string,
    repo: string
  ): Promise<BackupFile[]> => {
    const token = getToken()
    if (!token) {
      return []
    }
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/backups?ref=backup`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (!response.ok) {
        if (response.status === 404) {
          return [] // 备份文件夹不存在
        }
        throw new Error('获取备份列表失败')
      }
      
      const files = await response.json()
      
      if (!Array.isArray(files)) {
        return []
      }
      
      // 过滤只保留 .json 文件，并按名称排序（时间降序）
      backupList.value = files
        .filter((f: any) => f.name.endsWith('.json'))
        .map((f: any) => ({
          name: f.name,
          path: f.path,
          sha: f.sha,
          size: f.size,
          download_url: f.download_url
        }))
        .sort((a: BackupFile, b: BackupFile) => b.name.localeCompare(a.name))
      
      return backupList.value
    } catch (e) {
      console.error('Failed to list backups:', e)
      return []
    }
  }
  
  /**
   * 从 GitHub 恢复备份
   */
  const restoreFromGitHub = async (
    owner: string,
    repo: string,
    filename: string
  ): Promise<BackupResult> => {
    const token = getToken()
    if (!token) {
      return { success: false, message: '请先设置 GitHub Token' }
    }
    
    isRestoring.value = true
    backupError.value = ''
    
    try {
      // 获取备份文件内容
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/backups/${filename}?ref=backup`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('备份文件不存在或无法访问')
      }
      
      const fileData = await response.json()
      
      // 解码 Base64 内容
      const content = decodeURIComponent(escape(atob(fileData.content)))
      const backupData = JSON.parse(content)
      
      if (!backupData.data) {
        throw new Error('备份文件格式不正确')
      }
      
      // 恢复数据到 localStorage
      const data = backupData.data
      let restoredCount = 0
      
      for (const [key, value] of Object.entries(data)) {
        if (!EXCLUDED_KEYS.includes(key)) {
          try {
            if (typeof value === 'string') {
              localStorage.setItem(key, value)
            } else {
              localStorage.setItem(key, JSON.stringify(value))
            }
            restoredCount++
          } catch (e) {
            console.warn(`Failed to restore key: ${key}`, e)
          }
        }
      }
      
      return {
        success: true,
        message: `恢复成功！已恢复 ${restoredCount} 项设置。刷新页面以应用更改。`,
        filename
      }
    } catch (e: any) {
      backupError.value = e.message
      return {
        success: false,
        message: e.message || '恢复失败'
      }
    } finally {
      isRestoring.value = false
    }
  }
  
  /**
   * 删除指定的备份文件
   */
  const deleteBackup = async (
    owner: string,
    repo: string,
    filename: string,
    sha: string
  ): Promise<BackupResult> => {
    const token = getToken()
    if (!token) {
      return { success: false, message: '请先设置 GitHub Token' }
    }
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/backups/${filename}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Delete backup: ${filename}`,
            sha: sha,
            branch: 'backup'
          })
        }
      )
      
      if (!response.ok) {
        throw new Error('删除失败')
      }
      
      return {
        success: true,
        message: '备份已删除'
      }
    } catch (e: any) {
      return {
        success: false,
        message: e.message || '删除失败'
      }
    }
  }
  
  /**
   * 解析备份文件名获取信息
   */
  const parseBackupFilename = (filename: string): { author: string; date: string } => {
    // 格式: authorName_YYYY-MM-DD_HH-MM-SS.json
    const match = filename.match(/^(.+)_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})\.json$/)
    if (match) {
      return {
        author: match[1],
        date: `${match[2]} ${match[3].replace(/-/g, ':')}`
      }
    }
    return {
      author: '未知',
      date: filename
    }
  }
  
  return {
    isBackingUp,
    isRestoring,
    backupError,
    backupList,
    backupToGitHub,
    listBackups,
    restoreFromGitHub,
    deleteBackup,
    parseBackupFilename,
    collectBackupData
  }
}
