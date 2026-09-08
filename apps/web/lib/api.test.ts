import { describe, it, expect } from 'vitest';
import { apiError } from './api';

describe('apiError', () => {
  it('returns stable error shape', async () => {
    const res = apiError('not_found', 'no such font', 404);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: 'no such font', code: 'not_found' });
  });
});
