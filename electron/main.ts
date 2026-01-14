import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { exec, spawn, ChildProcess } from 'child_process' // Adicionado ChildProcess
import { promisify } from 'util'
import windowStateKeeper from 'electron-window-state'

const execAsync = promisify(exec)

const CONFIG_PATH = path.join(app.getPath('userData'), 'arcahub-config.json')
const FAV_PATH = path.join(app.getPath('userData'), 'arcahub-favorites.json')

let currentProcess: ChildProcess | null = null
let tunnelProcess: ChildProcess | null = null

interface PaintOptions {
  folderPath: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  intensity: number // 0 a 1 (Probabilidade de ter commit)
  weekendFactor: number // 0 a 1 (Redutor para Sab/Dom)
  minCommits: number
  maxCommits: number
}

// AUXILIAR: Calcular tamanho de diretório (Recursivo)
const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  try {
    const files = fs.readdirSync(dirPath)
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file)
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, arrayOfFiles)
      } else {
        arrayOfFiles.push(fullPath)
      }
    })
  } catch(e) { 
    console.error('Error reading directory:', e)
   }
  return arrayOfFiles
}

const getFolderSize = (dirPath: string) => {
  try {
    const files = getAllFiles(dirPath)
    let totalSize = 0
    files.forEach(filePath => {
      try { totalSize += fs.statSync(filePath).size } catch {
        // Ignora erros de arquivos inacessíveis
      }
    })
    return totalSize
  } catch { return 0 }
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

app.disableHardwareAcceleration()

function createWindow() {
  // 1. CARREGAR ESTADO
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  })

  // 2. SPLASH SCREEN (Visível)
  const splash = new BrowserWindow({
    width: 400,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: true,
    icon: path.join(__dirname, '../dist/icon.ico'),
  })
  
  if (process.env.VITE_DEV_SERVER_URL) {
      splash.loadURL(`${process.env.VITE_DEV_SERVER_URL}/splash.html`)
  } else {
      splash.loadFile(path.join(__dirname, '../dist/splash.html'))
  }

  // 3. JANELA PRINCIPAL (Invisível no início)
  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    show: false,
    backgroundColor: '#121212',
    frame: false,
    icon: path.join(__dirname, '../dist/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
        color: '#121212',
        symbolColor: '#e0e0e0',
        height: 31
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // 4. PREPARAR A TROCA
  win.once('ready-to-show', () => {
    
    setTimeout(() => {
        try { splash.destroy() } catch (e) {
            console.error('Erro ao fechar splash screen:', e)
        }

        if (mainWindowState.isMaximized) {
            win.maximize()
        } else {
            win.show()
        }
        
        win.focus()

        mainWindowState.manage(win)

    }, 1500)
  })
}

// --- HANDLERS ---

ipcMain.handle('get-folders', async (_, folderPath: string) => {
  try {
    const dirents = fs.readdirSync(folderPath, { withFileTypes: true })
    const folders = dirents
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    return { success: true, folders }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, error: errorMessage }
  }
})

ipcMain.handle('open-project', async (_, projectPath: string) => {
  exec(`code "${projectPath}"`)
  return true
})

// --- META DADOS (ARCAHUB.JSON) ---

interface MetaData {
  assets: Array<{ name: string; value: string; type: string }>;
  githubUrl?: string;
}

