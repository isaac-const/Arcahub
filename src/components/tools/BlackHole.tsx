import { useState } from 'react'
import { VscFolderOpened } from 'react-icons/vsc'
import type { ScannedFolder } from '../../types'

export function BlackHole() {
  const [bhPath, setBhPath] = useState('')
  const [scannedFolders, setScannedFolders] = useState<ScannedFolder[]>([])
  const [isScanning, setIsScanning] = useState(false)

  const handleScanBH = async () => {
      if(!bhPath) return alert('Selecione pasta'); setIsScanning(true)
      const res = await window.electron.scanNodeModules(bhPath); setScannedFolders(res); setIsScanning(false)
  }
  const handleDeleteFolder = async (p: string) => {
      if(confirm(`Deletar ${p}?`)) {
          if(await window.electron.deleteFolder(p)) setScannedFolders(prev => prev.filter(f => f.path !== p))
          else alert('Erro ao deletar')
      }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'var(--card)', padding: 15, borderRadius: 12, border: '1px solid var(--line)', display:'flex', gap:10 }}>
            <input value={bhPath} readOnly placeholder="Selecione pasta raiz..." style={{ flex: 1, background: 'var(--panel)', border: '1px solid var(--line2)', color: '#fff', padding: '8px', borderRadius: 8 }} />
            <button onClick={async () => {const p = await window.electron.selectFolder(); if(p) setBhPath(p)}} style={{ background: 'var(--line)', color: '#fff', border: 'none', padding: '0 15px', borderRadius: 8 }}><VscFolderOpened/></button>
            <button onClick={handleScanBH} disabled={isScanning} style={{ background: 'linear-gradient(135deg, var(--acc) 0%, var(--acc2) 100%)', color: '#fff', border: 'none', padding: '0 20px', borderRadius: 8 }}>{isScanning ? '...' : 'Scan'}</button>
        </div>
        {scannedFolders.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10 }}>
                <div style={{color:'var(--ink2)', fontSize:'13px'}}>{item.path}</div>
                <div style={{display:'flex', gap:10}}><span style={{color:'#ff6b6b'}}>{item.size}</span><button onClick={() => handleDeleteFolder(item.path)} style={{color:'#ff6b6b', background:'transparent', border:'1px solid #ff6b6b', borderRadius: 8}}>DEL</button></div>
            </div>
        ))}
    </div>
  )
}