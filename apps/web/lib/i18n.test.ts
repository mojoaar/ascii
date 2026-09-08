import { describe, it, expect } from 'vitest';
import { en } from '@/messages/en';
import { da } from '@/messages/da';

describe('i18n dictionaries', () => {
  it('da covers every en key', () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(da[key], `missing da key ${key}`).toBeTruthy();
    }
  });
});
