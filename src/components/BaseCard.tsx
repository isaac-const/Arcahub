import type { ReactNode, CSSProperties } from 'react'

interface Props {
  title?: string
  icon?: ReactNode
  children: ReactNode
  action?: ReactNode
  style?: CSSProperties
}

export function BaseCard({ title, icon, children, action, style }: Props) {
  return (
    <div style={{ 
      background: 'linear-gradient(160deg, var(--card) 0%, var(--panel) 100%)', 
      borderRadius: '16px', 
      border: '1px solid var(--line)', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '0 18px 40px -24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04)',
      overflow: 'hidden',
      position: 'relative',
      ...style 
    }}>
      {/* Efeito de luz sutil no topo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

      {(title || icon) && (
        <div style={{ 
          padding: '20px 25px 15px 25px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink)', fontWeight: 600, fontSize: '15px' }}>
            {icon && <span style={{ color: 'var(--acc)', display: 'flex' }}>{icon}</span>}
            {title}
          </div>
          {action && <div style={{ display: 'flex', alignItems: 'center' }}>{action}</div>}
        </div>
      )}

      <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}