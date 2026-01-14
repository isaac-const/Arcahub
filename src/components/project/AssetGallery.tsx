import { useState, useEffect } from 'react'
import { VscRefresh, VscCopy, VscFileMedia } from 'react-icons/vsc'
import type { AssetFile } from '../../types'

interface Props {
  projectPath: string
}

export function AssetGallery({ projectPath }: Props) {
  const [assets, setAssets] = useState<AssetFile[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')
  const [previews, setPreviews] = useState<Record<string, string>>({})

  useEffect(() => {
    let mounted = true
    const load = async () => {
        if (mounted) setLoading(true)
        const res = await window.electron.scanImages(projectPath)
        
        if (res.success && mounted) {
            setAssets(res.assets)
            
            // Carrega previews
            res.assets.forEach(async (asset) => {
                const b64 = await window.electron.readImageBase64(asset.path)
                if (b64 && mounted) {
                    setPreviews(prev => ({ ...prev, [asset.path]: `data:image/${asset.extension.replace('.', '')};base64,${b64}` }))
                }
            })
        }
        if (mounted) setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [projectPath])

  const copyImport = (asset: AssetFile) => {
    const varName = asset.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '')
    const capitalized = varName.charAt(0).toUpperCase() + varName.slice(1)
    
    const importStr = `import ${capitalized} from '${asset.relativePath}'`
    navigator.clipboard.writeText(importStr)
    alert(`Copiado: ${importStr}`)
  }

  const handleManualRefresh = async () => {
    setLoading(true)
    const res = await window.electron.scanImages(projectPath)
    if (res.success) setAssets(res.assets)
    setLoading(false)
  }

  const filtered = assets.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
       <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filtrar por nome..."
            style={{ flex: 1, padding: '8px', background: '#252526', border: '1px solid #333', borderRadius: 6, color: '#fff' }}
          />
          <button onClick={handleManualRefresh} style={{ background: '#333', border: 'none', color: '#fff', borderRadius: 6, padding: '0 15px', cursor: 'pointer' }}><VscRefresh /></button>
       </div>

       {loading ? (
           <div style={{ color: '#888', textAlign: 'center', marginTop: 50 }}>Escaneando projeto...</div>
       ) : (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 15, overflowY: 'auto', paddingRight: 5 }}>
               {filtered.map(asset => (
                   <div key={asset.path} style={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                       {/* Preview Area */}
                       <div style={{ height: 120, background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                           {previews[asset.path] ? (
                               <img src={previews[asset.path]} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                           ) : (
                               <VscFileMedia size={32} color="#444" />
                           )}
                           <span style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', padding: '2px 4px', borderRadius: 4 }}>
                               {asset.extension.toUpperCase()}
                           </span>
                       </div>
                       
                       {/* Info Area */}
                       <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
                           <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#e0e0e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }} title={asset.name}>
                               {asset.name}
                           </div>
                           <div style={{ fontSize: '11px', color: '#888', marginBottom: 10 }}>{asset.size}</div>
                           
                           <button 
                             onClick={() => copyImport(asset)}
                             style={{ marginTop: 'auto', width: '100%', background: '#333', border: 'none', color: '#ccc', padding: '6px', borderRadius: 4, cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                           >
                               <VscCopy /> Import
                           </button>
                       </div>
                   </div>
               ))}
               {filtered.length === 0 && <div style={{gridColumn: '1/-1', textAlign: 'center', color: '#666', marginTop: 20}}>Nenhuma imagem encontrada.</div>}
           </div>
       )}
    </div>
  )
}