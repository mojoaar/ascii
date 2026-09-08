import { describe, it, expect, beforeAll } from 'vitest';
import { getSetting, setSetting, getSettings } from './settings';
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

  it('returns null for missing key', () => {
    expect(getSetting('does-not-exist')).toBeNull();
  });

  it('lists all settings', () => {
    setSetting('a', '1');
    setSetting('b', '2');
    const all = getSettings();
    expect(all['a']).toBe('1');
    expect(all['b']).toBe('2');
  });
});
