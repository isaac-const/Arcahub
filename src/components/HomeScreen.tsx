import { VscStarFull, VscFolderOpened } from 'react-icons/vsc'

interface Props {
  favorites: string[]
  onNavigate: (path: string) => void
  onUnfavorite: (path: string) => void
}

export function HomeScreen({ favorites, onNavigate, onUnfavorite }: Props) {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '10px', background: 'linear-gradient(90deg, #fff 20%, var(--acc) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bem-vindo ao Arcahub</h1>
        <p style={{ color: 'var(--mut2)' }}>Selecione um projeto para começar ou acesse seus favoritos.</p>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <VscStarFull color="#ffd700" />
        <h2 style={{ fontSize: '18px', margin: 0 }}>Pastas Favoritas</h2>
      </div>

      {favorites.length === 0 ? (
        <div style={{ padding: '48px', border: '1.5px dashed var(--line2)', borderRadius: '24px', background: 'color-mix(in oklab, var(--card) 60%, transparent)', textAlign: 'center', color: 'var(--line3)' }}>
            <VscStarFull size={40} style={{ marginBottom: 10, opacity: 0.2 }} />
            <p>Você ainda não tem favoritos.</p>
            <p style={{ fontSize: '12px' }}>Clique na estrela ao lado de uma pasta para adicionar.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {favorites.map(path => (
            <div key={path} 
              onClick={() => onNavigate(path)}
              style={{ 
                background: 'var(--panel)', 
                border: '1px solid var(--line)', 
                borderRadius: '12px', 
                padding: '20px', 
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.2s, border-color 0.2s',
                display: 'flex', flexDirection: 'column', gap: 10
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--acc)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--line)' }}
            >
                <div style={{ width: 40, height: 40, background: 'var(--card)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--acc)' }}>
                    <VscFolderOpened size={20} />
                </div>
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {path.split('/').pop() || path.split('\\').pop()}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--mut2)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {path}
                    </div>
                </div>

                {/* Botão de Remover Favorito (X) */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onUnfavorite(path) }}
                    title="Remover dos favoritos"
                    style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', color: 'var(--line2)', cursor: 'pointer', fontSize: '16px' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--line2)'}
                >
                    &times;
                </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}