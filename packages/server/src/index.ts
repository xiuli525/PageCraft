import { serve } from '@hono/node-server'
import { createApp } from './app.js'
import { initDatabase } from './db/database.js'

const PORT = Number(process.env['PORT'] ?? 3001)

initDatabase()

const app = createApp()

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`[PageForge Server] Listening on http://localhost:${info.port}`)
})
