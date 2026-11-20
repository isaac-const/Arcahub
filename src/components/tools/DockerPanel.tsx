import { useState, useEffect, useCallback } from 'react'
import { VscRefresh, VscDebugStop, VscDebugRestart, VscPlay, VscLinkExternal } from 'react-icons/vsc'
import { FaDocker } from 'react-icons/fa'
import type { DockerContainer } from '../../types'

export function DockerPanel() {
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [loadingDocker, setLoadingDocker] = useState(false)

  const loadDocker = useCallback(async () => {
      setLoadingDocker(true)
      const res = await window.electron.getDockerContainers()
      setContainers(res)
      setLoadingDocker(false)
  }, [])

  useEffect(() => { 
      loadDocker() 
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDockerAction = async (id: string, action: 'start'|'stop'|'restart') => {
      await window.electron.dockerAction({ id, action })
      loadDocker() 
  }

  return (
    <div>
         <div style={{ marginBottom: 20, padding: 15, background: 'rgba(36, 150, 237, 0.1)', border: '1px solid rgba(36, 150, 237, 0.3)', borderRadius: 12, display: 'flex', gap: 15, alignItems: 'center' }}>
            <FaDocker size={24} color="#2496ED" />
            <div style={{ flex: 1 }}>
                <strong style={{ color: '#2496ED', fontSize: '13px' }}>Docker Environment</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--ink2)' }}>Gerencie seus containers locais.</p>
            </div>
            <a href="https://docs.docker.com/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#2496ED', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>Docs <VscLinkExternal /></a>
        </div>

         <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 15 }}>
            <button onClick={loadDocker} disabled={loadingDocker} style={{ display:'flex', gap:6, alignItems:'center', background:'transparent', border:'1px solid var(--line2)', color:'var(--ink2)', padding:'6px 12px', borderRadius: 8, cursor:'pointer' }}>
                <VscRefresh className={loadingDocker ? 'spin' : ''} /> Atualizar
            </button>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 15 }}>
            {containers.map(c => (
                <div key={c.id} style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 12, padding: 15 }}>
                    <div style={{fontWeight:'bold', color:'var(--ink)', marginBottom:5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={c.name}>{c.name}</div>
                    <div style={{fontSize:'11px', color:'var(--mut)', marginBottom:10}}>{c.image}</div>
                    <div style={{display:'flex', gap:5}}>
                        {c.state === 'running' ? 
                            <><button onClick={() => handleDockerAction(c.id, 'stop')} style={{flex:1, background:'var(--line)', border:'none', color:'#ff6b6b', padding:5, borderRadius: 8}}><VscDebugStop/></button>
                              <button onClick={() => handleDockerAction(c.id, 'restart')} style={{flex:1, background:'var(--line)', border:'none', color:'var(--acc)', padding:5, borderRadius: 8}}><VscDebugRestart/></button></>
                            : <button onClick={() => handleDockerAction(c.id, 'start')} style={{flex:1, background:'var(--ok)', border:'none', color:'#fff', padding:5, borderRadius: 8}}><VscPlay/> Start</button>
                        }
                    </div>
                </div>
            ))}
         </div>
         <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
}