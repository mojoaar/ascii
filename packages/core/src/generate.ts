import figlet from 'figlet';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GenerateOptions } from './types';
import { getFont } from './registry';

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
  const fontName = opts.font ?? 'Standard';
  const meta = await getFont(fontName);

  if (meta?.format === 'tlf') {
    const [{ readFile }, { parseTlf, renderTlf }] = await Promise.all([
      import('node:fs/promises'),
      import('./tlf'),
    ]);
    const content = await readFile(join(fontPath, `${fontName}.tlf`), 'utf8');
    return normalizeArt(renderTlf(parseTlf(content), text, opts.width));
  }

  const layout = opts.horizontalLayout ?? 'default';
  const vLayout = opts.verticalLayout ?? 'default';
  return new Promise((resolve, reject) => {
    figlet.text(
      text,
      {
        font: fontName,
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
