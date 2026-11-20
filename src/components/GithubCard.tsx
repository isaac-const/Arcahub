import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaPen, FaTimes } from 'react-icons/fa'
import { VscGithub } from 'react-icons/vsc'
import { BaseCard } from './BaseCard'

interface Props {
  url: string
  onSave: (newUrl: string) => void
  onOpen: (url: string) => void
}

export function GithubCard({ url, onSave, onOpen }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempUrl, setTempUrl] = useState('')

  const handleStartEdit = () => {
    setTempUrl(url)
    setIsEditing(true)
  }

  const handleSave = () => {
    onSave(tempUrl)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTempUrl(url)
  }

  const EditAction = (
    !isEditing ? (
      <motion.button 
        whileHover={{ scale: 1.2, color: '#fff' }}
        onClick={handleStartEdit} 
        style={{ background: 'transparent', border: 'none', color: 'var(--mut2)', cursor: 'pointer', fontSize: '12px' }} 
        title="Editar Link"
      >
        <FaPen />
      </motion.button>
    ) : null
  )

  return (
    <BaseCard title="Repositório" icon={<VscGithub size={18} />} action={EditAction}>
      {isEditing ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <input 
            value={tempUrl} 
            onChange={e => setTempUrl(e.target.value)} 
            placeholder="github.com/usuario/repo" 
            autoFocus
            style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--line2)', background: 'var(--bg)', color: '#fff' }} 
          />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} style={{ background: 'var(--ok)', border: 'none', padding: '0 15px', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCancel} style={{ background: 'var(--line)', border: '1px solid var(--line3)', padding: '0 15px', color: '#ff6b6b', borderRadius: '12px', cursor: 'pointer' }}><FaTimes /></motion.button>
        </div>
      ) : (
        url ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                 <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaGithub size={24} color="#fff" />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <span style={{ fontWeight: 600, color: '#fff' }}>GitHub</span>
                     <span style={{ fontSize: '12px', color: 'var(--mut)' }}>{url.replace('https://github.com/', '')}</span>
                 </div>
             </div>
             
             <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'var(--line)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpen(url)} 
                style={{ background: 'var(--card)', border: '1px solid var(--line2)', padding: '8px 16px', color: 'var(--ink)', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
            >
                Acessar
             </motion.button>
          </div>
        ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--mut2)', fontStyle: 'italic' }}>
                <p style={{ margin: 0, marginBottom: 10 }}>Nenhum repositório vinculado.</p>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleStartEdit} style={{ background: 'linear-gradient(135deg, var(--acc) 0%, var(--acc2) 100%)', border: 'none', padding: '8px 16px', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>Vincular Agora</motion.button>
            </div>
        )
      )}
    </BaseCard>
  )
}