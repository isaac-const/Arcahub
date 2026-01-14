import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  VscFiles, VscListSelection, VscFileMedia, 
  VscFolder, VscFileCode, VscRefresh, VscFolderOpened 
} from 'react-icons/vsc'
import type { ElementType } from 'react'

import { HeroCard } from './HeroCard'
import { GitStatusCard } from './GitStatusCard'
import { ScriptsCard } from './ScriptsCard'
import { GithubCard } from './GithubCard'
import { ReadmeViewer } from './ReadmeViewer'
import { KanbanBoard } from './project/KanbanBoard'
import { AssetGallery } from './project/AssetGallery'

import type { PackageJsonData, GitData, TechStackItem } from '../types'

interface Props {
  path: string
  folders: string[]
  packageData: PackageJsonData | null
  gitData: GitData | null
  stack: TechStackItem[]
  readme: string | null
  githubUrl: string
  isTerminalOpen: boolean
  favorites: string[]
  onOpenCode: () => void
  onRunScript: (script: string) => void
  onToggleTerminal: () => void
  onToggleFavorite: () => void
  onSaveGithub: (url: string) => void
  onNavigate: (folder: string) => void
  onSyncGit: () => Promise<void>
  onCommitGit: (msg: string) => Promise<void>
  onRefresh: () => void 
}

export function ProjectDashboard({
  path, folders, packageData, gitData, stack, readme, githubUrl,
  isTerminalOpen, favorites, 
  onOpenCode, onRunScript, onToggleTerminal, onToggleFavorite, 
  onSaveGithub, onNavigate, onSyncGit, onCommitGit, onRefresh
}: Props) {
  
  const [activeTab, setActiveTab] = useState<'files' | 'kanban' | 'assets'>('files')

  const handleOpenExplorer = () => {
    window.electron.openExplorer(path)
  }

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
        {/* --- HEADER --- */}
        <div className="app-header" style={{ 
            padding: '0 20px', 
            borderBottom: '1px solid #333', 
            height: '50px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexShrink: 0,
            WebkitAppRegion: 'drag' 
        } as React.CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                <div style={{ fontWeight: 'bold', color: '#e0e0e0', fontSize: '14px' }}>
                    {path.split(/[/\\]/).pop()}
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                    <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: '#252526' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onRefresh}
                        title="Atualizar dados"
                        style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex' }}
                    >
                        <VscRefresh size={16} />
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: '#252526' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleOpenExplorer}
                        title="Abrir no Explorer"
                        style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex' }}
                    >
                        <VscFolderOpened size={16} />
                    </motion.button>
                </div>
            </div>

            <div style={{ display: 'flex', background: '#121212', padding: 3, borderRadius: 6, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                <TabButton 
                    label="Visão Geral" icon={VscFiles} 
                    active={activeTab === 'files'} onClick={() => setActiveTab('files')} 
                />
                <TabButton 
                    label="Kanban" icon={VscListSelection} 
                    active={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} 
                />
                <TabButton 
                    label="Assets" icon={VscFileMedia} 
                    active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} 
                />
            </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
            {activeTab === 'files' && (
                <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
                        <div style={{ gridColumn: 'span 12' }}>
                            <HeroCard 
                                path={path} packageData={packageData} stack={stack}
                                onOpenCode={onOpenCode} onRunScript={onRunScript}
                                onToggleTerminal={onToggleTerminal} isTerminalOpen={isTerminalOpen}
                                isFavorite={favorites.includes(path)} onToggleFavorite={onToggleFavorite}
                            />
                        </div>

                        {gitData && (
                            <div style={{ gridColumn: 'span 4' }}>
                                <GitStatusCard 
                                    branch={gitData.branch} changes={gitData.changes}
                                    onSync={onSyncGit} onCommit={onCommitGit}
                                />
                            </div>
                        )}

                        <div style={{ gridColumn: gitData ? 'span 8' : 'span 12' }}>
                            {packageData?.scripts && Object.keys(packageData.scripts).length > 0 ? (
                                <ScriptsCard scripts={packageData.scripts} onRun={onRunScript} />
                            ) : (
                                <div style={{ padding: 30, background: '#1e1e1e', borderRadius: 16, border: '1px solid #333', color: '#666', textAlign: 'center', height: '100%' }}>
                                    Nenhum script npm encontrado.
                                </div>
                            )}
                        </div>

                        <div style={{ gridColumn: 'span 12', background: '#1e1e1e', border: '1px solid #333', borderRadius: 16, padding: 20 }}>
                            <h3 style={{marginTop:0, color:'#888', fontSize:'12px', marginBottom:15, textTransform:'uppercase'}}>Arquivos e Pastas</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
                                {folders.map(file => (
                                    <motion.div 
                                        key={file} 
                                        whileHover={{ scale: 1.05, backgroundColor: '#252526', y: -2 }}
                                        onClick={() => onNavigate(file)} 
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: 10, borderRadius: 6, transition: '0.2s' }}
                                    >
                                        {file.includes('.') ? <VscFileCode size={32} color="#ccc"/> : <VscFolder size={32} color="#007acc"/>}
                                        <span style={{ fontSize: '11px', color: '#ccc', marginTop: 5, textAlign:'center', wordBreak:'break-all' }}>{file}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div style={{ gridColumn: 'span 12' }}>
                            <GithubCard url={githubUrl || gitData?.remoteUrl || ''} onSave={onSaveGithub} onOpen={(url) => window.electron.openAsset(url)} />
                        </div>
                        <div style={{ gridColumn: 'span 12' }}>
                            <ReadmeViewer content={readme} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'kanban' && (
                <div style={{ height: '100%', padding: '20px' }}>
                    <KanbanBoard projectPath={path} />
                </div>
            )}

            {activeTab === 'assets' && (
                <div style={{ height: '100%', padding: '20px' }}>
                    <AssetGallery projectPath={path} />
                </div>
            )}
        </div>
    </motion.div>
  )
}

interface TabButtonProps {
    label: string
    icon: ElementType
    active: boolean
    onClick: () => void
}

const TabButton = ({ label, icon: Icon, active, onClick }: TabButtonProps) => (
    <motion.button 
        whileHover={{ backgroundColor: active ? '#333' : '#1e1e1e' }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{ 
            background: active ? '#333' : 'transparent', 
            color: active ? '#fff' : '#666', 
            border: 'none', padding: '6px 12px', borderRadius: 4, 
            cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 6, transition: '0.1s'
        }}
    >
        <Icon /> {label}
    </motion.button>
)