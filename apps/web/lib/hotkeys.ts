export interface HotkeyBinding {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: string;
}

export const HOTKEYS: HotkeyBinding[] = [
  { key: 't', action: 'cycle-theme' },
  { key: 'd', action: 'toggle-mode' },
  { key: 'l', action: 'toggle-locale' },
  { key: 'i', action: 'focus-input' },
  { key: 'f', action: 'focus-filter' },
  { key: 'g', action: 'goto-docs' },
  { key: '?', shift: true, action: 'toggle-overlay' },
];

export function matchHotkey(e: KeyboardEvent, b: HotkeyBinding): boolean {
  const target = e.target as HTMLElement | null;
  const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
  // Ignore shortcut keys while typing in an input/textarea.
  if (typing) return false;
  if ((b.ctrl ?? false) !== (e.ctrlKey || e.metaKey)) return false;
  if ((b.meta ?? false) !== e.metaKey) return false;
  // When shift is unspecified (e.g. '/'), accept both plain and Shift-produced slashes.
  if (b.shift !== undefined && b.shift !== e.shiftKey) return false;
  return e.key.toLowerCase() === b.key.toLowerCase();
}
