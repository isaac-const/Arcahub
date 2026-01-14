import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { AnimatePresence, motion } from 'framer-motion'

// --- COMPONENTES ---
import { Sidebar } from './components/Sidebar'
import { TerminalPanel } from './components/TerminalPanel'
import { RightPanel } from './components/RightPanel'
import { HomeScreen } from './components/HomeScreen'
import { ProjectDashboard } from './components/ProjectDashboard'
import { DevToolsModal } from './components/DevToolsModal'

// --- UTILS E TIPOS ---
import { smartUrl } from './utils/formatters'
import type { Asset, PackageJsonData, GitData, TechStackItem } from './types'
import { VscChromeClose, VscChevronUp, VscTerminal, VscFolderOpened } from 'react-icons/vsc'

function App() {
  // --- GLOBAL STATE ---
  const [rootPath, setRootPath] = useState('')
  const [path, setPath] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  
  // --- PROJECT DATA ---
  const [folders, setFolders] = useState<string[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [githubUrl, setGithubUrl] = useState('')
  const [readme, setReadme] = useState<string | null>(null)
  const [packageData, setPackageData] = useState<PackageJsonData | null>(null)
  const [gitData, setGitData] = useState<GitData | null>(null)
  const [notes, setNotes] = useState('')
  const [stack, setStack] = useState<TechStackItem[]>([])

  // --- UI STATE ---
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [terminalHeight, setTerminalHeight] = useState(300)
  const [isDragging, setIsDragging] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDevTools, setShowDevTools] = useState(false)

  const normalizePath = (p: string) => p.replace(/\\/g, '/')

  // 1. INIT
  useEffect(() => {
    const init = async () => {
      const config = await window.electron.getConfig()
      const favs = await window.electron.getFavorites()
      const initialPath = normalizePath(config.rootPath)
      setRootPath(initialPath)
      setPath(initialPath)
      setFavorites(favs)
    }
    init()
  }, [])

  // 2. SHORTCUTS
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault()
            setShowDevTools(prev => !prev)
        }
    }
    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [])

  // 3. DATA FETCHING
  const refreshData = useCallback(async (currentPath: string) => {
    if (!currentPath) return
    try {
      const [resMeta, resReadme, resPackage, resGit, resNotes, resStack] = await Promise.all([
        window.electron.getMeta(currentPath),
        window.electron.getReadme(currentPath),
        window.electron.getPackageJson(currentPath),
        window.electron.getGitStatus(currentPath),
        window.electron.getNotes(currentPath),
        window.electron.getProjectStack(currentPath),
      ])

      setAssets(resMeta.assets || [])
      setGithubUrl(resMeta.githubUrl || '')
      setReadme(resReadme)
      setPackageData(resPackage)
      setGitData(resGit)
      setNotes(resNotes)
      setStack(resStack)
    } catch (e) { console.error(e) }
  }, [])

  // 4. WATCH PATH CHANGES
  useEffect(() => {
    if (path === '') {
        const loadDrives = async () => {
            const drives = await window.electron.getDrives()
            setFolders(drives)
            setReadme(null)
            setPackageData(null)
            setGitData(null)
        }
        loadDrives()
        return
    }

    const loadContent = async () => {
      setFolders([])
      const resFolders = await window.electron.getFolders(path)
      if (resFolders.success) setFolders(resFolders.folders)
      if (path !== rootPath) refreshData(path)
    }
    loadContent()
  }, [path, rootPath, refreshData])

  // --- HANDLERS ---
  const handleNavigate = (folder: string) => {
    if (path === '') {
        setPath(normalizePath(folder))
        return
    }

    const nextPath = (folder.includes('/') || folder.includes('\\')) 
        ? normalizePath(folder)
        : normalizePath(`${path}/${folder}`).replace(/\/\//g, '/')
    setPath(nextPath)
  }

  const handleBack = () => {
    const cleanPath = normalizePath(path)
    
    if (cleanPath.match(/^[a-zA-Z]:\/$/)) {
        setPath('') // Vazio = "Meu Computador"
        return
    }

    if (cleanPath === '') return

    const lastSlashIndex = cleanPath.lastIndexOf('/')
    if (lastSlashIndex >= 0) {
      let parent = cleanPath.substring(0, lastSlashIndex)
      if (parent.length === 2 && parent[1] === ':') parent += '/'
      if (parent === '') parent = '/' 
      
      setPath(parent)
    }
  }

  const handleGitAction = async (type: 'sync' | 'commit', msg?: string) => {
    let res
    if (type === 'sync') res = await window.electron.gitSync(path)
    else res = await window.electron.gitCommit({ folderPath: path, message: msg || '' })
    
    if (res.success) {
      if (type === 'sync') alert('Sincronizado!')
      refreshData(path)
    } else {
      alert(`Erro: ${res.error}`)
    }
  }

  const handleRunScript = (scriptName: string) => {
    if (!isTerminalOpen) setIsTerminalOpen(true)
    setTimeout(() => {
        window.electron.runCommand({ command: `npm run ${scriptName}`, cwd: path })
    }, 100)
  }

  const handleChangeRoot = async () => {
    const newPath = await window.electron.selectFolder()
    if (newPath) {
      const normalized = normalizePath(newPath)
      setRootPath(normalized)
      setPath(normalized)
      await window.electron.saveConfig({ rootPath: normalized })
      setShowSettings(false)
    }
  }

  // --- TERMINAL RESIZE ---
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newHeight = window.innerHeight - e.clientY - 20 
    if (newHeight > 100 && newHeight < window.innerHeight - 100) setTerminalHeight(newHeight)
  }, [])
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    document.body.style.cursor = 'default'
    document.body.style.userSelect = 'auto'
  }, [])
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'row-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp) }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // --- RENDER ---
  if (!rootPath) return <div style={{ background: '#121212', height: '100vh' }} />
  const isHome = path === rootPath

  return (
    // MUDANÇA 1: Flex column para acomodar a barra de título
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#121212' }}>
      
      {/* --- NOVA BARRA DE TÍTULO (Title Bar) --- */}
      <div style={{
          height: '32px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#121212',
          borderBottom: '1px solid #333', 
          WebkitAppRegion: 'drag', 
          userSelect: 'none',
          fontSize: '12px',
          color: '#666',
          flexShrink: 0
      } as React.CSSProperties}>
          <span>Arcahub</span>
      </div>

      {/* --- CONTEÚDO DO APP (Abaixo da barra) --- */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        
        {/* 1. SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
           <Sidebar 
             path={path} folders={folders} favorites={favorites}
             onNavigate={handleNavigate} onBack={handleBack} 
             onToggleFavorite={async (p) => setFavorites(await window.electron.toggleFavorite(p))}
             onGoHome={() => setPath(rootPath)}
             onOpenDevTools={() => setShowDevTools(true)}
             onOpenSettings={() => setShowSettings(true)}
           />
        </div>

        {/* 2. MAIN AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderRight: '1px solid #333', position: 'relative' }}>
          
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <AnimatePresence mode="wait">
                  {isHome ? (
                      <motion.div key="home" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.2}} style={{height:'100%'}}>
                          <div style={{overflowY:'auto', height:'100%', padding:'30px'}}>
                              <HomeScreen 
                                  favorites={favorites} onNavigate={handleNavigate} 
                                  onUnfavorite={async (p) => setFavorites(await window.electron.toggleFavorite(p))} 
                              />
                          </div>
                      </motion.div>
                  ) : (
                      <ProjectDashboard 
                        path={path} 
                        folders={folders} 
                        packageData={packageData} 
                        gitData={gitData} 
                        stack={stack} 
                        readme={readme} 
                        githubUrl={githubUrl}
                        isTerminalOpen={isTerminalOpen} 
                        favorites={favorites}
                        
                        onOpenCode={() => window.electron.openProject(path)}
                        onRunScript={handleRunScript}
                        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
                        onToggleFavorite={async () => setFavorites(await window.electron.toggleFavorite(path))}
                        onSaveGithub={async (url) => { await window.electron.saveGithub({folderPath:path, url}); setGithubUrl(url) }}
                        onNavigate={handleNavigate}
                        onSyncGit={() => handleGitAction('sync')}
                        onCommitGit={(msg) => handleGitAction('commit', msg)}
                        onRefresh={() => handleNavigate(path)} 
                      />
                  )}
              </AnimatePresence>
          </div>

          {/* TERMINAL FOOTER */}
          {!isHome && (
              <>
                  {!isTerminalOpen && (
                      <button onClick={() => setIsTerminalOpen(true)} style={{ position: 'absolute', bottom: 25, right: 25, background: 'rgba(30, 30, 30, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid #444', borderRadius: '8px', padding: '10px 16px', color: '#e0e0e0', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <VscTerminal color="#61dafb" /> Abrir Terminal
                      </button>
                  )}
                  {isTerminalOpen && (
                    <div style={{ borderTop: '1px solid #333', background: '#000' }}>
                      <div onMouseDown={() => setIsDragging(true)} style={{ height: '4px', background: '#252526', cursor: 'row-resize', borderTop: '1px solid #333' }} onMouseEnter={e => e.currentTarget.style.background = '#007acc'} onMouseLeave={e => e.currentTarget.style.background = '#252526'} />
                      <div style={{ height: `${terminalHeight}px`, position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 5, right: 15, zIndex: 20, display: 'flex', gap: 10 }}>
                              <button onClick={() => setTerminalHeight(500)} title="Expandir" style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}><VscChevronUp/></button>
                              <button onClick={() => setIsTerminalOpen(false)} title="Fechar" style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}><VscChromeClose/></button>
                          </div>
                          <TerminalPanel cwd={path} />
                      </div>
                    </div>
                  )}
              </>
          )}
        </div>

        {/* 3. RIGHT PANEL */}
        {!isHome && (
            <RightPanel 
              assets={assets} notes={notes} 
              onAdd={async (n, v) => {
                  let final = v; if(v.includes('.') && !v.match(/^[a-zA-Z]:/)) final = smartUrl(v);
                  await window.electron.saveMeta({folderPath:path, asset:{name:n, value:final, type:final.startsWith('http')?'link':'file'}}); refreshData(path)
              }} 
              onDelete={async (n) => { if(confirm(`Del ${n}?`)) { await window.electron.deleteMeta({folderPath:path, assetName:n}); refreshData(path) } }} 
              onOpen={(val) => window.electron.openAsset(val)} 
              onSaveNotes={async (c) => { await window.electron.saveNotes({folderPath:path, content:c}); setNotes(c) }} 
            />
        )}

      </div>

      {/* MODAL SETTINGS */}
      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '500px', background: '#1e1e1e', border: '1px solid #333', borderRadius: '16px', padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Configurações</h2>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 10, color: '#888', fontSize: '14px' }}>Pasta Raiz</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <input value={rootPath} readOnly style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#252526', color: '#ccc' }} />
                        <button onClick={handleChangeRoot} style={{ padding: '0 15px', background: '#007acc', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}><VscFolderOpened /> Alterar</button>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button onClick={() => setShowSettings(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #444', borderRadius: '6px', color: '#ccc', cursor: 'pointer' }}>Fechar</button></div>
            </div>
        </div>
      )}

      {/* MODAL DEV TOOLS */}
      {showDevTools && <DevToolsModal onClose={() => setShowDevTools(false)} />}
    </div>
  )
}

export default App