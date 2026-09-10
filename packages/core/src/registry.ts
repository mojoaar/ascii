import type { Font } from './types';

let cache: Font[] | null = null;

export async function listFonts(): Promise<Font[]> {
  if (cache) return cache;
  const { readFile } = await import('node:fs/promises');
  const { join, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  // packages/core/src -> repo/data/fonts
  const MANIFEST = process.env.FONTS_MANIFEST ?? join(__dirname, '..', '..', '..', 'data', 'fonts', 'fonts.json');
  const raw = await readFile(/*turbopackIgnore: true*/ MANIFEST, 'utf8');
  cache = JSON.parse(raw) as Font[];
  return cache!;
}

export async function getFont(name: string): Promise<Font | undefined> {
  const fonts = await listFonts();
  return fonts.find((f) => f.name.toLowerCase() === name.toLowerCase());
}