ipcMain.handle('get-meta', async (_, folderPath: string) => {
  const metaPath = path.join(folderPath, 'arcahub.json')
  if (!fs.existsSync(metaPath)) return { assets: [] }
  try {
    const data = fs.readFileSync(metaPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { assets: [] }
  }
})

ipcMain.handle('save-meta', async (_, { folderPath, asset }) => {
  const metaPath = path.join(folderPath, 'arcahub.json')
  let currentData: MetaData = { assets: [] }

  if (fs.existsSync(metaPath)) {
    try {
      currentData = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    } catch { 
      // Arquivo corrompido ou vazio, inicia novo
    }
  }

  currentData.assets.push(asset)
  fs.writeFileSync(metaPath, JSON.stringify(currentData, null, 2))
  return true
})

ipcMain.handle('delete-meta', async (_, { folderPath, assetName }) => {
  const metaPath = path.join(folderPath, 'arcahub.json')
  if (!fs.existsSync(metaPath)) return false

  try {
    const data: MetaData = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    data.assets = data.assets.filter(a => a.name !== assetName)
    fs.writeFileSync(metaPath, JSON.stringify(data, null, 2))
    return true
  } catch {
    return false
  }
})

ipcMain.handle('save-github', async (_, { folderPath, url }) => {
  const metaPath = path.join(folderPath, 'arcahub.json')
  let currentData: MetaData = { assets: [] }

  if (fs.existsSync(metaPath)) {
    try {
      currentData = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    } catch { 
      //Ignora erro
    }
  }

  currentData.githubUrl = url
  fs.writeFileSync(metaPath, JSON.stringify(currentData, null, 2))
  return true
})

ipcMain.handle('open-asset', async (_, target: string) => {
  if (target.startsWith('http')) {
    await shell.openExternal(target)
  } else {
    await shell.openPath(target)
  }
})

ipcMain.handle('get-readme', async (_, folderPath: string) => {
  const candidates = ['README.md', 'readme.md', 'Readme.md', 'README.txt']
  
  for (const file of candidates) {
    const filePath = path.join(folderPath, file)
    if (fs.existsSync(filePath)) {
      try {
        return fs.readFileSync(filePath, 'utf-8')
      } catch {
        continue
      }
    }
  }
  return null
})

// --- TERMINAL & COMANDOS (ATUALIZADO) ---

ipcMain.on('run-command', (event, { command, cwd }) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return

  if (currentProcess) {
    try {
        currentProcess.kill()
    } catch (err) {
        console.error('Erro ao matar processo anterior:', err)
    }
    currentProcess = null
  }

  const shellCmd = process.platform === 'win32' ? 'powershell.exe' : 'bash'
  const shellArgs = process.platform === 'win32' 
    ? [
        '-NoProfile', 
        '-ExecutionPolicy', 'Bypass', 
        '-Command', 
        `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; ${command}`
      ] 
    : ['-c', command]

  try {
    currentProcess = spawn(shellCmd, shellArgs, { 
      cwd, 
      shell: true,
      env: process.env
    })

    currentProcess.stdout?.on('data', (data) => {
      win.webContents.send('terminal-data', data.toString())
    })

    currentProcess.stderr?.on('data', (data) => {
      win.webContents.send('terminal-data', data.toString())
    })

    currentProcess.on('close', (code) => {
      win.webContents.send('terminal-data', `\r\nProcesso finalizado com código ${code}\r\n$ `)
      if (currentProcess && currentProcess.pid === currentProcess.pid) {
          currentProcess = null
      }
    })
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    win.webContents.send('terminal-data', `Erro ao iniciar: ${errorMessage}\r\n`)
  }
})

ipcMain.handle('kill-process', () => {
    if (currentProcess && currentProcess.pid) {
        try {
            if (process.platform === 'win32') {
                exec(`taskkill /pid ${currentProcess.pid} /f /t`)
            } else {
                currentProcess.kill()
            }
            currentProcess = null
            return true
        } catch (error) {
            console.error('Erro ao matar processo:', error)
            return false
        }
    }
    return false
})

// --- DADOS DO PROJETO ---

ipcMain.handle('get-package-json', async (_, folderPath: string) => {
  try {
    const packagePath = path.join(folderPath, 'package.json')
    if (!fs.existsSync(packagePath)) {
      return null
    }

    const content = fs.readFileSync(packagePath, 'utf-8')
    const json = JSON.parse(content)
    
    return {
      name: json.name || path.basename(folderPath),
      description: json.description || '',
      scripts: json.scripts || {}
    }
  } catch (error) {
    console.error('Erro ao ler package.json:', error)
    return null
  }
})

