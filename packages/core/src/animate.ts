import { generate } from './generate';
import type { AnimationKind } from './types';

export async function animate(
  text: string,
  opts: { font?: string; kind?: AnimationKind } = {},
): Promise<{ frames: string[]; kind: AnimationKind }> {
  const kind = opts.kind ?? 'reveal';
  const art = await generate(text, { font: opts.font });
  if (kind === 'reveal') {
    const lines = art.split('\n');
    return { frames: lines.map((_, i) => lines.slice(0, i + 1).join('\n')), kind };
  }
  if (kind === 'wave') {
    const lines = art.split('\n');
    const frames = lines.map((_, offset) => {
      return lines.map((l, i) => (i % 2 === offset % 2 ? l : ' '.repeat(l.length))).join('\n');
    });
    return { frames, kind };
  }
  // morph: cycle through a curated related-font group
  const group = ['Standard', 'Big', 'Slant', 'Small'];
  const frames = await Promise.all(group.map((f) => generate(text, { font: f })));
  return { frames, kind: 'morph' };
}
