import { describe, it, expect } from 'vitest';
import { matchHotkey, HOTKEYS } from './hotkeys';

function evt(partial: Partial<KeyboardEvent>): KeyboardEvent {
  return { ctrlKey: false, metaKey: false, shiftKey: false, ...partial } as KeyboardEvent;
}

describe('matchHotkey', () => {
  it('matches plain key', () => {
    expect(matchHotkey(evt({ key: 't', target: null as never }), { key: 't', action: 'x' })).toBe(true);
  });
  it('ignores when typing in input', () => {
    const target = { tagName: 'INPUT' } as never;
    expect(matchHotkey(evt({ key: 'd', target }), { key: 'd', action: 'x' })).toBe(false);
    expect(matchHotkey(evt({ key: 't', target }), { key: 't', action: 'x' })).toBe(false);
  });
  it('matches shift modifier', () => {
    expect(matchHotkey(evt({ key: '?', shiftKey: true, target: null as never }), { key: '?', shift: true, action: 'x' })).toBe(true);
  });
});
