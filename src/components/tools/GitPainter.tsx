import { useState, useMemo } from 'react'
import { VscFolderOpened } from 'react-icons/vsc'

export function GitPainter() {
  const [painterPath, setPainterPath] = useState('')
  const [startDate, setStartDate] = useState('2023-01-01')
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [intensity, setIntensity] = useState(0.7)
  const [weekendFactor, setWeekendFactor] = useState(0.1)
  const [painterLoading, setPainterLoading] = useState(false)

  const previewData = useMemo(() => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setDate(end.getDate() + 1)
    const simulated: { level: number }[] = []
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return []

    const loopDate = new Date(start)
    let safeGuard = 0
    let i = 0 
    
    while (loopDate < end && safeGuard < 1000) { 
        const dayOfWeek = loopDate.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        let chance = intensity
        if (isWeekend) chance *= weekendFactor
        let level = 0
        const seed = i * 9301 + 49297;
        const pseudoRandom = (Math.sin(seed) * 10000) - Math.floor(Math.sin(seed) * 10000);

        if (pseudoRandom <= chance) {
            const pseudoRandom2 = (Math.cos(seed) * 10000) - Math.floor(Math.cos(seed) * 10000);
            const commits = Math.floor(pseudoRandom2 * 8) + 1
            if (commits <= 2) level = 1
            else if (commits <= 4) level = 2
            else if (commits <= 6) level = 3
            else level = 4
        }
        simulated.push({ level })
        loopDate.setDate(loopDate.getDate() + 1)
        safeGuard++
        i++
    }
    return simulated
  }, [startDate, endDate, intensity, weekendFactor])

  const handleRunPainter = async () => {
    if (!painterPath) return alert('Selecione um repositório!')
    setPainterLoading(true)
    let res = await window.electron.gitPaint({
        folderPath: painterPath, startDate, endDate, intensity, weekendFactor, minCommits: 1, maxCommits: 8
    })
    if (!res.success && res.error === 'NO_GIT') {
        if (confirm('Pasta sem Git. Inicializar agora?')) {
            const initSuccess = await window.electron.gitInit(painterPath)
            if (initSuccess) {
                res = await window.electron.gitPaint({
                    folderPath: painterPath, startDate, endDate, intensity, weekendFactor, minCommits: 1, maxCommits: 8
                })
            } else alert('Erro ao inicializar Git.')
        } else { setPainterLoading(false); return }
    }
    setPainterLoading(false)
    if (res.success) alert(res.message)
    else if (res.error !== 'NO_GIT') alert('Erro: ' + res.error)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15, fontSize: '13px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', padding: '10px', background: '#0d1117', borderRadius: '6px', border: '1px solid #30363d', maxHeight: '120px', overflowY: 'hidden', overflowX: 'auto' }}>
            {previewData.map((day, i) => {
                let bg = '#161b22'; if (day.level === 1) bg = '#0e4429'; if (day.level === 2) bg = '#006d32'; if (day.level === 3) bg = '#26a641'; if (day.level === 4) bg = '#39d353';
                return <div key={i} style={{ width: '10px', height: '10px', background: bg, borderRadius: '2px' }} />
            })}
        </div>
        <div style={{display:'flex', gap:10}}><input value={painterPath} readOnly placeholder="Selecione um repo..." style={{flex:1, padding:8, background:'#252526', border:'1px solid #333', borderRadius:6, color:'#fff'}} /><button onClick={async () => {const p = await window.electron.selectFolder(); if(p) setPainterPath(p)}} style={{padding:'0 15px', background:'#333', border:'none', borderRadius:6, color:'#fff'}}><VscFolderOpened /></button></div>
        <div style={{ display: 'flex', gap: 20 }}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{flex:1, padding:8, background:'#252526', border:'1px solid #333', borderRadius:6, color:'#fff'}} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{flex:1, padding:8, background:'#252526', border:'1px solid #333', borderRadius:6, color:'#fff'}} />
        </div>
        <div><label style={{color:'#aaa'}}>Intensidade: {Math.round(intensity * 100)}%</label><input type="range" min="0" max="1" step="0.05" value={intensity} onChange={e => setIntensity(parseFloat(e.target.value))} style={{width:'100%'}} /></div>
        <div><label style={{color:'#aaa'}}>Fator Fim de Semana: {Math.round(weekendFactor * 100)}%</label><input type="range" min="0" max="1" step="0.05" value={weekendFactor} onChange={e => setWeekendFactor(parseFloat(e.target.value))} style={{width:'100%'}} /></div>
        <button onClick={handleRunPainter} disabled={painterLoading} style={{marginTop:10, padding:12, background:'#007acc', border:'none', borderRadius:6, color:'#fff', fontWeight:'bold', cursor:'pointer'}}>{painterLoading ? 'Gerando...' : 'Pintar'}</button>
    </div>
  )
}