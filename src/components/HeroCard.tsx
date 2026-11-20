import { motion } from 'framer-motion'
import { VscVscode, VscPlay, VscBeaker, VscTerminal, VscStarFull, VscStarEmpty } from 'react-icons/vsc'
import { FaCube } from 'react-icons/fa'
import { BaseCard } from './BaseCard'
import type { PackageJsonData } from '../types'
import { TechStackBadges } from './TechStackBadges'
import type { TechStackItem } from '../types' 

interface Props {
  path: string
  packageData: PackageJsonData | null
  onOpenCode: () => void
  onRunScript: (scriptName: string) => void
  onToggleTerminal: () => void
  isTerminalOpen: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  stack: TechStackItem[] 
}

export function HeroCard({ 
  path, packageData, onOpenCode, onRunScript, 
  onToggleTerminal, isTerminalOpen, isFavorite, onToggleFavorite, stack
}: Props) {
  const projectName = packageData?.name || path.split('/').pop() || 'Projeto'
  const description = packageData?.description || `Caminho: ${path}`
  
  const hasDev = packageData?.scripts?.['dev']
  const hasBuild = packageData?.scripts?.['build']

  // Botões do Cabeçalho com Motion
  const HeaderActions = (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      
      <motion.button 
        whileHover={{ scale: 1.2, rotate: 15 }}
        whileTap={{ scale: 0.8 }}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
        title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isFavorite ? '#ffd700' : 'var(--line2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5 }}
      >
        {isFavorite ? <VscStarFull size={20} /> : <VscStarEmpty size={20} />}
      </motion.button>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 5px' }} />

      <motion.button 
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleTerminal}
        title={isTerminalOpen ? "Ocultar Terminal" : "Mostrar Terminal"}
        style={{ 
          background: isTerminalOpen ? 'rgba(255,255,255,0.1)' : 'transparent', 
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0 12px',
          height: '32px', display: 'flex', alignItems: 'center', gap: 6,
          cursor: 'pointer', color: 'var(--ink)', fontSize: '12px', fontWeight: 500
        }}
      >
        <VscTerminal size={16} /> 
        <span>Terminal</span>
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.05, boxShadow: '0 4px 10px rgba(91,140,255,0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenCode}
        title="Abrir no VS Code"
        style={{ 
          background: 'linear-gradient(135deg, var(--acc) 0%, var(--acc2) 100%)', border: 'none', borderRadius: '10px', padding: '0 12px', 
          height: '32px', display: 'flex', alignItems: 'center', gap: 6, 
          cursor: 'pointer', color: '#fff', fontWeight: 600, fontSize: '12px',
          boxShadow: '0 2px 5px rgba(91,140,255,0.4)'
        }}
      >
        <VscVscode size={16} /> 
        <span>VS Code</span>
      </motion.button>
    </div>
  )

  return (
    <BaseCard 
      title={projectName} 
      icon={<FaCube size={18} />} 
      action={HeaderActions}
      style={{
        background: 'linear-gradient(135deg, #1e252e 0%, var(--bg) 100%)',
        border: '1px solid color-mix(in oklab, var(--acc) 40%, transparent)',
        boxShadow: '0 8px 32px rgba(91,140,255, 0.1)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <p style={{ margin: 0, color: 'var(--mut3)', fontSize: '14px', lineHeight: 1.6 }}>
          {description}
        </p>
        
        <TechStackBadges stack={stack} />

        {(hasDev || hasBuild) && (
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
             {hasDev && (
                <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(40, 167, 69, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRunScript('dev')} 
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(40, 167, 69, 0.3)', background: 'rgba(40, 167, 69, 0.1)', color: 'var(--ok)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                    <VscPlay size={14} /> Run Dev
                </motion.button>
            )}
             {hasBuild && (
                <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 159, 67, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRunScript('build')} 
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255, 159, 67, 0.3)', background: 'rgba(255, 159, 67, 0.1)', color: '#ff9f43', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                    <VscBeaker size={14} /> Build
                </motion.button>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  )
}