import { useState, useEffect } from 'react'
import { VscAdd, VscTrash, VscChevronLeft, VscChevronRight, VscCircleFilled } from 'react-icons/vsc'
import type { KanbanTask, KanbanStatus } from '../../types'

interface Props {
  projectPath: string
}

// --- 1. COMPONENTE COLUMN EXTRAÍDO (FORA DA FUNÇÃO PRINCIPAL) ---
interface ColumnProps {
    title: string
    status: KanbanStatus
    color: string
    tasks: KanbanTask[]
    onMove: (id: string, dir: 'next' | 'prev') => void
    onDelete: (id: string) => void
}

const Column = ({ title, status, color, tasks, onMove, onDelete }: ColumnProps) => (
    <div style={{ flex: 1, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 15, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 'bold', color: '#e0e0e0' }}>
        <VscCircleFilled color={color} /> {title} 
        <span style={{ background: '#333', padding: '2px 8px', borderRadius: 10, fontSize: '11px', color: '#aaa' }}>
          {tasks.length}
        </span>
      </div>
      
      <div style={{ flex: 1, padding: 10, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tasks.map(t => (
          <div key={t.id} style={{ background: '#252526', padding: 12, borderRadius: 6, border: '1px solid #333', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            <div style={{ marginBottom: 10, fontSize: '14px', lineHeight: '1.4' }}>{t.text}</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', gap: 5 }}>
                 {status !== 'todo' && <button onClick={() => onMove(t.id, 'prev')} title="Voltar" style={{ background: '#333', border: 'none', color: '#ccc', borderRadius: 4, padding: 4, cursor: 'pointer' }}><VscChevronLeft /></button>}
                 {status !== 'done' && <button onClick={() => onMove(t.id, 'next')} title="Avançar" style={{ background: '#333', border: 'none', color: '#ccc', borderRadius: 4, padding: 4, cursor: 'pointer' }}><VscChevronRight /></button>}
               </div>
               <button onClick={() => onDelete(t.id)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}><VscTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
)

// --- 2. COMPONENTE PRINCIPAL ---
export function KanbanBoard({ projectPath }: Props) {
  const [tasks, setTasks] = useState<KanbanTask[]>([])
  const [newTask, setNewTask] = useState('')

  // Lógica simplificada: define e chama dentro do efeito
  useEffect(() => {
    let mounted = true;
    const load = async () => {
        const data = await window.electron.kanbanRead(projectPath)
        if (mounted) setTasks(data.tasks || [])
    }
    load()
    return () => { mounted = false }
  }, [projectPath])

  const saveTasks = async (updatedTasks: KanbanTask[]) => {
    setTasks(updatedTasks)
    await window.electron.kanbanSave(projectPath, { tasks: updatedTasks })
  }

  const handleAdd = () => {
    if (!newTask.trim()) return
    const task: KanbanTask = {
      id: crypto.randomUUID(),
      text: newTask,
      status: 'todo',
      createdAt: new Date().toISOString()
    }
    saveTasks([...tasks, task])
    setNewTask('')
  }

  const moveTask = (id: string, direction: 'next' | 'prev') => {
    const updated = tasks.map(t => {
      if (t.id !== id) return t
      let newStatus: KanbanStatus = t.status
      if (t.status === 'todo') newStatus = direction === 'next' ? 'doing' : 'todo'
      else if (t.status === 'doing') newStatus = direction === 'next' ? 'done' : 'todo'
      else if (t.status === 'done') newStatus = direction === 'prev' ? 'doing' : 'done'
      return { ...t, status: newStatus }
    })
    saveTasks(updated)
  }

  const deleteTask = (id: string) => {
    if (confirm('Remover tarefa?')) {
      saveTasks(tasks.filter(t => t.id !== id))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 20 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <input 
          value={newTask} 
          onChange={e => setNewTask(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Adicionar nova tarefa..." 
          style={{ flex: 1, padding: '10px', borderRadius: 6, border: '1px solid #333', background: '#1e1e1e', color: '#fff', outline: 'none' }}
        />
        <button onClick={handleAdd} style={{ padding: '0 20px', background: '#007acc', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 5 }}>
          <VscAdd /> Adicionar
        </button>
      </div>

      <div style={{ display: 'flex', gap: 15, flex: 1, minHeight: 0 }}>
        <Column 
            title="A Fazer" status="todo" color="#ff6b6b" 
            tasks={tasks.filter(t => t.status === 'todo')} 
            onMove={moveTask} onDelete={deleteTask} 
        />
        <Column 
            title="Fazendo" status="doing" color="#f1c40f" 
            tasks={tasks.filter(t => t.status === 'doing')} 
            onMove={moveTask} onDelete={deleteTask} 
        />
        <Column 
            title="Feito" status="done" color="#2ecc71" 
            tasks={tasks.filter(t => t.status === 'done')} 
            onMove={moveTask} onDelete={deleteTask} 
        />
      </div>
    </div>
  )
}