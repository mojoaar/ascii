import { describe, it, expect } from 'vitest';
import { generate } from './generate';

describe('generate', () => {
  it('renders text with the standard font by default', async () => {
    const out = await generate('HI');
    expect(out.split('\n').length).toBeGreaterThan(1);
    expect(out.replace(/\n/g, '')).toMatch(/[#_|\/\\]/);
  });

  it('renders with an explicit font name', async () => {
    const out = await generate('ok', { font: 'Standard' });
    expect(out.length).toBeGreaterThan(0);
  });

  it('respects width by wrapping', async () => {
    const wide = await generate('hello world this is a long string', { width: 10 });
    expect(wide.split('\n').length).toBeGreaterThan(1);
  });

  it('has no trailing whitespace or blank lines', async () => {
    const out = await generate('HI');
    const lines = out.split('\n');
    expect(lines[lines.length - 1]).not.toBe('');
    expect(lines.every((l) => l.trimEnd() === l)).toBe(true);
  });
});
