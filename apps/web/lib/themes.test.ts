import { describe, it, expect } from 'vitest';
import { isValidTheme, nextTheme } from './themes';

describe('themes', () => {
  it('validates theme names', () => {
    expect(isValidTheme('dracula')).toBe(true);
    expect(isValidTheme('nope')).toBe(false);
  });
  it('cycles themes', () => {
    expect(nextTheme('cyberpunk')).toBe('terminal');
  });
});
