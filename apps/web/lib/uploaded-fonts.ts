import type { Font } from '@ascii/core';
import { getDb } from './db';

interface UploadedFontRow {
  name: string;
  author: string;
  source: string;
  license: string;
}

function toFont(row: UploadedFontRow): Font {
  return {
    name: row.name,
    author: row.author,
    source: row.source,
    license: row.license,
    copyright: '',
  };
}

export function uploadedFonts(): Font[] {
  const rows = getDb()
    .prepare('SELECT name, author, source, license FROM fonts')
    .all() as UploadedFontRow[];
  return rows.map(toFont);
}

export function findUploadedFont(name: string): Font | undefined {
  const row = getDb()
    .prepare('SELECT name, author, source, license FROM fonts WHERE lower(name) = lower(?)')
    .get(name) as UploadedFontRow | undefined;
  return row ? toFont(row) : undefined;
}

export function mergeFonts(curated: Font[], uploaded: Font[]): Font[] {
  const byName = new Map<string, Font>();
  for (const f of curated) byName.set(f.name.toLowerCase(), f);
  for (const f of uploaded) byName.set(f.name.toLowerCase(), f);
  return [...byName.values()];
}
