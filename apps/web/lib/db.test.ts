import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from './db';

beforeAll(() => {
  process.env.DB_PATH = ':memory:';
});

describe('db', () => {
  it('applies schema and can write settings', () => {
    const d = getDb();
    d.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('k', 'v');
    const row = d.prepare('SELECT value FROM settings WHERE key = ?').get('k') as { value: string };
    expect(row.value).toBe('v');
  });

  it('can insert a generation', () => {
    const d = getDb();
    const info = d
      .prepare('INSERT INTO generations (ts, source, font, width, ok, text_hash) VALUES (?,?,?,?,?,?)')
      .run(Date.now(), 'web', 'Standard', 80, 1, 'abc');
    expect(info.changes).toBe(1);
  });
});