// --- GIT ---

ipcMain.handle('get-git-status', async (_, folderPath: string) => {
  try {
    const gitDir = path.join(folderPath, '.git')
    if (!fs.existsSync(gitDir)) return null

    // Status e Branch
    const { stdout: statusOut } = await execAsync('git status --porcelain -b', { cwd: folderPath })
    const lines = statusOut.split('\n').filter(Boolean)
    const branchLine = lines.find(l => l.startsWith('##')) || '## HEAD'
    const branch = branchLine.replace('## ', '').split('...')[0].trim()
    const changes = lines.length - 1 

    // Remote URL
    let remoteUrl = ''
    try {
      const { stdout: remoteOut } = await execAsync('git config --get remote.origin.url', { cwd: folderPath })
      remoteUrl = remoteOut.trim()
      if (remoteUrl.startsWith('git@')) {
        remoteUrl = remoteUrl.replace(':', '/').replace('git@', 'https://')
      }
    } catch (e) {
      console.error('Erro ao obter URL do remote:', e)
    }

    return { branch, changes: Math.max(0, changes), remoteUrl }
  } catch (error) {
    console.error('Erro ao obter status do Git:', error)
    return null 
  }
})

ipcMain.handle('git-sync', async (_, folderPath: string) => {
  try {
    await execAsync('git pull', { cwd: folderPath })
    await execAsync('git push', { cwd: folderPath })
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, error: errorMessage }
  }
})

ipcMain.handle('git-commit', async (_, { folderPath, message }) => {
  try {
    await execAsync('git add .', { cwd: folderPath })
    await execAsync(`git commit -m "${message}"`, { cwd: folderPath })
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, error: errorMessage }
  }
})

// --- NOTAS ---

ipcMain.handle('get-notes', async (_, folderPath: string) => {
  try {
    const notesPath = path.join(folderPath, '.arcahub.notes')
    if (fs.existsSync(notesPath)) {
      return fs.readFileSync(notesPath, 'utf-8')
    }
    return ''
  } catch { return '' }
})

ipcMain.handle('save-notes', async (_, { folderPath, content }) => {
  try {
    const notesPath = path.join(folderPath, '.arcahub.notes')
    fs.writeFileSync(notesPath, content, 'utf-8')
    return true
  } catch { return false }
})

// --- CONFIGURAÇÃO ---

ipcMain.handle('get-config', async () => {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8')
      return JSON.parse(data)
    }
    return { rootPath: app.getPath('documents') } 
  } catch {
    return { rootPath: app.getPath('documents') }
  }
})

ipcMain.handle('save-config', async (_, config) => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config), 'utf-8')
    return true
  } catch { return false }
})

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (result.canceled) return null
  return result.filePaths[0]
})

// --- FAVORITOS ---

ipcMain.handle('get-favorites', async () => {
  try {
    if (fs.existsSync(FAV_PATH)) {
      return JSON.parse(fs.readFileSync(FAV_PATH, 'utf-8'))
    }
    return []
  } catch { return [] }
})

ipcMain.handle('toggle-favorite', async (_, folderPath: string) => {
  try {
    let favs: string[] = []
    if (fs.existsSync(FAV_PATH)) {
      favs = JSON.parse(fs.readFileSync(FAV_PATH, 'utf-8'))
    }

    if (favs.includes(folderPath)) {
      favs = favs.filter(p => p !== folderPath)
    } else {
      favs.push(folderPath)
    }

    fs.writeFileSync(FAV_PATH, JSON.stringify(favs), 'utf-8')
    return favs
  } catch { return [] }
})

// --- TECH STACK (DETECÇÃO) ---

