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
      borderBottom: '1px solid #333', 
      background: '#1e1e1e', 
      display: 'flex', 
      alignItems: 'center', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
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
            fontSize: '12px', color: '#666', marginBottom: '4px', fontFamily: 'monospace',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%'
          }}>
            {path}
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{path.split('/').pop() || 'Raiz'}</h1>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          {/* BOTÃO NOVO: Alternar Terminal */}
          <button 
            onClick={onToggleTerminal}
            title={isTerminalOpen ? "Ocultar Terminal" : "Mostrar Terminal"}
            style={{ 
              background: isTerminalOpen ? '#333' : '#2d2d2d',
              color: isTerminalOpen ? '#fff' : '#ccc', 
              border: '1px solid #444', 
              padding: '10px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: '0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#666'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#444'}
          >
            <VscTerminal size={20} />
          </button>

          <button onClick={onOpenCode}
            style={{ background: '#007acc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 5px rgba(0,122,204,0.3)', whiteSpace: 'nowrap' }}>
            <VscCode size={20} /> Abrir no VS Code
          </button>
        </div>

      </div>
    </div>
  )
}