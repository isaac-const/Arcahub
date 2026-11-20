import { 
  FaPlus, FaTrash, FaGlobe, FaFileAlt, 
  FaFigma, FaGithub, FaTrello, FaYoutube, FaGoogle, FaSpotify, FaDiscord, FaImage, FaCode 
} from 'react-icons/fa'
import { SiNotion, SiVercel, SiNetlify } from 'react-icons/si'
import { useState, useEffect } from 'react'
import type { Asset } from '../types'

interface Props {
  assets: Asset[]
  notes: string
  onAdd: (name: string, value: string) => void
  onDelete: (name: string) => void
  onOpen: (value: string) => void
  onSaveNotes: (text: string) => void
}

export function RightPanel({ assets, notes, onAdd, onDelete, onOpen, onSaveNotes }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [val, setVal] = useState('')
  const [localNotes, setLocalNotes] = useState(notes)

  useEffect(() => {
    setLocalNotes(notes)
  }, [notes])

  const handleSave = () => {
    onAdd(name, val)
    setName(''); setVal(''); setShowForm(false)
  }

  // --- ÍCONES DINÂMICOS (AGORA USANDO TODOS) ---
  const getAssetIcon = (value: string, type: string) => {
    const v = value.toLowerCase()

    // 1. Design & Mídia
    if (v.includes('figma.com')) return <FaFigma color="#F24E1E" size={16} />
    if (v.includes('youtube.com') || v.includes('youtu.be')) return <FaYoutube color="#FF0000" size={16} />
    if (v.includes('spotify.com')) return <FaSpotify color="#1DB954" size={16} />
    if (v.includes('.png') || v.includes('.jpg') || v.includes('.svg')) return <FaImage color="var(--ink)" size={16} />

    // 2. Dev & Tech
    if (v.includes('github.com')) return <FaGithub color="#fff" size={16} />
    if (v.includes('trello.com')) return <FaTrello color="#0079BF" size={16} />
    if (v.includes('discord.com') || v.includes('discord.gg')) return <FaDiscord color="#5865F2" size={16} />
    if (v.includes('localhost')) return <FaCode color="var(--ok)" size={16} />
    
    // 3. Deploy & Docs (AQUI ESTAVAM FALTANDO)
    if (v.includes('vercel.com')) return <SiVercel color="#fff" size={16} />
    if (v.includes('netlify.com')) return <SiNetlify color="#00C7B7" size={16} />
    if (v.includes('notion.so') || v.includes('notion.com')) return <SiNotion color="#fff" size={16} />
    if (v.includes('google.com') || v.includes('docs.google')) return <FaGoogle color="#4285F4" size={16} />

    // 4. Padrões
    return type === 'link' ? <FaGlobe color="var(--acc)" size={16} /> : <FaFileAlt color="#ff9f43" size={16} />
  }

  return (
    <div style={{ 
      width: '300px', 
      minWidth: '300px', 
      background: 'var(--panel)', 
      borderLeft: '1px solid var(--line)', 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', color: 'var(--mut)', letterSpacing: 1 }}>Referências</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ background: 'transparent', border: 'none', color: 'var(--acc)', cursor: 'pointer', fontSize: '12px', display: 'flex', gap: 5, alignItems: 'center' }}>
          <FaPlus /> Nova
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {showForm && (
          <div style={{ background: 'var(--card)', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid var(--line2)' }}>
            <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px', background: 'var(--panel)', border: '1px solid var(--line)', color: '#fff', borderRadius: '8px' }} />
            <input placeholder="URL (ex: figma.com/...)" value={val} onChange={e => setVal(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px', background: 'var(--panel)', border: '1px solid var(--line)', color: '#fff', borderRadius: '8px' }} />
            <button onClick={handleSave} style={{ width: '100%', background: 'linear-gradient(135deg, var(--acc) 0%, var(--acc2) 100%)', border: 'none', padding: '8px', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Salvar</button>
          </div>
        )}

        {assets.map((asset, idx) => (
          <div key={idx} onClick={() => onOpen(asset.value)}
            style={{ 
              marginBottom: '10px', padding: '12px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--line)', cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--line3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
          >
            {/* Ícone Dinâmico */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24 }}>
                {getAssetIcon(asset.value, asset.type)}
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--ink)' }}>{asset.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--mut2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.value}</div>
            </div>
            
            <button onClick={(e) => { e.stopPropagation(); onDelete(asset.name) }} style={{ background: 'transparent', border: 'none', color: 'var(--line2)', cursor: 'pointer', padding: 5 }}>
              <FaTrash size={12} />
            </button>
          </div>
        ))}

        {assets.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', color: 'var(--line2)', fontSize: '12px', marginTop: 20 }}>
            Nenhuma referência.
            <br/>Adicione links do Figma, Docs, etc.
          </div>
        )}
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid var(--line)' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--mut)' }}>Notas Rápidas</h3>
        <textarea 
          placeholder="Escreva algo... (Salva automático)" 
          value={localNotes}
          onChange={e => setLocalNotes(e.target.value)}
          onBlur={() => onSaveNotes(localNotes)} 
          style={{ width: '100%', height: '100px', background: 'var(--card)', border: 'none', borderRadius: '10px', color: 'var(--ink2)', padding: '10px', resize: 'none', fontFamily: 'sans-serif' }} 
        />
      </div>
    </div>
  )
}