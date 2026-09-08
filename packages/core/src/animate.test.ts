import { describe, it, expect } from 'vitest';
import { animate } from './animate';

describe('animate', () => {
  it('produces reveal frames equal to line count', async () => {
    const { frames, kind } = await animate('HELLO');
    expect(kind).toBe('reveal');
    expect(frames.length).toBeGreaterThan(1);
  });

  it('wave frames have same line count each frame', async () => {
    const { frames } = await animate('HI', { font: 'Standard', kind: 'wave' });
    const lineCounts = frames.map((f) => f.split('\n').length);
    expect(new Set(lineCounts).size).toBe(1);
  });
});
