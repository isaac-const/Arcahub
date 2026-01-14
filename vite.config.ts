import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        // Aponta para o nosso arquivo main.ts na pasta electron
        entry: 'electron/main.ts',
      },
      preload: {
        // Aponta para o preload
        input: 'electron/preload.ts',
      },
      renderer: {}, // Habilita funcionalidades no processo de renderização
    }),
  ],
  resolve: {
    alias: {
      // Isso ajuda a importar coisas sem ficar fazendo "../../../"
      '@': path.resolve(__dirname, './src'),
    },
  },
})