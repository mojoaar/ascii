import { ADMIN_SESSION_COOKIE, revokeAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  if (match) revokeAdminSession(match.slice(ADMIN_SESSION_COOKIE.length + 1));
  const res = Response.json({ ok: true });
  res.headers.set('Set-Cookie', `${ADMIN_SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
  return res;
}
