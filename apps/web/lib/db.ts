import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dbPath = process.env.DB_PATH ?? join(process.cwd(), 'data', 'ascii.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  const schema = readFileSync(join(process.cwd(), 'schema.sql'), 'utf8');
  db.exec(schema);
  return db;
}

export interface GenerationRow {
  id: number;
  ts: number;
  source: 'web' | 'api' | 'mcp' | 'cli';
  font: string;
  width: number | null;
  ok: number;
  text_hash: string;
}
