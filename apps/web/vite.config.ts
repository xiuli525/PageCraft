import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@pageforge/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@pageforge/editor': resolve(__dirname, '../../packages/editor/src/index.ts'),
      '@pageforge/components': resolve(__dirname, '../../packages/components/src/index.ts'),
      '@pageforge/renderer': resolve(__dirname, '../../packages/renderer/src/index.ts'),
      '@pageforge/sdk': resolve(__dirname, '../../packages/sdk/src/index.ts'),
    },
  },
})
