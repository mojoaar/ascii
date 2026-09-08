import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Font } from './types';

const __dirname = dirname(fileURLToPath(import.meta.url));
// packages/core/src -> repo/data/fonts
const MANIFEST = join(__dirname, '..', '..', '..', 'data', 'fonts', 'fonts.json');

let cache: Font[] | null = null;

export async function listFonts(): Promise<Font[]> {
  if (cache) return cache;
  const raw = await readFile(MANIFEST, 'utf8');
  cache = JSON.parse(raw) as Font[];
  return cache!;
}

export async function getFont(name: string): Promise<Font | undefined> {
  const fonts = await listFonts();
  return fonts.find((f) => f.name.toLowerCase() === name.toLowerCase());
}
