import { generate } from '@ascii/core';
import { apiError } from '@/lib/api';
import { getRateLimiter } from '@/lib/ratelimit';
import { recordGeneration } from '@/lib/stats';

export const dynamic = 'force-dynamic';
const rl = getRateLimiter('generate', 120);

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const lim = rl.allow(ip);
  if (!lim.ok) {
    return apiError('rate_limited', 'too many requests', 429);
  }

  let body: { text?: string; font?: string; width?: number; horizontalLayout?: never; verticalLayout?: never };
  try {
    body = await req.json();
  } catch {
    return apiError('invalid_input', 'invalid JSON body');
  }

  const text = (body.text ?? '').trim();
  if (!text) return apiError('invalid_input', 'text is required');

  try {
    const output = await generate(text, {
      font: body.font,
      width: body.width,
      horizontalLayout: body.horizontalLayout,
      verticalLayout: body.verticalLayout,
    });
    recordGeneration('api', body.font ?? 'Standard', body.width ?? null, true, text);
    return Response.json({ output });
  } catch (e) {
    recordGeneration('api', body.font ?? 'Standard', body.width ?? null, false, text);
    console.error(JSON.stringify({ category: 'api', endpoint: 'generate', error: String(e) }));
    return apiError('internal_error', 'generation failed', 500);
  }
}
