import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  VscGitMerge, VscSourceControl, VscCloudUpload, 
  VscCheck, VscLoading, VscChevronDown, VscCircleFilled 
} from 'react-icons/vsc'
import { BaseCard } from './BaseCard'

const SEMANTIC_TYPES = [
  { id: 'feat', label: 'Feat', color: '#a9ff68', desc: 'Nova funcionalidade', placeholder: 'Ex: Adicionar botão de login...' },
  { id: 'fix', label: 'Fix', color: '#ff6b6b', desc: 'Correção de bug', placeholder: 'Ex: Corrigir erro na validação...' },
  { id: 'docs', label: 'Docs', color: '#61dafb', desc: 'Documentação', placeholder: 'Ex: Atualizar README...' },
  { id: 'style', label: 'Style', color: '#ff9f43', desc: 'Formatação, estilos', placeholder: 'Ex: Ajustar indentação no header...' },
  { id: 'refactor', label: 'Refactor', color: '#bd93f9', desc: 'Refatoração', placeholder: 'Ex: Simplificar lógica de autenticação...' },
  { id: 'test', label: 'Test', color: '#f8f8f2', desc: 'Testes', placeholder: 'Ex: Adicionar testes unitários...' },
  { id: 'chore', label: 'Chore', color: '#888888', desc: 'Build/Manutenção', placeholder: 'Ex: Atualizar versão do React...' },
]

interface Props {
  branch: string
  changes: number
  folderPath: string
  onSync: () => Promise<void>
  onCommit: (msg: string) => Promise<void>
  onBranchChange: () => void 
}

