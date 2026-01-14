import { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { FaTerminal } from 'react-icons/fa'

interface Props {
  cwd: string
}

export function TerminalPanel({ cwd }: Props) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputCmd, setInputCmd] = useState('')

  useEffect(() => {
    if (!terminalRef.current) return

    // 1. Configuração do Xterm.js
    const term = new Terminal({
      theme: {
        background: '#0F0F0F',
        foreground: '#CCCCCC',
        cursor: '#61dafb',
        selectionBackground: 'rgba(97, 218, 251, 0.3)',
      },
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      cursorBlink: true,
      convertEol: true,
      disableStdin: true,
      rightClickSelectsWord: true
    })

    const fitAddon = new FitAddon()
    fitAddonRef.current = fitAddon
    term.loadAddon(fitAddon)
    term.open(terminalRef.current)
    
    setTimeout(() => fitAddon.fit(), 50)

    term.writeln(`\x1b[34mArcahub Terminal\x1b[0m (PowerShell)`)
    term.writeln('Selecione texto para copiar (Ctrl+C). Digite abaixo para executar.')

    xtermRef.current = term

    term.attachCustomKeyEventHandler((arg) => {
      if (arg.ctrlKey && arg.code === 'KeyC' && term.hasSelection()) {
        navigator.clipboard.writeText(term.getSelection())
        return false
      }
      return true
    })

    terminalRef.current.addEventListener('contextmenu', async (e) => {
        e.preventDefault()
        if (term.hasSelection()) {
            await navigator.clipboard.writeText(term.getSelection())
            term.clearSelection()
        } else {
            const text = await navigator.clipboard.readText()
            if (text) {
                setInputCmd(prev => prev + text)
                inputRef.current?.focus()
            }
        }
    })

    const handleData = (data: string) => term.write(data)
    window.electron.onTerminalData(handleData)

    const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit()
    })
    resizeObserver.observe(terminalRef.current)

    term.element?.addEventListener('mouseup', () => {
       if (!term.hasSelection()) {
         inputRef.current?.focus()
       }
    })

    return () => {
      window.electron.offTerminalData()
      resizeObserver.disconnect()
      term.dispose()
    }
  }, [])

  useEffect(() => {
    xtermRef.current?.writeln(`\r\n\x1b[33m${cwd}>\x1b[0m `)
  }, [cwd])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCmd.trim()) return
    
    xtermRef.current?.writeln(`$ ${inputCmd}`)
    xtermRef.current?.scrollToBottom()
    
    window.electron.runCommand({ command: inputCmd, cwd })
    setInputCmd('')
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        if (inputRef.current?.selectionStart === inputRef.current?.selectionEnd) {
            e.preventDefault()
            xtermRef.current?.writeln('^C')
            await window.electron.killProcess()
        }
    }
  }

  return (
    <div style={{ background: '#0F0F0F', display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '5px 15px', background: '#1e1e1e', color: '#ccc', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #333' }}>
        <FaTerminal /> Terminal Local
      </div>

      {/* Área do Xterm */}
      <div 
        ref={terminalRef} 
        style={{ flex: 1, overflow: 'hidden', paddingLeft: 5, textAlign: 'left' }} 
      />

      {/* Input de Comando */}
      <form onSubmit={handleSend} style={{ display: 'flex', background: '#1e1e1e', borderTop: '1px solid #333', padding: '5px' }}>
        <span style={{ padding: '0 10px', color: '#61dafb', fontWeight: 'bold', alignSelf: 'center', fontSize: '12px' }}>PS</span>
        <input 
          ref={inputRef}
          value={inputCmd}
          onChange={e => setInputCmd(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Digite o comando..."
          style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontFamily: 'monospace', fontSize: '13px' }}
        />
      </form>
    </div>
  )
}