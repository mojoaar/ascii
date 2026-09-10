import { describe, it, expect } from 'vitest';
import { parseTlf, renderTlf } from './tlf';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function loadTlf(name: string) {
  const p = join(__dirname, '..', '..', '..', 'data', 'fonts', `${name}.tlf`);
  return readFileSync(p, 'utf8');
}

describe('tlf', () => {
  it('parses a TOIlet font', () => {
    const content = loadTlf('pagga');
    const font = parseTlf(content);
    expect(font.height).toBeGreaterThan(0);
    expect(font.glyphs.has(65)).toBe(true);
  });

  it('renders a single character', () => {
    const content = loadTlf('pagga');
    const font = parseTlf(content);
    const out = renderTlf(font, 'A');
    expect(out.length).toBeGreaterThan(0);
    expect(out.split('\n').length).toBe(font.height);
  });

  it('wraps between whole glyphs by width', () => {
    const content = loadTlf('pagga');
    const font = parseTlf(content);
    const out = renderTlf(font, 'ABCDEFGHIJ', 20);
    expect(out.split('\n').length).toBeGreaterThan(font.height);
  });
});
