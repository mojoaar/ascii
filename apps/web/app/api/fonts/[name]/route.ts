import { getFont } from '@ascii/core';
import { apiError } from '@/lib/api';
import { findUploadedFont } from '@/lib/uploaded-fonts';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const uploaded = findUploadedFont(name);
  const font = uploaded ?? (await getFont(name));
  if (!font) return apiError('not_found', `font not found: ${name}`, 404);
  return Response.json({ font });
}
