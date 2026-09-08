import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;
  return Response.json({ authenticated: true });
}