ipcMain.handle('get-project-stack', async (_, folderPath: string) => {
  const stack: string[] = []
  
  try {
    const packagePath = path.join(folderPath, 'package.json')
    let deps: Record<string, string> = {}
    let devDeps: Record<string, string> = {}

    if (fs.existsSync(packagePath)) {
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
      deps = content.dependencies || {}
      devDeps = content.devDependencies || {}
    }

    const hasDep = (name: string) => !!deps[name] || !!devDeps[name]
    const hasFile = (name: string) => fs.existsSync(path.join(folderPath, name))

    // Frontend
    if (hasDep('react-native')) stack.push('react-native')
    else if (hasDep('next')) stack.push('next')
    else if (hasDep('react')) stack.push('react')
    
    if (hasDep('vue')) stack.push('vue')
    if (hasDep('@angular/core')) stack.push('angular')

    // Backend / Runtime
    if (hasDep('@adonisjs/core')) stack.push('adonis')
    if (hasDep('@nestjs/core')) stack.push('nest')
    if (hasDep('electron')) stack.push('electron')
    
    // Style
    if (hasDep('tailwindcss') || hasFile('tailwind.config.js') || hasFile('tailwind.config.ts')) stack.push('tailwind')
    if (hasDep('bootstrap')) stack.push('bootstrap')
    if (hasDep('sass') || hasDep('node-sass')) stack.push('sass')

    // Tools
    if (hasDep('typescript') || hasFile('tsconfig.json')) stack.push('typescript')
    if (hasDep('vite')) stack.push('vite')
    if (hasFile('Dockerfile') || hasFile('docker-compose.yml')) stack.push('docker')

    // DB / Services
    if (hasDep('firebase') || hasFile('firebase.json')) stack.push('firebase')
    if (hasDep('@supabase/supabase-js')) stack.push('supabase')
    if (hasDep('mongoose') || hasDep('mongodb')) stack.push('mongo')
    if (hasDep('pg') || hasDep('typeorm') || hasDep('prisma')) stack.push('postgres')
    
    return stack
  } catch (error) {
    console.error('Erro ao detectar tech stack:', error)
    return [] 
  }  
})

