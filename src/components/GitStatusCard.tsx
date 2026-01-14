import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  VscGitMerge, VscSourceControl, VscCloudUpload, 
  VscCheck, VscLoading, VscChevronDown, VscCircleFilled 
} from 'react-icons/vsc'
import { BaseCard } from './BaseCard'

// 1. PLACEHOLDERS INTELIGENTES (No Padrão Imperativo)
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
  onSync: () => Promise<void>
  onCommit: (msg: string) => Promise<void>
}

export function GitStatusCard({ branch, changes, onSync, onCommit }: Props) {
  const [commitMsg, setCommitMsg] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [isCommitting, setIsCommitting] = useState(false)
  
  const [selectedType, setSelectedType] = useState(SEMANTIC_TYPES[0])
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (changes > 0) inputRef.current?.focus()
  }, [changes])

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

  // 2. APENAS ENTER (Sem Ctrl)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleCommit()
    }
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
      whileHover={{ scale: 1.2, color: '#61dafb' }}
      whileTap={{ scale: 0.9 }}
      title="Sincronizar (Pull & Push)"
      style={{ 
        background: 'transparent', border: 'none', color: isSyncing ? '#61dafb' : '#888', 
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#888', fontSize: '13px' }}>Branch</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(97, 218, 251, 0.1)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', color: '#61dafb' }}>
              <VscGitMerge /> {branch}
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
                
                {/* Seletor de Tipo */}
                <div style={{ position: 'relative' }}>
                    <motion.button
                        onClick={() => setShowTypeMenu(!showTypeMenu)}
                        style={{
                            height: '100%',
                            background: '#121212',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            padding: '0 8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            cursor: 'pointer',
                            color: selectedType.color,
                            fontSize: '11px',
                            fontWeight: 'bold',
                            minWidth: '70px',
                            justifyContent: 'space-between'
                        }}
                    >
                        {selectedType.label}
                        <VscChevronDown color="#666" size={10} />
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
                                        position: 'absolute',
                                        bottom: '110%', 
                                        left: 0,
                                        width: '230px', // Um pouco mais largo para caber as descrições
                                        maxHeight: '220px', 
                                        overflowY: 'auto',
                                        background: '#1e1e1e',
                                        border: '1px solid #333',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        zIndex: 100,
                                        padding: '5px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}
                                >
                                    {SEMANTIC_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => handleSelectType(type)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                padding: '8px',
                                                background: selectedType.id === type.id ? '#252526' : 'transparent',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                flexShrink: 0
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

                {/* Input com Placeholder Dinâmico */}
                <input 
                    ref={inputRef}
                    value={commitMsg}
                    onChange={e => setCommitMsg(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedType.placeholder} // AQUI ESTÁ A MÁGICA
                    disabled={isCommitting}
                    style={{ 
                        flex: 1, background: '#121212', border: '1px solid #333', 
                        borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '12px', outline: 'none'
                    }}
                />

                <motion.button 
                    onClick={handleCommit}
                    disabled={!commitMsg || isCommitting}
                    whileHover={{ scale: 1.1, backgroundColor: '#218838' }}
                    whileTap={{ scale: 0.9 }}
                    title="Commit (Enter)"
                    style={{ 
                        background: '#28a745', border: 'none', borderRadius: '6px', 
                        width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', cursor: 'pointer', opacity: !commitMsg ? 0.5 : 1
                    }}
                >
                    {isCommitting ? <VscLoading className="spin" /> : <VscCheck />}
                </motion.button>
            </div>
        )}

        <style>{`
            .spin { animation: spin 1s linear infinite; } 
            @keyframes spin { 100% { transform: rotate(360deg); } }
            
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        `}</style>
      </div>
    </BaseCard>
  )
}