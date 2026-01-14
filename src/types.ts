export interface Asset {
  name: string
  value: string
  type: 'link' | 'file'
}

export interface PackageJsonData {
  name: string
  description: string
  scripts: Record<string, string>
}

export interface GitData {
  branch: string
  changes: number
  remoteUrl?: string // NOVO CAMPO
}

// Adicione a interface de Config
export interface AppConfig {
  rootPath: string
}

export interface PaintOptions {
  folderPath: string
  startDate: string
  endDate: string
  intensity: number
  weekendFactor: number
  minCommits: number
  maxCommits: number
}
// --- BLACK HOLE ---
export interface ScannedFolder {
  path: string
  size: string // ex: "250 MB"
  sizeBytes: number
}

// --- PORT HUNTER ---
export interface PortInfo {
  port: number
  pid: number
  processName: string
}

// --- DOCKER ---
export interface DockerContainer {
  id: string
  name: string
  image: string
  status: string
  state: 'running' | 'exited' | 'paused' | 'unknown'
}

export type DockerAction = 'start' | 'stop' | 'restart'


// --- KANBAN ---
export type KanbanStatus = 'todo' | 'doing' | 'done'

export interface KanbanTask {
  id: string
  text: string
  status: KanbanStatus
  createdAt: string
}

export interface KanbanData {
  tasks: KanbanTask[]
}

// --- ASSET GALLERY ---
export interface AssetFile {
  name: string
  path: string
  relativePath: string
  size: string
  extension: string
}

export interface AssetScanResult {
  success: boolean
  assets: AssetFile[]
  error?: string
}



export type TechStackItem = 
  | 'react' 
  | 'react-native' 
  | 'next' 
  | 'vue' 
  | 'angular' 
  | 'node' 
  | 'adonis' 
  | 'nest' 
  | 'electron' 
  | 'typescript' 
  | 'tailwind' 
  | 'bootstrap' 
  | 'sass' 
  | 'docker' 
  | 'firebase' 
  | 'supabase' 
  | 'mongo' 
  | 'postgres' 
  | 'mysql'
  | 'vite'
  | 'unknown'