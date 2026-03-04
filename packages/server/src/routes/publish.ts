import { Hono } from 'hono'
import { getDb } from '../db/database.js'
import { renderDocumentToHtml } from '../utils/html-renderer.js'
import type { PageDocument } from '../types.js'

interface PublishedRow {
  slug: string
  document: string
  published_at: string
}

export const publishRouter = new Hono()
export const publishedRouter = new Hono()

publishRouter.post('/', async (c) => {
  const body = await c.req.json<{ slug?: unknown; document?: unknown }>()

  if (!body.slug || typeof body.slug !== 'string') {
    return c.json({ error: '"slug" is required and must be a string' }, 400)
  }
  if (!body.document || typeof body.document !== 'object') {
    return c.json({ error: '"document" is required and must be an object' }, 400)
  }

  const slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const publishedAt = new Date().toISOString()
  const db = getDb()

  db.prepare(
    'INSERT OR REPLACE INTO published_pages (slug, document, published_at) VALUES (?, ?, ?)',
  ).run(slug, JSON.stringify(body.document), publishedAt)

  const baseUrl = c.req.header('x-forwarded-proto')
    ? `${c.req.header('x-forwarded-proto')}://${c.req.header('host')}`
    : `http://${c.req.header('host') ?? 'localhost:3001'}`

  return c.json({
    url: `${baseUrl}/api/published/${slug}`,
    publishedAt,
  })
})

publishedRouter.get('/:slug', (c) => {
  const db = getDb()
  const row = db
    .prepare('SELECT * FROM published_pages WHERE slug = ?')
    .get(c.req.param('slug')) as PublishedRow | undefined

  if (!row) {
    return c.notFound()
  }

  const document = JSON.parse(row.document) as PageDocument
  const html = renderDocumentToHtml(document)

  return c.html(html)
})
