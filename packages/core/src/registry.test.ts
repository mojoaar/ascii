import { describe, it, expect } from 'vitest';
import { listFonts, getFont } from './registry';

describe('registry', () => {
  it('lists fonts with attribution', async () => {
    const fonts = await listFonts();
    expect(fonts.length).toBeGreaterThan(10);
    for (const f of fonts) {
      expect(f.author).toBeTruthy();
      expect(f.license).toBeTruthy();
    }
  });

  it('finds a font case-insensitively', async () => {
    const std = await getFont('standard');
    expect(std?.name.toLowerCase()).toBe('standard');
  });

  it('returns undefined for missing font', async () => {
    expect(await getFont('does-not-exist-xyz')).toBeUndefined();
  });
});
