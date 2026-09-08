import { describe, it, expect, beforeAll } from 'vitest';
import { verifyAdminToken, createAdminSession, verifyAdminSession, revokeAdminSession, isAdminEnabled, requireAdmin, ADMIN_SESSION_COOKIE } from './admin-auth';
import { getDb } from './db';

beforeAll(() => {
  process.env.ADMIN_TOKEN = 'secret-token';
  process.env.DB_PATH = ':memory:';
  getDb();
});

describe('admin-auth', () => {
  it('verifies token constant-time', () => {
    expect(verifyAdminToken('secret-token')).toBe(true);
    expect(verifyAdminToken('wrong')).toBe(false);
  });

  it('creates and verifies a session', () => {
    const { cookie } = createAdminSession();
    expect(verifyAdminSession(cookie)).toBe(true);
    revokeAdminSession(cookie);
    expect(verifyAdminSession(cookie)).toBe(false);
  });

  it('rejects tampered cookie', () => {
    const { cookie } = createAdminSession();
    const parts = cookie.split('.');
    parts[1] = String(Date.now() + 999999);
    expect(verifyAdminSession(parts.join('.'))).toBe(false);
  });

  it('is enabled when token set', () => {
    expect(isAdminEnabled()).toBe(true);
  });
});

describe('requireAdmin', () => {
  it('returns 404 when admin disabled', () => {
    const prev = process.env.ADMIN_TOKEN;
    delete process.env.ADMIN_TOKEN;
    try {
      const r = requireAdmin(new Request('http://x'));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.res.status).toBe(404);
    } finally {
      process.env.ADMIN_TOKEN = prev;
    }
  });

  it('returns 401 without a valid session cookie', () => {
    const r = requireAdmin(new Request('http://x'));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.res.status).toBe(401);
  });

  it('accepts a valid session cookie', () => {
    const { cookie } = createAdminSession();
    const r = requireAdmin(
      new Request('http://x', { headers: { cookie: `${ADMIN_SESSION_COOKIE}=${cookie}` } }),
    );
    expect(r.ok).toBe(true);
  });
});
