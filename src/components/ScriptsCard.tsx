import { VscPlay, VscPlayCircle } from 'react-icons/vsc'
import { BaseCard } from './BaseCard'

interface Props {
  scripts: Record<string, string>
  onRun: (scriptName: string) => void
}

export function ScriptsCard({ scripts, onRun }: Props) {
  const scriptEntries = Object.entries(scripts)

  if (scriptEntries.length === 0) return null;

  return (
    <BaseCard title="NPM Scripts" icon={<VscPlayCircle size={18} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '220px', overflowY: 'auto', paddingRight: '5px' }}>
        {scriptEntries.map(([name, command]) => (
          <div key={name} 
            className="script-item" // (Opcional: se quiser CSS hover)
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              background: 'rgba(255,255,255,0.03)', 
              padding: '12px 15px', borderRadius: '10px', 
              border: '1px solid transparent',
              transition: '0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'var(--line2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'transparent' }}
          >
            <div style={{ overflow: 'hidden', marginRight: 10 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '13px', marginBottom: 2 }}>{name}</div>
                <div style={{ fontSize: '11px', color: 'var(--mut2)', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{command}</div>
            </div>
            
            <button 
                onClick={() => onRun(name)}
                title={`Rodar: ${name}`}
                style={{ 
                    background: 'var(--card)', border: '1px solid var(--line2)', 
                    borderRadius: '12px', width: '32px', height: '32px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    cursor: 'pointer', color: 'var(--acc)', flexShrink: 0,
                    transition: '0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--acc)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--acc)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--acc)'; e.currentTarget.style.borderColor = 'var(--line2)' }}
            >
                <VscPlay size={14} />
            </button>
          </div>
        ))}
      </div>
    </BaseCard>
  )
}