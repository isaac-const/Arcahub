import { useState } from 'react'
import { FaFolder, FaArrowLeft, FaStar, FaRegStar, FaSearch } from 'react-icons/fa'
import { VscTools, VscSettingsGear } from 'react-icons/vsc'
import type { ElementType } from 'react'

interface Props {
  path: string
  folders: string[]
  favorites: string[]
  onNavigate: (folder: string) => void
  onBack: () => void
  onToggleFavorite: (folderPath: string) => void
  onGoHome: () => void
  onOpenDevTools: () => void
  onOpenSettings: () => void 
}

const SidebarButton = ({ icon: Icon, label, onClick, shortcut }: { icon: ElementType, label: string, onClick: () => void, shortcut?: string }) => {
  const [hover, setHover] = useState(false)
  
  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ 
        background: hover ? '#252526' : 'transparent', 
        border: 'none', 
        color: hover ? '#e0e0e0' : '#888', 
        cursor: 'pointer', 
        display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 15px',
        transition: 'all 0.2s', 
        fontSize: '13px',
        borderTop: '1px solid transparent' 
      }}
    >
      <Icon size={16} /> 
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
      
      {shortcut && (
        <span style={{ 
            fontSize: '10px', 
            color: '#555', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid #333', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            opacity: hover ? 1 : 0.7 
        }}>
            {shortcut}
        </span>
      )}
    </button>
  )
}

export function Sidebar({ path, folders, favorites, onNavigate, onBack, onToggleFavorite, onGoHome, onOpenDevTools, onOpenSettings }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const currentFolderName = path.split('/').filter(Boolean).pop() || path

  const filteredFolders = folders.filter(folder => 
    folder.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ width: '250px', minWidth: '250px', background: '#121212', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      
      {/* Header */}
      <div 
        onClick={onGoHome}
        title="Voltar para o Início"
        style={{ 
            padding: '20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #333', flexShrink: 0, cursor: 'pointer', transition: 'background 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#1e1e1e'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      > 
        <div style={{ width: 32, height: 32, background: '#007acc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="./icon.ico" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
        </div>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Arcahub</span>
      </div>

      {/* Lista */}
      <div style={{ padding: '15px', flex: 1, overflowY: 'auto' }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', marginBottom: 15, padding: '5px' }}>
          <FaArrowLeft /> Voltar nível
        </button>

        <div style={{ marginBottom: 15, position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: '12px' }} />
          <input 
            type="text" placeholder="Filtrar pastas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: '#1e1e1e', border: '1px solid #333', borderRadius: '6px', padding: '8px 8px 8px 30px', color: '#ccc', fontSize: '13px', outline: 'none' }}
            onFocus={(e) => e.target.style.borderColor = '#007acc'} onBlur={(e) => e.target.style.borderColor = '#333'}
          />
        </div>

        <div style={{ marginBottom: 10, paddingLeft: 5, fontSize: '11px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>
            Navegador ({currentFolderName})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredFolders.map(folder => {
            const fullPath = `${path}/${folder}`.replace(/\/\//g, '/')
            const isFav = favorites.includes(fullPath)
            return (
              <div key={folder} className="folder-item"
                style={{ padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', color: '#ccc', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.2s' }}
                onClick={() => onNavigate(folder)}
                onMouseEnter={e => e.currentTarget.style.background = '#1e1e1e'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                    <FaFolder color="#444" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{folder}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(fullPath) }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isFav ? '#ffd700' : '#444', display: isFav ? 'block' : 'flex', opacity: isFav ? 1 : 0.2 }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = isFav ? '1' : '0.2'}>
                    {isFav ? <FaStar /> : <FaRegStar />}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* RODAPÉ PADRONIZADO */}
      <div style={{ borderTop: '1px solid #333', background: '#121212', paddingBottom: 5 }}>
        
        {/* Botão Ferramentas (com atalho visual) */}
        <SidebarButton 
            icon={VscTools} 
            label="Ferramentas" 
            onClick={onOpenDevTools} 
            shortcut="Ctrl K" 
        />

        {/* Botão Configurações (mesmo estilo) */}
        <SidebarButton 
            icon={VscSettingsGear} 
            label="Configurações" 
            onClick={onOpenSettings}
        />
        
      </div>

    </div>
  )
}