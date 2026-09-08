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
  { key: 'c', action: 'copy' },
  { key: '/', action: 'focus-input' },
  { key: 'g', action: 'goto-docs' },
  { key: 'a', action: 'goto-admin' },
  { key: '?', shift: true, action: 'toggle-overlay' },
];

export function matchHotkey(e: KeyboardEvent, b: HotkeyBinding): boolean {
  const target = e.target as HTMLElement | null;
  const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
  // Allow '/' to focus even while typing elsewhere is not desired; ignore typed shortcuts in inputs
  if (typing && b.action !== 'copy') return false;
  if ((b.ctrl ?? false) !== (e.ctrlKey || e.metaKey)) return false;
  if ((b.meta ?? false) !== e.metaKey) return false;
  if ((b.shift ?? false) !== e.shiftKey) return false;
  return e.key.toLowerCase() === b.key.toLowerCase();
}
