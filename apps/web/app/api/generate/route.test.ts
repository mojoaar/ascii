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
});
