import { describe, it, expect } from 'vitest';
import { toAnsi } from './ansi';

describe('toAnsi', () => {
  it('wraps output in true-color escape codes', () => {
    const out = toAnsi('AB\nCD', { primary: [0, 255, 0] });
    expect(out).toContain('\x1b[38;2;0;255;0m');
    expect(out).toContain('\x1b[0m');
  });

  it('applies a gradient across lines', () => {
    const out = toAnsi('a\nb\nc', { primary: [255, 0, 0], secondary: [0, 0, 255] });
    expect(out.split('\x1b[38;2;').length).toBeGreaterThan(1);
  });
});
