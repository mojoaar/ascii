import { animate } from '@ascii/core';
import { apiError } from '@/lib/api';
import { getRateLimiter, applyRateLimitHeaders } from '@/lib/ratelimit';
import { recordGeneration } from '@/lib/stats';

export const dynamic = 'force-dynamic';
const rl = getRateLimiter('animate', 60);

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const lim = rl.allow(ip);
  if (!lim.ok) return applyRateLimitHeaders(apiError('rate_limited', 'too many requests', 429), lim);

  let body: { text?: string; font?: string; kind?: 'morph' | 'reveal' | 'wave' };
  try {
    body = await req.json();
  } catch {
    return apiError('invalid_input', 'invalid JSON body');
  }
  const text = (body.text ?? '').trim();
  if (!text) return apiError('invalid_input', 'text is required');

  const { frames, kind } = await animate(text, { font: body.font, kind: body.kind ?? 'reveal' });
  recordGeneration('api', body.font ?? 'Standard', null, true, text);
  return applyRateLimitHeaders(Response.json({ frames, kind }), lim);
}
