import { getDb } from './db';
import type { GenerationRow } from './db';

export function recordGeneration(
  source: GenerationRow['source'],
  font: string,
  width: number | null,
  ok: boolean,
  text: string,
): void {
  getDb()
    .prepare('INSERT INTO generations (ts, source, font, width, ok, text_hash) VALUES (?,?,?,?,?,?)')
    .run(Date.now(), source, font, width, ok ? 1 : 0, hashText(text));
}

export function getStats() {
  const d = getDb();
  const total = (d.prepare('SELECT COUNT(*) AS c FROM generations').get() as { c: number }).c;
  const bySource = d
    .prepare('SELECT source, COUNT(*) AS c FROM generations GROUP BY source')
    .all() as { source: string; c: number }[];
  const byFont = d
    .prepare('SELECT font, COUNT(*) AS c FROM generations GROUP BY font ORDER BY c DESC LIMIT 10')
    .all() as { font: string; c: number }[];
  const last24h = (
    d.prepare('SELECT COUNT(*) AS c FROM generations WHERE ts > ?').get(Date.now() - 86_400_000) as { c: number }
  ).c;
  return { total, bySource, byFont, last24h };
}

function hashText(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0;
  return String(h >>> 0);
}
