import { apiError } from '@/lib/api';
import { isAdminEnabled, verifyAdminToken, createAdminSession, ADMIN_SESSION_COOKIE } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!isAdminEnabled()) return apiError('not_found', 'admin disabled', 404);
  const form = await req.formData();
  const token = String(form.get('token') ?? '');
  if (!verifyAdminToken(token)) return apiError('unauthorized', 'invalid token', 401);
  const { cookie, expiresAt } = createAdminSession();
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const res = Response.json({ ok: true });
  res.headers.set(
    'Set-Cookie',
    `${ADMIN_SESSION_COOKIE}=${cookie}; HttpOnly; Path=/; SameSite=Lax${secure}; Max-Age=${Math.floor((expiresAt - Date.now()) / 1000)}`,
  );
  return res;
}
