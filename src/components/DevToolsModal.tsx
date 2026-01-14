import { useState } from 'react'
import { VscGithub, VscClose, VscTrash, VscRadioTower } from 'react-icons/vsc'
import { FaDocker, FaSkull } from 'react-icons/fa'
import type { ElementType } from 'react'

// Importando as ferramentas separadas
import { GitPainter } from './tools/GitPainter'
import { PortHunter } from './tools/PortHunter'
import { DockerPanel } from './tools/DockerPanel'
import { BlackHole } from './tools/BlackHole'
import { RestClient } from './tools/RestClient'

// Componente do Botão da Sidebar
const TabButton = ({ id, activeTab, onClick, icon: Icon, label }: { id: string, activeTab: string, onClick: (id: string) => void, icon: ElementType, label: string }) => (
    <button 
        onClick={() => onClick(id)}
        style={{ 
            width: '100%', padding: '12px 20px', 
            background: activeTab === id ? '#252526' : 'transparent', 
            border: 'none', color: activeTab === id ? '#fff' : '#666', 
            cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, 
            borderLeft: activeTab === id ? '3px solid #61dafb' : '3px solid transparent',
            transition: '0.2s', fontSize: '13px'
        }}
    >
        <Icon size={16} /> {label}
    </button>
)

interface Props {
  onClose: () => void
}

export function DevToolsModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState('git-painter')

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
        
        <div style={{ width: '900px', height: '650px', background: '#1e1e1e', border: '1px solid #333', borderRadius: '16px', display: 'flex', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            
            {/* Sidebar */}
            <div style={{ width: '220px', background: '#121212', borderRight: '1px solid #333', padding: '20px 0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0 20px 20px 20px', color: '#888', fontSize: '11px', fontWeight: 'bold', letterSpacing: 1 }}>DEV TOOLS SUITE</div>
                
                <TabButton id="git-painter" activeTab={activeTab} onClick={setActiveTab} icon={VscGithub} label="Git Painter" />
                <TabButton id="black-hole" activeTab={activeTab} onClick={setActiveTab} icon={VscTrash} label="The Black Hole" />
                <TabButton id="port-hunter" activeTab={activeTab} onClick={setActiveTab} icon={FaSkull} label="Port Hunter" />
                <TabButton id="docker" activeTab={activeTab} onClick={setActiveTab} icon={FaDocker} label="Docker Panel" />
                
                <div style={{ margin: '10px 20px', height: 1, background: '#333' }} />
                
                <TabButton id="rest-client" activeTab={activeTab} onClick={setActiveTab} icon={VscRadioTower} label="REST Client" />
            </div>

            {/* Conteúdo */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#181818' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: 10, color: '#e0e0e0' }}>
                        {activeTab === 'git-painter' && <><VscGithub /> Git Painter</>}
                        {activeTab === 'black-hole' && <><VscTrash /> The Black Hole</>}
                        {activeTab === 'port-hunter' && <><FaSkull /> Port Hunter</>}
                        {activeTab === 'docker' && <><FaDocker /> Docker Quick-Panel</>}
                        {activeTab === 'rest-client' && <><VscRadioTower /> REST Client</>}
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}><VscClose size={20}/></button>
                </div>

                <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                    {activeTab === 'git-painter' && <GitPainter />}
                    {activeTab === 'black-hole' && <BlackHole />}
                    {activeTab === 'port-hunter' && <PortHunter />}
                    {activeTab === 'docker' && <DockerPanel />}
                    {activeTab === 'rest-client' && <RestClient />}
                </div>
            </div>
        </div>
    </div>
  )
}