export function GitStatusCard({ branch, changes, folderPath, onSync, onCommit, onBranchChange }: Props) {
  const [commitMsg, setCommitMsg] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [isCommitting, setIsCommitting] = useState(false)
  
  const [selectedType, setSelectedType] = useState(SEMANTIC_TYPES[0])
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  
  const [showBranchMenu, setShowBranchMenu] = useState(false)
  const [availableBranches, setAvailableBranches] = useState<string[]>([])
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)
  const [isSwitchingBranch, setIsSwitchingBranch] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (changes > 0) inputRef.current?.focus()
  }, [changes])

  // --- LÓGICA DE BRANCH ---
  const handleOpenBranchMenu = async () => {
    if (showBranchMenu) {
        setShowBranchMenu(false)
        return
    }
    
    setIsLoadingBranches(true)
    setShowBranchMenu(true)
    
    try {
        const res = await window.electron.gitGetBranches(folderPath)
        if (res.success) {
            setAvailableBranches(res.branches || [])
        }
    } catch (error) {
        console.error('Erro ao buscar branches:', error)
    } finally {
        setIsLoadingBranches(false)
    }
  }

  const handleSwitchBranch = async (targetBranch: string) => {
    if (targetBranch === branch) {
        setShowBranchMenu(false)
        return
    }

    if (!confirm(`Trocar para a branch "${targetBranch}"?`)) return

    setIsSwitchingBranch(true)
    setShowBranchMenu(false)
    
    try {
        // CORREÇÃO: Passando 1 argumento (objeto)
        const res = await window.electron.gitCheckout({ folderPath, branch: targetBranch })
        if (res.success) {
            onBranchChange() 
        } else {
            alert('Erro ao trocar branch: ' + res.error)
        }
    } catch (error) {
        console.error(error)
        alert('Erro fatal ao trocar branch')
    } finally {
        setIsSwitchingBranch(false)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    await onSync()
    setIsSyncing(false)
  }

  const handleCommit = async () => {
    if (!commitMsg) return
    setIsCommitting(true)
    const finalMsg = `${selectedType.id}: ${commitMsg}`
    await onCommit(finalMsg)
    setCommitMsg('')
    setIsCommitting(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCommit()
  }

  const handleSelectType = (type: typeof SEMANTIC_TYPES[0]) => {
      setSelectedType(type)
      setShowTypeMenu(false)
      setTimeout(() => inputRef.current?.focus(), 50)
  }

  const SyncAction = (
    <motion.button 
      onClick={handleSync}
      disabled={isSyncing}
      whileHover={{ scale: 1.2, color: '#007acc' }}
      whileTap={{ scale: 0.9 }}
      title="Sincronizar (Pull & Push)"
      style={{ 
        background: 'transparent', border: 'none', color: isSyncing ? '#007acc' : '#888', 
        cursor: isSyncing ? 'default' : 'pointer', display: 'flex', alignItems: 'center' 
      }}
    >
      {isSyncing ? <VscLoading className="spin" /> : <VscCloudUpload size={18} />}
    </motion.button>
  )

  return (
    <BaseCard title="Git Status" icon={<VscSourceControl size={18} />} action={SyncAction}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 15 }}>
        
        {/* Infos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          
          {/* LINHA DA BRANCH */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#888', fontSize: '13px' }}>Branch</span>
            
            <div style={{ position: 'relative' }}>
                <motion.button 
                    onClick={handleOpenBranchMenu}
                    disabled={isSwitchingBranch}
                    whileHover={{ backgroundColor: '#2a2d2e' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: 6, 
                        background: '#1e1e1e', 
                        border: '1px solid #333',
                        padding: '4px 10px', borderRadius: '4px', 
                        fontSize: '12px', color: '#007acc', cursor: 'pointer',
                        minWidth: '100px', justifyContent: 'center'
                    }}
                >
                    {isSwitchingBranch ? <VscLoading className="spin"/> : <VscGitMerge />} 
                    <span style={{ fontWeight: 600 }}>{branch}</span>
                    <VscChevronDown size={10} style={{ opacity: 0.7 }}/>
                </motion.button>

                {/* Menu de Branches */}
                <AnimatePresence>
                    {showBranchMenu && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowBranchMenu(false)} />
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="custom-scrollbar"
                                style={{
                                    position: 'absolute',
                                    top: '110%', 
                                    right: 0,
                                    width: '180px', 
                                    maxHeight: '200px', 
                                    overflowY: 'auto',
                                    background: '#1e1e1e',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    zIndex: 100,
                                    padding: '5px',
                                    display: 'flex', flexDirection: 'column', gap: 2
                                }}
                            >
                                {isLoadingBranches ? (
                                    <div style={{ padding: 10, textAlign: 'center', color: '#888', fontSize: '11px' }}>
                                        <VscLoading className="spin"/> Carregando...
                                    </div>
                                ) : (
                                    availableBranches.map(b => (
                                        <button
                                            key={b}
                                            onClick={() => handleSwitchBranch(b)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 8, padding: '8px',
                                                background: b === branch ? '#252526' : 'transparent',
                                                border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left',
                                                color: b === branch ? '#007acc' : '#e0e0e0',
                                                fontSize: '12px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#252526'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = b === branch ? '#252526' : 'transparent'}
                                        >
                                            {/* Substituído VscGitBranch por VscGitMerge para garantir que existe */}
                                            <VscGitMerge size={14} style={{ opacity: b === branch ? 1 : 0.4 }} />
                                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{b}</span>
                                            {b === branch && <VscCheck size={12} style={{ marginLeft: 'auto' }}/>}
                                        </button>
                                    ))
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#888', fontSize: '13px' }}>Pendentes</span>
            <span style={{ color: changes > 0 ? '#ff6b6b' : '#28a745', fontWeight: 'bold', fontSize: '13px' }}>
              {changes} arquivos
            </span>
          </div>
        </div>

        {/* Área de Commit */}
        {changes > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto', position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                    <motion.button 
                        onClick={() => setShowTypeMenu(!showTypeMenu)} 
                        style={{ 
                            height: '100%', background: '#252526', border: '1px solid #333', borderRadius: '6px', 
                            padding: '0 8px', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', 
                            color: selectedType.color, fontSize: '11px', fontWeight: 'bold', minWidth: '70px', justifyContent: 'space-between' 
                        }}
                    >
                        {selectedType.label} <VscChevronDown color="#888" size={10} />
                    </motion.button>

                    <AnimatePresence>
                        {showTypeMenu && (
                            <>
                                <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowTypeMenu(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                                    className="custom-scrollbar" 
                                    style={{ 
                                        position: 'absolute', bottom: '110%', left: 0, width: '230px', maxHeight: '220px', 
                                        overflowY: 'auto', background: '#1e1e1e', border: '1px solid #333', 
                                        borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, 
                                        padding: '5px', display: 'flex', flexDirection: 'column', gap: 2 
                                    }}
                                >
                                    {SEMANTIC_TYPES.map(type => (
                                        <button 
                                            key={type.id} 
                                            onClick={() => handleSelectType(type)} 
                                            title={type.desc} 
                                            style={{ 
                                                display: 'flex', alignItems: 'center', gap: 8, padding: '8px', 
                                                background: selectedType.id === type.id ? '#252526' : 'transparent', 
                                                border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', flexShrink: 0 
                                            }} 
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#252526'} 
                                            onMouseLeave={(e) => e.currentTarget.style.background = selectedType.id === type.id ? '#252526' : 'transparent'}
                                        >
                                            <VscCircleFilled color={type.color} size={8} style={{ flexShrink: 0 }} />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#e0e0e0', fontSize: '12px', fontWeight: 'bold' }}>{type.label}</span>
                                                <span style={{ color: '#888', fontSize: '10px', lineHeight: '1.2' }}>{type.desc}</span>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
                <input 
                    ref={inputRef} 
                    value={commitMsg} 
                    onChange={e => setCommitMsg(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    placeholder={selectedType.placeholder} 
                    disabled={isCommitting} 
                    style={{ 
                        flex: 1, background: '#252526', border: '1px solid #333', 
                        borderRadius: '6px', padding: '6px 10px', color: '#e0e0e0', fontSize: '12px', outline: 'none' 
                    }} 
                />
                <motion.button 
                    onClick={handleCommit} 
                    disabled={!commitMsg || isCommitting} 
                    whileHover={{ scale: 1.1, backgroundColor: '#28a745' }} 
                    whileTap={{ scale: 0.9 }} 
                    title="Commit (Enter)" 
                    style={{ 
                        background: '#28a745', border: 'none', borderRadius: '6px', width: 32, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', 
                        cursor: 'pointer', opacity: !commitMsg ? 0.5 : 1 
                    }}
                >
                    {isCommitting ? <VscLoading className="spin" /> : <VscCheck />}
                </motion.button>
            </div>
        )}

        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }`}</style>
      </div>
    </BaseCard>
  )
}