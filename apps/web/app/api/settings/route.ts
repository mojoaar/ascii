import { requireAdmin } from '@/lib/admin-auth';
import { getSettings, setSetting } from '@/lib/settings';
import { apiError } from '@/lib/api';

export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;
  return Response.json({ settings: getSettings() });
}

export async function PUT(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return apiError('invalid_input', 'invalid JSON body');
  }
  for (const [k, v] of Object.entries(body)) {
    if (['date_format', 'clock'].includes(k)) setSetting(k, v);
  }
  return Response.json({ ok: true });
}
