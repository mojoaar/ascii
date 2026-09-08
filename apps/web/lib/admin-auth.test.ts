import { describe, it, expect, beforeAll } from 'vitest';
import { verifyAdminToken, createAdminSession, verifyAdminSession, revokeAdminSession, isAdminEnabled } from './admin-auth';
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
