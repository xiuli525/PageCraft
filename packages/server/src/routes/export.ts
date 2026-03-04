import { Hono } from 'hono'
import { renderDocumentToHtml } from '../utils/html-renderer.js'
import type { PageDocument } from '../types.js'

export const exportRouter = new Hono()

exportRouter.post('/html', async (c) => {
  const body = await c.req.json<{ document?: unknown }>()

  if (!body.document || typeof body.document !== 'object') {
    return c.json({ error: '"document" is required and must be an object' }, 400)
  }

  const document = body.document as PageDocument
  const html = renderDocumentToHtml(document)

  return c.json({ html })
})

exportRouter.post('/json', async (c) => {
  const body = await c.req.json<{ document?: unknown }>()

  if (!body.document || typeof body.document !== 'object') {
    return c.json({ error: '"document" is required and must be an object' }, 400)
  }

  return c.json({ document: body.document })
})
