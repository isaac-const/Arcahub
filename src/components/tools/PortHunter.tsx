import { useState, useEffect, useCallback } from 'react'
import { VscRefresh } from 'react-icons/vsc'
import type { PortInfo } from '../../types'

export function PortHunter() {
  const [ports, setPorts] = useState<PortInfo[]>([])
  const [loadingPorts, setLoadingPorts] = useState(false)

  const loadPorts = useCallback(async () => {
    setLoadingPorts(true)
    const res = await window.electron.getPorts()
    setPorts(res)
    setLoadingPorts(false)
  }, [])

  useEffect(() => { 
      loadPorts() 
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKillPort = async (pid: number) => {
      const res = await window.electron.killPort(pid)
      if (res.success) loadPorts()
      else {
          const isWin = navigator.userAgent.toLowerCase().includes('windows')
          const cmd = isWin ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`
          if (confirm(`Falha ao matar processo.\nCopiar comando?\n\nErro: ${res.error}`)) navigator.clipboard.writeText(cmd)
      }
  }

  return (
    <div>
        <div style={{textAlign:'right', marginBottom:10}}>
            <button onClick={loadPorts} disabled={loadingPorts} style={{background:'transparent', border:'1px solid #444', color:'#ccc', padding:'5px 10px', borderRadius:4, display:'inline-flex', alignItems:'center', gap:5, cursor:'pointer'}}>
                <VscRefresh className={loadingPorts ? 'spin' : ''}/> Atualizar
            </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead><tr style={{ background: '#252526', color: '#aaa', textAlign:'left' }}><th style={{padding:10}}>Porta</th><th>PID</th><th>Processo</th><th>Ação</th></tr></thead>
            <tbody>
                {ports.map(p => (
                    <tr key={p.pid} style={{borderBottom:'1px solid #333'}}>
                        <td style={{padding:10, color:'#61dafb'}}>:{p.port}</td><td style={{color:'#888'}}>{p.pid}</td><td>{p.processName}</td>
                        <td><button onClick={() => handleKillPort(p.pid)} style={{background:'#333', border:'none', color:'#ff6b6b', padding:'4px 8px', borderRadius:4, cursor:'pointer'}}>Matar</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
}