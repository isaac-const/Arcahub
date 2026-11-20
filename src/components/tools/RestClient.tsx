import { useState } from 'react'
import { VscLoading, VscPlay, VscRadioTower } from 'react-icons/vsc'

export function RestClient() {
  const [restMethod, setRestMethod] = useState('GET')
  const [restUrl, setRestUrl] = useState('http://localhost:3000')
  const [restBody, setRestBody] = useState('{}')
  const [restResponse, setRestResponse] = useState('')
  const [restStatus, setRestStatus] = useState<number | null>(null)
  const [restLoading, setRestLoading] = useState(false)

  const handleSendRequest = async () => {
      setRestLoading(true); setRestResponse(''); setRestStatus(null)
      try {
          const options: RequestInit = { method: restMethod, headers: { 'Content-Type': 'application/json' } }
          if (restMethod !== 'GET' && restMethod !== 'HEAD') options.body = restBody
          const res = await fetch(restUrl, options)
          setRestStatus(res.status)
          const text = await res.text()
          try { setRestResponse(JSON.stringify(JSON.parse(text), null, 2)) } catch { setRestResponse(text) }
      } catch (e) { setRestResponse('Erro: ' + String(e)) }
      setRestLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 15 }}>
        <div style={{ display: 'flex', gap: 10 }}>
            <select value={restMethod} onChange={e => setRestMethod(e.target.value)} style={{ background: 'var(--card)', color: '#fff', border: '1px solid var(--line)', padding: '10px', borderRadius: 10, fontWeight: 'bold' }}>
                <option value="GET">GET</option><option value="POST">POST</option><option value="PUT">PUT</option><option value="DELETE">DELETE</option>
            </select>
            <input value={restUrl} onChange={e => setRestUrl(e.target.value)} placeholder="URL" style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--line)', color: '#fff', padding: '10px', borderRadius: 10 }} />
            <button onClick={handleSendRequest} disabled={restLoading} style={{ background: 'linear-gradient(135deg, var(--acc) 0%, var(--acc2) 100%)', border: 'none', color: '#fff', padding: '0 20px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>{restLoading ? <VscLoading className="spin" /> : <VscPlay />} Send</button>
        </div>
        
        {restMethod !== 'GET' && restMethod !== 'DELETE' && (
            <textarea value={restBody} onChange={e => setRestBody(e.target.value)} style={{ background: 'var(--bg)', border: '1px solid var(--line)', color: 'var(--ink2)', borderRadius: 10, padding: 10, fontFamily: 'monospace', height: 100, resize: 'none' }} />
        )}
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minHeight: 0 }}>
             {/* CORREÇÃO: Exibindo o Status Code Aqui */}
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ color: 'var(--mut)', fontSize: '12px' }}>Response</label>
                {restStatus && (
                    <span style={{ 
                        fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: 8,
                        background: restStatus >= 200 && restStatus < 300 ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                        color: restStatus >= 200 && restStatus < 300 ? 'var(--ok)' : '#ff6b6b'
                    }}>
                        Status: {restStatus}
                    </span>
                )}
            </div>

            <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10, padding: 10, overflow: 'auto', position: 'relative' }}>
                {restResponse ? <pre style={{ margin: 0, fontFamily: 'Consolas, monospace', fontSize: '13px', color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>{restResponse}</pre>
                : <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--line2)', textAlign: 'center' }}><VscRadioTower size={32} /><p>Aguardando...</p></div>}
            </div>
        </div>
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
}