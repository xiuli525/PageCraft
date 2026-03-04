import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { templatesRouter } from './routes/templates.js'
import { exportRouter } from './routes/export.js'
import { publishRouter, publishedRouter } from './routes/publish.js'

export function createApp(): Hono {
  const app = new Hono()

  app.use('*', logger())
  app.use('*', cors())

  app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

  app.route('/api/templates', templatesRouter)
  app.route('/api/export', exportRouter)
  app.route('/api/publish', publishRouter)
  app.route('/api/published', publishedRouter)

  app.notFound((c) => c.json({ error: 'Not found' }, 404))

  app.onError((err, c) => {
    console.error('[PageForge Server] Unhandled error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  })

  return app
}
