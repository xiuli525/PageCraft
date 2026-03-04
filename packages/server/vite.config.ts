import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        // Node.js builtins
        'http',
        'http2',
        'stream',
        'crypto',
        'path',
        'fs',
        'url',
        'node:path',
        'node:fs',
        'node:url',
        'node:http',
        'node:crypto',
        'node:stream',
        // Dependencies (resolved at runtime from node_modules)
        'better-sqlite3',
        'hono',
        /^hono\//,
        '@hono/node-server',
        'nanoid',
        '@pageforge/core',
      ],
    },
    target: 'node18',
    sourcemap: true,
    minify: false,
  },
})
