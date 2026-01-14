import { 
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiNodedotjs, 
  SiAdonisjs, SiNestjs, SiElectron, SiTypescript, SiTailwindcss, 
  SiBootstrap, SiSass, SiDocker, SiFirebase, SiSupabase, 
  SiMongodb, SiPostgresql, SiVite
} from 'react-icons/si'
import type { TechStackItem } from '../types'
import type { ElementType } from 'react'

interface Props {
  stack: TechStackItem[]
}

export function TechStackBadges({ stack }: Props) {
  if (!stack || stack.length === 0) return null

  // Mapa de Configuração (Ícone + Cor + Nome)
  const config: Record<string, { icon: ElementType, color: string, label: string }> = {
    'react': { icon: SiReact, color: '#61DAFB', label: 'React' },
    'react-native': { icon: SiReact, color: '#61DAFB', label: 'React Native' },
    'next': { icon: SiNextdotjs, color: '#ffffff', label: 'Next.js' },
    'vue': { icon: SiVuedotjs, color: '#4FC08D', label: 'Vue' },
    'angular': { icon: SiAngular, color: '#DD0031', label: 'Angular' },
    'node': { icon: SiNodedotjs, color: '#339933', label: 'Node.js' },
    'adonis': { icon: SiAdonisjs, color: '#5A45FF', label: 'Adonis' },
    'nest': { icon: SiNestjs, color: '#E0234E', label: 'NestJS' },
    'electron': { icon: SiElectron, color: '#47848F', label: 'Electron' },
    'typescript': { icon: SiTypescript, color: '#3178C6', label: 'TypeScript' },
    'tailwind': { icon: SiTailwindcss, color: '#06B6D4', label: 'Tailwind' },
    'bootstrap': { icon: SiBootstrap, color: '#7952B3', label: 'Bootstrap' },
    'sass': { icon: SiSass, color: '#CC6699', label: 'Sass' },
    'docker': { icon: SiDocker, color: '#2496ED', label: 'Docker' },
    'firebase': { icon: SiFirebase, color: '#FFCA28', label: 'Firebase' },
    'supabase': { icon: SiSupabase, color: '#3ECF8E', label: 'Supabase' },
    'mongo': { icon: SiMongodb, color: '#47A248', label: 'MongoDB' },
    'postgres': { icon: SiPostgresql, color: '#4169E1', label: 'Postgres' },
    'vite': { icon: SiVite, color: '#646CFF', label: 'Vite' },
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 15 }}>
      {stack.map(tech => {
        const item = config[tech]
        if (!item) return null
        
        const Icon = item.icon

        return (
          <div key={tech} 
            title={item.label}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 6,
              background: `rgba(255,255,255,0.05)`, // Fundo sutil
              border: `1px solid ${item.color}40`, // Borda com a cor da tech (transparente)
              padding: '4px 10px', 
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#e0e0e0',
              cursor: 'default',
              userSelect: 'none'
            }}
          >
            <Icon color={item.color} size={14} />
            <span>{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}