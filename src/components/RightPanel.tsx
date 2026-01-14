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
    if (v.includes('.png') || v.includes('.jpg') || v.includes('.svg')) return <FaImage color="#e0e0e0" size={16} />

    // 2. Dev & Tech
    if (v.includes('github.com')) return <FaGithub color="#fff" size={16} />
    if (v.includes('trello.com')) return <FaTrello color="#0079BF" size={16} />
    if (v.includes('discord.com') || v.includes('discord.gg')) return <FaDiscord color="#5865F2" size={16} />
    if (v.includes('localhost')) return <FaCode color="#28a745" size={16} />
    
    // 3. Deploy & Docs (AQUI ESTAVAM FALTANDO)
    if (v.includes('vercel.com')) return <SiVercel color="#fff" size={16} />
    if (v.includes('netlify.com')) return <SiNetlify color="#00C7B7" size={16} />
    if (v.includes('notion.so') || v.includes('notion.com')) return <SiNotion color="#fff" size={16} />
    if (v.includes('google.com') || v.includes('docs.google')) return <FaGoogle color="#4285F4" size={16} />

    // 4. Padrões
    return type === 'link' ? <FaGlobe color="#61dafb" size={16} /> : <FaFileAlt color="#ff9f43" size={16} />
  }

  return (
    <div style={{ 
      width: '300px', 
      minWidth: '300px', 
      background: '#181818', 
      borderLeft: '1px solid #333', 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', color: '#888', letterSpacing: 1 }}>Referências</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ background: 'transparent', border: 'none', color: '#61dafb', cursor: 'pointer', fontSize: '12px', display: 'flex', gap: 5, alignItems: 'center' }}>
          <FaPlus /> Nova
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {showForm && (
          <div style={{ background: '#252526', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #444' }}>
            <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px', background: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
            <input placeholder="URL (ex: figma.com/...)" value={val} onChange={e => setVal(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px', background: '#1e1e1e', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
            <button onClick={handleSave} style={{ width: '100%', background: '#007acc', border: 'none', padding: '8px', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Salvar</button>
          </div>
        )}

        {assets.map((asset, idx) => (
          <div key={idx} onClick={() => onOpen(asset.value)}
            style={{ 
              marginBottom: '10px', padding: '12px', borderRadius: '8px', background: '#252526', border: '1px solid #333', cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#555'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
          >
            {/* Ícone Dinâmico */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24 }}>
                {getAssetIcon(asset.value, asset.type)}
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#e0e0e0' }}>{asset.name}</div>
              <div style={{ fontSize: '11px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.value}</div>
            </div>
            
            <button onClick={(e) => { e.stopPropagation(); onDelete(asset.name) }} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', padding: 5 }}>
              <FaTrash size={12} />
            </button>
          </div>
        ))}

        {assets.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', color: '#444', fontSize: '12px', marginTop: 20 }}>
            Nenhuma referência.
            <br/>Adicione links do Figma, Docs, etc.
          </div>
        )}
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#888' }}>Notas Rápidas</h3>
        <textarea 
          placeholder="Escreva algo... (Salva automático)" 
          value={localNotes}
          onChange={e => setLocalNotes(e.target.value)}
          onBlur={() => onSaveNotes(localNotes)} 
          style={{ width: '100%', height: '100px', background: '#252526', border: 'none', borderRadius: '6px', color: '#ccc', padding: '10px', resize: 'none', fontFamily: 'sans-serif' }} 
        />
      </div>
    </div>
  )
}