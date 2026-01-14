import { useState } from 'react'
import { FaGlobe, FaFileAlt, FaTrash, FaPlus } from 'react-icons/fa'
import type { Asset } from '../types'

interface Props {
  assets: Asset[]
  onAdd: (name: string, value: string) => void
  onDelete: (name: string) => void
  onOpen: (value: string) => void
}

export function AssetSection({ assets, onAdd, onDelete, onOpen }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [val, setVal] = useState('')

  const handleSave = () => {
    onAdd(name, val)
    setName(''); setVal(''); setShowForm(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>📚 Referências <span style={{fontSize: '14px', color: '#555', fontWeight: 'normal'}}>({assets.length})</span></h3>
        <button onClick={() => setShowForm(!showForm)} 
          style={{ background: showForm ? '#333' : '#444', border: 'none', padding: '8px 16px', color: '#fff', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          {showForm ? 'Cancelar' : <><FaPlus size={12}/> Adicionar</>}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#1e1e1e', padding: '20px', marginBottom: '30px', borderRadius: '12px', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <h4 style={{margin: '0 0 15px 0'}}>Nova Referência</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '15px' }}>
            <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} style={{ padding: '12px', background: '#121212', border: '1px solid #444', color: '#fff', borderRadius: '6px' }} />
            <input placeholder="URL ou Caminho" value={val} onChange={e => setVal(e.target.value)} style={{ padding: '12px', background: '#121212', border: '1px solid #444', color: '#fff', borderRadius: '6px' }} />
            <button onClick={handleSave} style={{ background: '#61dafb', color: '#000', border: 'none', padding: '0 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {assets.map((asset, idx) => (
          <div key={idx} onClick={() => onOpen(asset.value)}
            style={{ background: '#1e1e1e', padding: '20px', borderRadius: '12px', border: '1px solid #333', cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = '#555'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#333'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              <div style={{ background: asset.type === 'link' ? 'rgba(97, 218, 251, 0.1)' : 'rgba(255, 159, 67, 0.1)', padding: 10, borderRadius: 8, color: asset.type === 'link' ? '#61dafb' : '#ff9f43' }}>
                {asset.type === 'link' ? <FaGlobe size={20} /> : <FaFileAlt size={20} />}
              </div>
              <span style={{ fontWeight: 600, fontSize: '16px' }}>{asset.name}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingLeft: 5 }}>{asset.value}</div>
            <button onClick={(e) => { e.stopPropagation(); onDelete(asset.name) }}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#444', padding: 5 }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      {assets.length === 0 && !showForm && <div style={{ marginTop: 40, padding: '60px', textAlign: 'center', color: '#444', border: '2px dashed #2a2a2a', borderRadius: '12px' }}><p>Nenhuma referência cadastrada.</p></div>}
    </div>
  )
}