import figlet from 'figlet';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GenerateOptions } from './types';

const fontPath = process.env.FONT_DIR ?? join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'data', 'fonts');
figlet.defaults({ fontPath });

function normalizeArt(s: string): string {
  return s
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

export async function generate(text: string, opts: GenerateOptions = {}): Promise<string> {
  if (!text) return '';
  const layout = opts.horizontalLayout ?? 'default';
  const vLayout = opts.verticalLayout ?? 'default';
  return new Promise((resolve, reject) => {
    figlet.text(
      text,
      {
        font: opts.font ?? 'Standard',
        width: opts.width,
        horizontalLayout: layout,
        verticalLayout: vLayout,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(normalizeArt(result ?? ''));
      },
    );
  });
}
