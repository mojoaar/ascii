import { createHmac, createHash, timingSafeEqual, randomUUID } from 'node:crypto';
import { getDb } from './db';

export const ADMIN_SESSION_COOKIE = 'ascii_admin_session';
const SESSION_PURPOSE = 'ascii-admin-session';

export function isAdminEnabled(): boolean {
  return Boolean(process.env.ADMIN_TOKEN);
}

function signingKey(token: string): Buffer {
  return createHash('sha256').update(SESSION_PURPOSE).update('\0').update(token).digest();
}

function sign(payload: string, token: string): string {
  return createHmac('sha256', signingKey(token)).update(payload).digest('hex');
}

export function verifyAdminToken(input: string): boolean {
  const token = process.env.ADMIN_TOKEN ?? '';
  if (!token || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createAdminSession(): { cookie: string; expiresAt: number } {
  const token = process.env.ADMIN_TOKEN ?? '';
  const ttl = Number(process.env.ADMIN_SESSION_TTL_SECONDS ?? 28800);
  const expiresAt = Date.now() + ttl * 1000;
  const tokenId = randomUUID();
  getDb().prepare('INSERT OR REPLACE INTO admin_sessions (token, expires_at) VALUES (?,?)').run(tokenId, expiresAt);
  const signed = `${tokenId}.${expiresAt}.${sign(`${tokenId}.${expiresAt}`, token)}`;
  return { cookie: signed, expiresAt };
}

export function verifyAdminSession(cookie: string | null): boolean {
  const token = process.env.ADMIN_TOKEN ?? '';
  if (!token || !cookie) return false;
  const [tokenId, expStr, sig] = cookie.split('.');
  if (!tokenId || !expStr || !sig) return false;
  const expected = sign(`${tokenId}.${expStr}`, token);
  if (sig !== expected) return false;
  const expiresAt = Number(expStr);
  if (Date.now() > expiresAt) return false;
  const row = getDb().prepare('SELECT token FROM admin_sessions WHERE token = ?').get(tokenId);
  return Boolean(row);
}

export function revokeAdminSession(cookie: string): void {
  const tokenId = cookie.split('.')[0];
  if (tokenId) getDb().prepare('DELETE FROM admin_sessions WHERE token = ?').run(tokenId);
}

export function requireAdmin(req: Request): { ok: true } | { ok: false; res: Response } {
  if (!isAdminEnabled()) return { ok: false, res: Response.json({ error: 'not found', code: 'not_found' }, { status: 404 }) };
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  const value = match?.slice(ADMIN_SESSION_COOKIE.length + 1);
  if (!verifyAdminSession(value ?? null)) {
    return { ok: false, res: Response.json({ error: 'unauthorized', code: 'unauthorized' }, { status: 401 }) };
  }
  return { ok: true };
}
