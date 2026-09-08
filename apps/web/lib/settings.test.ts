import { describe, it, expect, beforeAll } from 'vitest';
import { getSetting, setSetting } from './settings';
import { getDb } from './db';

beforeAll(() => {
  process.env.DB_PATH = ':memory:';
  getDb();
});

describe('settings', () => {
  it('sets and gets', () => {
    setSetting('date_format', 'iso');
    expect(getSetting('date_format')).toBe('iso');
  });

  it('overwrites on repeat', () => {
    setSetting('clock', '24h');
    setSetting('clock', '12h');
    expect(getSetting('clock')).toBe('12h');
  });
});
