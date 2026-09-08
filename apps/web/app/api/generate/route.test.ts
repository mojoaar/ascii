process.env.DB_PATH = ':memory:';

import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/generate', () => {
  it('generates art', async () => {
    const res = await POST(new Request('http://x/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: 'hi', font: 'Standard' }),
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.output.length).toBeGreaterThan(0);
  });

  it('rejects empty text', async () => {
    const res = await POST(new Request('http://x/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '' }),
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe('invalid_input');
  });

  it('rejects invalid JSON body', async () => {
    const res = await POST(new Request('http://x/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe('invalid_input');
  });

  it('emits rate limit headers on success', async () => {
    const res = await POST(new Request('http://x/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.0.0.9' },
      body: JSON.stringify({ text: 'hi', font: 'Standard' }),
    }));
    expect(res.status).toBe(200);
    expect(res.headers.get('x-ratelimit-limit')).toBe('120');
    expect(res.headers.get('x-ratelimit-remaining')).toBeTruthy();
    expect(res.headers.get('x-ratelimit-reset')).toBeTruthy();
  });
});
