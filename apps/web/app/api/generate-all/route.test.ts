process.env.DB_PATH = ':memory:';

import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/generate-all', () => {
  it('generates art for every font', async () => {
    const res = await POST(new Request('http://x/api/generate-all', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: 'hi' }),
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(100);
    expect(body.results[0].output.length).toBeGreaterThan(0);
    expect(body.results[0].name).toBeTruthy();
  });

  it('rejects empty text', async () => {
    const res = await POST(new Request('http://x/api/generate-all', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '' }),
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe('invalid_input');
  });

  it('rejects invalid JSON body', async () => {
    const res = await POST(new Request('http://x/api/generate-all', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe('invalid_input');
  });
});
