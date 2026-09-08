process.env.DB_PATH = ':memory:';

import { describe, it, expect, beforeAll } from 'vitest';
import { recordGeneration, getStats } from './stats';
import { getDb } from './db';

beforeAll(() => {
  getDb();
});

describe('stats', () => {
  it('records generations and reports stats shape', () => {
    recordGeneration('api', 'Standard', 80, true, 'hello world');
    recordGeneration('api', 'Standard', null, false, 'nope');
    recordGeneration('web', 'Big', 40, true, 'abc');

    const s = getStats();
    expect(s.total).toBe(3);
    expect(s.last24h).toBe(3);
    expect(s.bySource).toEqual([
      { source: 'api', c: 2 },
      { source: 'web', c: 1 },
    ]);
    expect(s.byFont).toEqual([
      { font: 'Standard', c: 2 },
      { font: 'Big', c: 1 },
    ]);
  });
});
