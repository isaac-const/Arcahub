import { useState } from 'react'
import { motion } from 'framer-motion'
import { VscGitMerge, VscSourceControl, VscCloudUpload, VscCheck, VscLoading } from 'react-icons/vsc'
import { BaseCard } from './BaseCard'

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

  const handleSync = async () => {
    setIsSyncing(true)
    await onSync()
    setIsSyncing(false)
  }

  const handleCommit = async () => {
    if (!commitMsg) return
    setIsCommitting(true)
    await onCommit(commitMsg)
    setCommitMsg('')
    setIsCommitting(false)
  }

  // Ação de Sync no Header (Nuvem)
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

        {/* Área de Commit (Só aparece se tiver mudanças) */}
        {changes > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <input 
                    value={commitMsg}
                    onChange={e => setCommitMsg(e.target.value)}
                    placeholder="Mensagem..."
                    disabled={isCommitting}
                    style={{ 
                        flex: 1, background: '#121212', border: '1px solid #333', 
                        borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '12px', outline: 'none'
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleCommit()}
                />
                <motion.button 
                    onClick={handleCommit}
                    disabled={!commitMsg || isCommitting}
                    whileHover={{ scale: 1.1, backgroundColor: '#218838' }}
                    whileTap={{ scale: 0.9 }}
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

        {/* Estilo para animação de girar (mantido seu estilo CSS) */}
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </BaseCard>
  )
}