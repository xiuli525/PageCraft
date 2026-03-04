import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import { getDb } from '../db/database.js'
import type { PageDocument } from '../types.js'

interface TemplateRow {
  id: string
  name: string
  document: string
  created_at: string
  updated_at: string
}

export const templatesRouter = new Hono()

templatesRouter.get('/', (c) => {
  const db = getDb()
  const rows = db
    .prepare('SELECT id, name, created_at, updated_at FROM templates ORDER BY created_at DESC')
    .all() as Omit<TemplateRow, 'document'>[]
  return c.json({ templates: rows })
})

templatesRouter.get('/:id', (c) => {
  const db = getDb()
  const row = db.prepare('SELECT * FROM templates WHERE id = ?').get(c.req.param('id')) as
    | TemplateRow
    | undefined

  if (!row) {
    return c.json({ error: 'Template not found' }, 404)
  }

  return c.json({
    ...row,
    document: JSON.parse(row.document) as PageDocument,
  })
})

templatesRouter.post('/', async (c) => {
  const body = await c.req.json<{ name?: unknown; document?: unknown }>()

  if (!body.name || typeof body.name !== 'string') {
    return c.json({ error: '"name" is required and must be a string' }, 400)
  }
  if (!body.document || typeof body.document !== 'object') {
    return c.json({ error: '"document" is required and must be an object' }, 400)
  }

  const id = nanoid()
  const now = new Date().toISOString()
  const db = getDb()

  db.prepare(
    'INSERT INTO templates (id, name, document, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
  ).run(id, body.name, JSON.stringify(body.document), now, now)

  return c.json({ id, name: body.name, created_at: now, updated_at: now }, 201)
})

templatesRouter.put('/:id', async (c) => {
  const db = getDb()
  const existing = db.prepare('SELECT id FROM templates WHERE id = ?').get(c.req.param('id'))

  if (!existing) {
    return c.json({ error: 'Template not found' }, 404)
  }

  const body = await c.req.json<{ name?: unknown; document?: unknown }>()
  const now = new Date().toISOString()
  const id = c.req.param('id')

  if (body.name !== undefined && typeof body.name !== 'string') {
    return c.json({ error: '"name" must be a string' }, 400)
  }

  if (body.document !== undefined) {
    db.prepare(
      'UPDATE templates SET name = COALESCE(?, name), document = ?, updated_at = ? WHERE id = ?',
    ).run(body.name ?? null, JSON.stringify(body.document), now, id)
  } else {
    db.prepare('UPDATE templates SET name = COALESCE(?, name), updated_at = ? WHERE id = ?').run(
      body.name ?? null,
      now,
      id,
    )
  }

  const updated = db.prepare('SELECT * FROM templates WHERE id = ?').get(id) as TemplateRow

  return c.json({
    ...updated,
    document: JSON.parse(updated.document) as PageDocument,
  })
})

templatesRouter.delete('/:id', (c) => {
  const db = getDb()
  const result = db.prepare('DELETE FROM templates WHERE id = ?').run(c.req.param('id'))

  if (result.changes === 0) {
    return c.json({ error: 'Template not found' }, 404)
  }

  return c.json({ success: true })
})
