import { listFonts } from '@ascii/core';

export const dynamic = 'force-dynamic';

export async function GET() {
  const fonts = await listFonts();
  return Response.json({ fonts });
}