ipcMain.handle('git-paint', async (_, opts: PaintOptions) => {
  const { folderPath, startDate, endDate, intensity, weekendFactor, minCommits, maxCommits } = opts
  
  // VERIFICAÇÃO MODIFICADA:
  if (!fs.existsSync(path.join(folderPath, '.git'))) {
       return { success: false, error: 'NO_GIT' }
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  end.setDate(end.getDate() + 1)
  
  const loopDate = new Date(start)
  let totalCommits = 0

  try {
    while (loopDate < end) {
      const dayOfWeek = loopDate.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      let chance = intensity
      if (isWeekend) chance *= weekendFactor

      if (Math.random() <= chance) {
        const commitCount = Math.floor(Math.random() * (maxCommits - minCommits + 1)) + minCommits
        
        for (let i = 0; i < commitCount; i++) {
          const dateStr = loopDate.toISOString().split('T')[0]
          const hour = 9 + Math.floor(Math.random() * 9) 
          const minute = Math.floor(Math.random() * 60)
          const seconds = Math.floor(Math.random() * 60)
          
          const gitDate = `${dateStr} ${hour}:${minute}:${seconds}`

          await execAsync(
            `git commit --allow-empty -m "chore: activity log" --date="${gitDate}"`, 
            { cwd: folderPath }
          )
          totalCommits++
        }
      }
      loopDate.setDate(loopDate.getDate() + 1)
    }
    
    return { success: true, message: `Sucesso! ${totalCommits} commits gerados no passado.` }
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return { success: false, error: err }
  }
})

ipcMain.handle('git-init', async (_, folderPath: string) => {
    try {
        await execAsync('git init', { cwd: folderPath })
        return true
    } catch {
        return false
    }
})

// 1. BLACK HOLE (Scanner)
ipcMain.handle('scan-node-modules', async (_, rootPath: string) => {
  const results: { path: string, size: string, sizeBytes: number }[] = []

  // Função recursiva de busca (limitada para não travar tudo)
  const searchDir = (currentPath: string, depth: number) => {
    if (depth > 5) return // Limite de profundidade para performance
    try {
      const items = fs.readdirSync(currentPath, { withFileTypes: true })
      
      for (const item of items) {
        if (item.isDirectory()) {
          const fullPath = path.join(currentPath, item.name)
          
          if (item.name === 'node_modules') {
            const sizeBytes = getFolderSize(fullPath)
            results.push({
              path: fullPath,
              size: formatBytes(sizeBytes),
              sizeBytes
            })
          } else if (!item.name.startsWith('.')) {
            searchDir(fullPath, depth + 1)
          }
        }
      }
    } catch (e) {
    console.error('Error scanning directory:', e)
  }
  }

  try {
    searchDir(rootPath, 0)
    // Ordena do maior para o menor
    return results.sort((a, b) => b.sizeBytes - a.sizeBytes)
  } catch (error) {
    console.error(error)
    return []
  }
})

// 2. BLACK HOLE (Delete)
ipcMain.handle('delete-folder', async (_, folderPath: string) => {
  try {
    // fs.rm com recursive: true deleta pastas não vazias
    await fs.promises.rm(folderPath, { recursive: true, force: true })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
})

// 3. PORT HUNTER
ipcMain.handle('get-active-ports', async () => {
  try {
    const { stdout } = await execAsync('netstat -ano -p tcp')
    const lines = stdout.split('\n')
    const ports: { port: number, pid: number, processName: string }[] = []
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 5 && parts[0].startsWith('TCP')) {
        const localAddr = parts[1]
        const pid = parseInt(parts[parts.length - 1], 10)
        
        if (localAddr.includes(':')) {
            const port = parseInt(localAddr.split(':').pop() || '0', 10)
            if (port > 1024 && pid > 0) {
                 ports.push({ port, pid, processName: `Processo ${pid}` })
            }
        }
      }
    }
    
    // Remove duplicatas
    const uniquePorts = ports.filter((v,i,a)=>a.findIndex(t=>(t.port===v.port && t.pid===v.pid))===i)
    return uniquePorts.sort((a, b) => a.port - b.port)

  } catch (error) {
    console.error('Erro ao obter portas ativas:', error)
    return []
  }
})
ipcMain.handle('kill-port', async (_, pid: number) => {
    try {
        // Tenta matar forçado (/F)
        await execAsync(`taskkill /F /PID ${pid}`)
        return { success: true }
    } catch (error) {
        // Se der erro (ex: precisa de Admin), retorna o erro
        const msg = error instanceof Error ? error.message : String(error)
        return { success: false, error: msg }
    }
})
// 4. DOCKER (Listar)
ipcMain.handle('get-docker-containers', async () => {
  try {
    // Formata saída como JSON para facilitar parse
    const { stdout } = await execAsync('docker ps -a --format "{{json .}}"')
    const lines = stdout.trim().split('\n')
    
    const containers = lines.map(line => {
        if (!line) return null
        try {
            const c = JSON.parse(line)
            // Normaliza dados
            const state = c.State || c.Status || 'unknown'
          
            let simpleState = 'unknown'
            if (c.State === 'running' || (typeof c.Status === 'string' && c.Status.includes('Up'))) simpleState = 'running'
            else if (c.State === 'exited' || (typeof c.Status === 'string' && c.Status.includes('Exited'))) simpleState = 'exited'
            
            if (state) {
              //
            }

            return {
                id: c.ID,
                name: c.Names,
                image: c.Image,
                status: c.Status, // Texto completo ex: "Up 2 hours"
                state: simpleState
            }
        } catch { return null }
    }).filter(Boolean)

    return containers
  } catch {
    return [] 
  }
})

