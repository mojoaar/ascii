import { describe, it, expect } from 'vitest';
import { apiError, readJson } from './api';

describe('apiError', () => {
  it('returns stable error shape', async () => {
    const res = apiError('not_found', 'no such font', 404);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: 'no such font', code: 'not_found' });
  });
});

describe('readJson', () => {
  it('parses valid JSON', async () => {
    const req = new Request('http://x', { method: 'POST', body: JSON.stringify({ a: 1 }) });
    const body = await readJson<{ a: number }>(req);
    expect(body.a).toBe(1);
  });

  it('throws on invalid JSON', async () => {
    const req = new Request('http://x', { method: 'POST', body: 'not-json' });
    await expect(readJson(req)).rejects.toThrow();
  });
});
