interface Bucket {
  windowStart: number;
  count: number;
}

const buckets = new Map<string, Bucket>();

export function getRateLimiter(endpoint: string, limit = 60, windowMs = 60_000) {
  return {
    allow(ip: string) {
      const key = `${endpoint}:${ip}`;
      const now = Date.now();
      const b = buckets.get(key);
      if (!b || now - b.windowStart > windowMs) {
        buckets.set(key, { windowStart: now, count: 1 });
        return { ok: true, limit, remaining: limit - 1 };
      }
      b.count += 1;
      const remaining = Math.max(0, limit - b.count);
      const ok = b.count <= limit;
      return { ok, limit, remaining, retryAfter: ok ? undefined : Math.ceil((b.windowStart + windowMs - now) / 1000) };
    },
  };
}
