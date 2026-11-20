import { VscCode, VscTerminal } from 'react-icons/vsc'

interface Props {
  path: string
  onOpenCode: () => void
  onToggleTerminal: () => void 
  isTerminalOpen: boolean      
}

export function Header({ path, onOpenCode, onToggleTerminal, isTerminalOpen }: Props) {
  return (
    <div style={{ 
      height: '80px', 
      width: '100%', 
      flexShrink: 0, 
      borderBottom: '1px solid var(--line)', 
      background: 'color-mix(in oklab, var(--panel) 82%, transparent)', backdropFilter: 'blur(14px)', 
      display: 'flex', 
      alignItems: 'center', 
      boxShadow: '0 12px 30px -20px rgba(0,0,0,.8)', 
      zIndex: 5 
    }}>
      <div style={{ 
        width: '100%', 
        padding: '0 30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        
        <div style={{ maxWidth: '60%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ 
            fontSize: '12px', color: 'var(--mut2)', marginBottom: '4px', fontFamily: 'monospace',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%'
          }}>
            {path}
          </div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, letterSpacing: '-0.03em' }}>{path.split('/').pop() || 'Raiz'}</h1>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          {/* BOTÃO NOVO: Alternar Terminal */}
          <button 
            onClick={onToggleTerminal}
            title={isTerminalOpen ? "Ocultar Terminal" : "Mostrar Terminal"}
            style={{ 
              background: isTerminalOpen ? 'var(--line)' : 'var(--card2)',
              color: isTerminalOpen ? '#fff' : 'var(--ink2)', 
              border: '1px solid var(--line2)', 
              padding: '10px', 
              borderRadius: '10px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: '0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--mut2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line2)'}
          >
            <VscTerminal size={20} />
          </button>

          <button onClick={onOpenCode}
            style={{ background: 'linear-gradient(135deg, var(--acc) 0%, var(--acc2) 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 24px -10px rgba(91,140,255,.7)', whiteSpace: 'nowrap' }}>
            <VscCode size={20} /> Abrir no VS Code
          </button>
        </div>

      </div>
    </div>
  )
}