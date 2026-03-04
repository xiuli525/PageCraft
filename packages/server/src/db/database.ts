import Database from 'better-sqlite3'
import { resolve } from 'node:path'

let db: Database.Database | null = null

export function initDatabase(dbPath?: string): Database.Database {
  const path = dbPath ?? resolve(process.cwd(), 'pageforge.db')
  db = new Database(path)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      document    TEXT NOT NULL,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS published_pages (
      slug          TEXT PRIMARY KEY,
      document      TEXT NOT NULL,
      published_at  TEXT NOT NULL
    );
  `)

  return db
}

export function getDb(): Database.Database {
  if (!db) {
    return initDatabase()
  }
  return db
}
