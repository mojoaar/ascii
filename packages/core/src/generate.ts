import figlet from 'figlet';
import type { GenerateOptions } from './types';

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
        else resolve(result ?? '');
      },
    );
  });
}
