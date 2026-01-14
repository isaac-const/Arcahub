import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  getFolders: (path: string) => ipcRenderer.invoke('get-folders', path),
  openProject: (path: string) => ipcRenderer.invoke('open-project', path),
  getMeta: (path: string) => ipcRenderer.invoke('get-meta', path),
  saveMeta: (data) => ipcRenderer.invoke('save-meta', data),
  openAsset: (target: string) => ipcRenderer.invoke('open-asset', target),
  getReadme: (path: string) => ipcRenderer.invoke('get-readme', path),
  deleteMeta: (data) => ipcRenderer.invoke('delete-meta', data),
  saveGithub: (data) => ipcRenderer.invoke('save-github', data),
  getPackageJson: (path: string) => ipcRenderer.invoke('get-package-json', path),
  getGitStatus: (path: string) => ipcRenderer.invoke('get-git-status', path),
  getNotes: (path: string) => ipcRenderer.invoke('get-notes', path),
  saveNotes: (data: { folderPath: string, content: string }) => ipcRenderer.invoke('save-notes', data),

  // TERMINAL:
  runCommand: (data: { command: string, cwd: string }) => ipcRenderer.send('run-command', data),
  onTerminalData: (callback: (data: string) => void) => 
    ipcRenderer.on('terminal-data', (_, data) => callback(data)),
  offTerminalData: () => ipcRenderer.removeAllListeners('terminal-data'),

  // CONFIGURAÇÕES:
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config: { rootPath: string }) => ipcRenderer.invoke('save-config', config),
  selectFolder: () => ipcRenderer.invoke('select-folder'),

  // FAVORITOS:
  getFavorites: () => ipcRenderer.invoke('get-favorites'),
  toggleFavorite: (path: string) => ipcRenderer.invoke('toggle-favorite', path),
  
  // GIT:
  gitSync: (path: string) => ipcRenderer.invoke('git-sync', path),
  gitCommit: (data: { folderPath: string, message: string }) => ipcRenderer.invoke('git-commit', data),

  getProjectStack: (path: string) => ipcRenderer.invoke('get-project-stack', path),
  killProcess: () => ipcRenderer.invoke('kill-process'),

  gitPaint: (opts: { 
    folderPath: string; 
    startDate: string; 
    endDate: string; 
    intensity: number; 
    weekendFactor: number; 
    minCommits: number; 
    maxCommits: number 
  }) => ipcRenderer.invoke('git-paint', opts),

  scanNodeModules: (path: string) => ipcRenderer.invoke('scan-node-modules', path),
  deleteFolder: (path: string) => ipcRenderer.invoke('delete-folder', path),
  getPorts: () => ipcRenderer.invoke('get-active-ports'),
  getDockerContainers: () => ipcRenderer.invoke('get-docker-containers'),
  dockerAction: (data: { id: string, action: 'start' | 'stop' | 'restart' }) => ipcRenderer.invoke('docker-action', data),
  killPort: (pid: number) => ipcRenderer.invoke('kill-port', pid),
  gitInit: (folderPath: string) => ipcRenderer.invoke('git-init', folderPath),
  startTunnel: (port: number) => ipcRenderer.invoke('start-tunnel', port),
  stopTunnel: () => ipcRenderer.invoke('stop-tunnel'),
  getPublicIp: () => ipcRenderer.invoke('get-public-ip'),
  kanbanRead: (path: string) => ipcRenderer.invoke('kanban-read', path),
  kanbanSave: (path: string, data: { tasks: unknown[] }) => ipcRenderer.invoke('kanban-save', { projectPath: path, data }),
  scanImages: (path: string) => ipcRenderer.invoke('scan-images', path),
  readImageBase64: (path: string) => ipcRenderer.invoke('read-image-base64', path),
  openExplorer: (path: string) => ipcRenderer.invoke('open-explorer', path),
  getDrives: () => ipcRenderer.invoke('get-drives'),
  gitGetBranches: (folderPath: string) => ipcRenderer.invoke('git-get-branches', folderPath),
  gitCheckout: (folderPath: string, branch: string) => ipcRenderer.invoke('git-checkout', folderPath, branch),
})