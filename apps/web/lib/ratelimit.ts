interface Bucket {
  windowStart: number;
  count: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export function getRateLimiter(endpoint: string, limit = 60, windowMs = 60_000) {
  return {
    allow(ip: string): RateLimitResult {
      const key = `${endpoint}:${ip}`;
      const now = Date.now();
      const b = buckets.get(key);
      if (!b || now - b.windowStart > windowMs) {
        buckets.set(key, { windowStart: now, count: 1 });
        return { ok: true, limit, remaining: limit - 1, reset: Math.ceil((now + windowMs) / 1000) };
      }
      b.count += 1;
      const remaining = Math.max(0, limit - b.count);
      const ok = b.count <= limit;
      const reset = Math.ceil((b.windowStart + windowMs) / 1000);
      return { ok, limit, remaining, reset, retryAfter: ok ? undefined : Math.ceil((b.windowStart + windowMs - now) / 1000) };
    },
  };
}

export function applyRateLimitHeaders(res: Response, r: RateLimitResult): Response {
  res.headers.set('x-ratelimit-limit', String(r.limit));
  res.headers.set('x-ratelimit-remaining', String(r.remaining));
  res.headers.set('x-ratelimit-reset', String(r.reset));
  if (r.retryAfter) res.headers.set('retry-after', String(r.retryAfter));
  return res;
}