// 5. DOCKER (Ações)
ipcMain.handle('docker-action', async (_, { id, action }) => {
    try {
        if (!['start', 'stop', 'restart'].includes(action)) return false
        await execAsync(`docker ${action} ${id}`)
        return true
    } catch {
        return false
    }
})

ipcMain.handle('stop-tunnel', async () => {
  if (tunnelProcess) {
    if (process.platform === 'win32') {
        // No Windows, spawn com shell:true cria sub-processos que .kill() n mata direito
        // Precisamos matar a árvore (tree kill)
        try {
            if (tunnelProcess.pid) exec(`taskkill /pid ${tunnelProcess.pid} /t /f`)
        } catch(e) { console.error(e) }
    } else {
        tunnelProcess.kill()
    }
    tunnelProcess = null
    return true
  }
  return false
})

ipcMain.handle('get-public-ip', async () => {
  try {
    // O fetch nativo do Node.js não sofre com CORS
    const response = await fetch('https://loca.lt/mytunnelpassword')
    const ip = await response.text()
    return ip.trim()
  } catch (error) {
    console.error('Erro ao buscar IP:', error)
    return null
  }
})
// --- KANBAN HANDLERS ---
ipcMain.handle('kanban-read', async (_, projectPath: string) => {
  const todoPath = path.join(projectPath, 'todo.json')
  if (!fs.existsSync(todoPath)) return { tasks: [] }
  try {
    const data = await fs.promises.readFile(todoPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { tasks: [] }
  }
})

ipcMain.handle('kanban-save', async (_, { projectPath, data }: { projectPath: string, data: { tasks: unknown[] } }) => {
  const todoPath = path.join(projectPath, 'todo.json')
  try {
    await fs.promises.writeFile(todoPath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch {
    return false
  }
})

// --- ASSET GALLERY HANDLERS ---
ipcMain.handle('scan-images', async (_, rootPath: string) => {
  const extensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico']
  const results: Array<{
    name: string
    path: string
    relativePath: string
    size: string
    extension: string
  }> = []

  // Função recursiva simples
  const searchImages = (dir: string, depth: number) => {
    if (depth > 5) return // Limite de profundidade
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true })
      for (const file of files) {
        const fullPath = path.join(dir, file.name)
        
        if (file.isDirectory()) {
          if (file.name !== 'node_modules' && file.name !== '.git' && file.name !== 'dist' && file.name !== 'build') {
            searchImages(fullPath, depth + 1)
          }
        } else {
          const ext = path.extname(file.name).toLowerCase()
          if (extensions.includes(ext)) {
            const stats = fs.statSync(fullPath)
            const relative = path.relative(rootPath, fullPath).replace(/\\/g, '/')
            
            results.push({
              name: file.name,
              path: fullPath,
              relativePath: `./${relative}`,
              size: formatBytes(stats.size),
              extension: ext
            })
          }
        }
      }
    } catch {
      // 
    }
  }

  try {
    searchImages(rootPath, 0)
    return { success: true, assets: results }
  } catch (e) {
    return { success: false, assets: [], error: String(e) }
  }
})

// Handler para ler a imagem e mandar pro frontend exibir
ipcMain.handle('read-image-base64', async (_, filePath: string) => {
  try {
    const bitmap = await fs.promises.readFile(filePath)
    return bitmap.toString('base64')
  } catch {
    return null
  }
})

ipcMain.handle('open-explorer', async (_, folderPath: string) => {
  await shell.openPath(folderPath)
})

ipcMain.handle('get-drives', async () => {
  return new Promise((resolve) => {
    // Comando nativo do Windows para listar discos
    exec('wmic logicaldisk get name', (error, stdout) => {
      if (error) return resolve([])
      
      const drives = stdout.split('\r\r\n')
        .filter(value => /[A-Za-z]:/.test(value))
        .map(value => value.trim() + '/')
        
      resolve(drives)
    })
  })
})


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})