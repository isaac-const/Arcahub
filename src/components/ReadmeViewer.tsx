import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FaBookOpen } from 'react-icons/fa'
import type { ComponentPropsWithoutRef } from 'react'

interface Props {
  content: string | null
}

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean
}

export function ReadmeViewer({ content }: Props) {
  if (!content) return null

  return (
    <div style={{ marginTop: '30px', background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #333', background: '#252526', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaBookOpen color="#ccc" />
        <h3 style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>README.md</h3>
      </div>
      
      <div className="markdown-body" style={{ padding: '30px', color: '#e0e0e0', lineHeight: '1.6' }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => <h1 style={{ borderBottom: '1px solid #444', paddingBottom: 10, marginBottom: 20 }} {...props} />,
            h2: (props) => <h2 style={{ borderBottom: '1px solid #444', paddingBottom: 8, marginBottom: 15, marginTop: 30 }} {...props} />,
            a: (props) => <a style={{ color: '#58a6ff', textDecoration: 'none' }} {...props} />,
            
            // CORREÇÃO: Removemos 'className' daqui para sumir o erro
            code: ({inline, children, ...props}: CodeProps) => {
              return inline 
                 ? <code style={{ background: '#333', padding: '2px 5px', borderRadius: 4, fontFamily: 'monospace' }} {...props}>{children}</code>
                 : <code style={{ display: 'block', background: '#161b22', padding: 15, borderRadius: 8, overflowX: 'auto', margin: '15px 0' }} {...props}>{children}</code>
            },
            
            blockquote: (props) => <blockquote style={{ borderLeft: '4px solid #444', paddingLeft: 15, color: '#8b949e', margin: '20px 0' }} {...props} />,
            img: (props) => <img style={{ maxWidth: '100%', borderRadius: 6 }} {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}