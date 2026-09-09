import { generate, listFonts } from '@ascii/core';
import { apiError } from '@/lib/api';
import { getRateLimiter, applyRateLimitHeaders } from '@/lib/ratelimit';
import { recordGeneration } from '@/lib/stats';

export const dynamic = 'force-dynamic';
const rl = getRateLimiter('generate-all', 20);

interface Result {
  name: string;
  output: string;
  author: string;
  license: string;
  copyright: string;
  source: string;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const lim = rl.allow(ip);
  if (!lim.ok) {
    return applyRateLimitHeaders(apiError('rate_limited', 'too many requests', 429), lim);
  }

  let body: {
    text?: string;
    width?: number;
    horizontalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing';
  };
  try {
    body = await req.json();
  } catch {
    return apiError('invalid_input', 'invalid JSON body');
  }

  const text = (body.text ?? '').trim();
  if (!text) return apiError('invalid_input', 'text is required');

  const fonts = await listFonts();
  const results: Result[] = [];
  for (const f of fonts) {
    try {
      const output = await generate(text, {
        font: f.name,
        width: body.width,
        horizontalLayout: body.horizontalLayout,
      });
      results.push({
        name: f.name,
        output,
        author: f.author,
        license: f.license,
        copyright: f.copyright,
        source: f.source,
      });
    } catch {
      // skip fonts that fail to render; the curated set is expected to succeed
    }
  }

  recordGeneration('api', 'all', body.width ?? null, true, text);
  return applyRateLimitHeaders(Response.json({ results }), lim);
}
