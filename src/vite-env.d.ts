/// <reference types="vite/client" />
import type { Asset, PackageJsonData, TechStackItem, ScannedFolder, PortInfo, DockerAction, DockerContainer, TunnelResult, KanbanData, AssetScanResult} from './types'

declare global {
  interface Window {
    electron: {
      getFolders: (path: string) => Promise<{ success: boolean; folders: string[]; error?: string }>;
      openProject: (path: string) => Promise<boolean>;
      getMeta: (path: string) => Promise<{ assets: Asset[], githubUrl?: string }>;
      saveMeta: (data: { folderPath: string, asset: Asset }) => Promise<boolean>;
      deleteMeta: (data: { folderPath: string, assetName: string }) => Promise<boolean>;
      saveGithub: (data: { folderPath: string, url: string }) => Promise<boolean>;
      openAsset: (target: string) => Promise<void>;
      getReadme: (path: string) => Promise<string | null>;
      runCommand: (data: { command: string, cwd: string }) => void;
      onTerminalData: (callback: (data: string) => void) => void;
      offTerminalData: () => void;
      getGitStatus: (path: string) => Promise<{ branch: string, changes: number } | null>;
      getPackageJson: (path: string) => Promise<PackageJsonData | null>;
      getGitStatus: (path: string) => Promise<GitData | null>;
      getNotes: (path: string) => Promise<string>;
      saveNotes: (data: { folderPath: string, content: string }) => Promise<boolean>;
      getConfig: () => Promise<{ rootPath: string }>;
      saveConfig: (config: { rootPath: string }) => Promise<boolean>;
      selectFolder: () => Promise<string | null>;
      getFavorites: () => Promise<string[]>;
      toggleFavorite: (path: string) => Promise<string[]>;
      gitSync: (path: string) => Promise<{ success: boolean; error?: string }>;
      gitCommit: (data: { folderPath: string, message: string }) => Promise<{ success: boolean; error?: string }>;
      getProjectStack: (path: string) => Promise<TechStackItem[]>;
      killProcess: () => Promise<boolean>;
      gitPaint: (opts: PaintOptions) => Promise<{ success: boolean; message?: string; error?: string }>;
      scanNodeModules: (rootPath: string) => Promise<ScannedFolder[]>;
      deleteFolder: (path: string) => Promise<boolean>;
      getPorts: () => Promise<PortInfo[]>;
      getDockerContainers: () => Promise<DockerContainer[]>;
      dockerAction: (data: { id: string, action: DockerAction }) => Promise<boolean>;
      killPort: (pid: number) => Promise<{ success: boolean; error?: string }>;
      gitInit: (folderPath: string) => Promise<boolean>;
      startTunnel: (port: number) => Promise<TunnelResult>;
      stopTunnel: () => Promise<boolean>;
      getPublicIp: () => Promise<string | null>;
      kanbanRead: (path: string) => Promise<KanbanData>;
      kanbanSave: (path: string, data: KanbanData) => Promise<boolean>;
      scanImages: (path: string) => Promise<AssetScanResult>;
      readImageBase64: (path: string) => Promise<string | null>;
      openExplorer: (path: string) => Promise<void>;
      getDrives: () => Promise<string[]>;
      
    };
  }
}

