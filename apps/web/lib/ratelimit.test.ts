import { describe, it, expect } from 'vitest';
import { getRateLimiter, applyRateLimitHeaders } from './ratelimit';

describe('ratelimit', () => {
  it('allows within limit and tracks remaining', () => {
    const rl = getRateLimiter('t', 3, 60_000);
    expect(rl.allow('1.1.1.1')).toMatchObject({ ok: true, limit: 3, remaining: 2 });
    expect(rl.allow('1.1.1.1')).toMatchObject({ ok: true, remaining: 1 });
    expect(rl.allow('1.1.1.1')).toMatchObject({ ok: true, remaining: 0 });
  });

  it('denies beyond limit with retryAfter', () => {
    const rl = getRateLimiter('t', 2, 60_000);
    rl.allow('2.2.2.2');
    rl.allow('2.2.2.2');
    const denied = rl.allow('2.2.2.2');
    expect(denied.ok).toBe(false);
    expect(denied.remaining).toBe(0);
    expect(denied.retryAfter).toBeGreaterThan(0);
  });

  it('opens a new window after windowMs elapses', async () => {
    const rl = getRateLimiter('t', 1, 5);
    expect(rl.allow('4.4.4.4').ok).toBe(true);
    expect(rl.allow('4.4.4.4').ok).toBe(false);
    await new Promise((r) => setTimeout(r, 10));
    expect(rl.allow('4.4.4.4').ok).toBe(true);
  });

  it('sets x-ratelimit headers', () => {
    const rl = getRateLimiter('t', 2, 60_000);
    const res = applyRateLimitHeaders(new Response('x'), rl.allow('5.5.5.5'));
    expect(res.headers.get('x-ratelimit-limit')).toBe('2');
    expect(res.headers.get('x-ratelimit-remaining')).toBe('1');
    expect(res.headers.get('x-ratelimit-reset')).toBeTruthy();
  });
});
