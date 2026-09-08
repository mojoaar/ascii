process.env.DB_PATH = ':memory:';

import { describe, it, expect, beforeAll } from 'vitest';
import { mergeFonts, uploadedFonts, findUploadedFont } from './uploaded-fonts';
import { getDb } from './db';
import type { Font } from '@ascii/core';

beforeAll(() => {
  getDb();
});

function font(name: string, author: string): Font {
  return { name, author, source: 's', license: 'l', copyright: '' };
}

describe('uploaded-fonts', () => {
  it('merges curated and uploaded, uploads override by name', () => {
    const curated = [font('Standard', 'A'), font('Big', 'B')];
    const uploaded = [font('Big', 'X'), font('Custom', 'C')];
    const merged = mergeFonts(curated, uploaded);
    expect(merged.map((f) => f.name).sort()).toEqual(['Big', 'Custom', 'Standard']);
    expect(merged.find((f) => f.name === 'Big')?.author).toBe('X');
  });

  it('reads uploaded fonts from db', () => {
    getDb()
      .prepare('INSERT INTO fonts (name, content, author, source, license, created_at) VALUES (?,?,?,?,?,?)')
      .run('MyFont', 'flf2a$', 'me', 'local', 'MIT', Date.now());
    expect(findUploadedFont('MyFont')?.author).toBe('me');
    expect(uploadedFonts().some((f) => f.name === 'MyFont')).toBe(true);
  });

  it('findUploadedFont is case-insensitive and returns undefined when missing', () => {
    expect(findUploadedFont('myfont')?.name).toBe('MyFont');
    expect(findUploadedFont('Nope')).toBeUndefined();
  });
});
