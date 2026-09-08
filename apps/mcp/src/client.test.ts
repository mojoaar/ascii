import { describe, it, expect } from 'vitest';

describe('client', () => {
  it('constructs', async () => {
    const { api } = await import('./client.js');
    expect(typeof api).toBe('function');
  });
});
