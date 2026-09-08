'use client';
import { useEffect, useState } from 'react';
import { HOTKEYS, matchHotkey } from '@/lib/hotkeys';
import { isValidTheme, nextTheme } from '@/lib/themes';

export default function Hotkeys() {
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const binding = HOTKEYS.find((b) => matchHotkey(e, b));
      if (!binding) return;
      switch (binding.action) {
        case 'cycle-theme': {
          const cur = document.documentElement.getAttribute('data-theme') || 'terminal';
          const next = nextTheme(isValidTheme(cur) ? cur : 'terminal');
          document.documentElement.setAttribute('data-theme', next);
          localStorage.setItem('ascii-theme', next);
          break;
        }
        case 'toggle-mode': {
          const m = document.documentElement.getAttribute('data-mode') === 'light' ? 'dark' : 'light';
          document.documentElement.setAttribute('data-mode', m);
          localStorage.setItem('ascii-mode', m);
          break;
        }
        case 'toggle-locale':
          window.dispatchEvent(new CustomEvent('ascii:toggle-locale'));
          break;
        case 'copy':
          window.dispatchEvent(new CustomEvent('ascii:copy'));
          break;
        case 'focus-input':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('ascii:focus'));
          break;
        case 'goto-docs':
          window.location.href = '/docs';
          break;
        case 'goto-admin':
          window.location.href = '/admin';
          break;
        case 'toggle-overlay':
          setOverlay((v) => !v);
          break;
      }
    };
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverlay(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keydown', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', close);
    };
  }, []);

  if (!overlay) return null;
  return (
    <div className="shortcuts-overlay" role="dialog" aria-modal="true">
      <div className="shortcuts-panel">
        <h2>Keyboard shortcuts</h2>
        <ul>
          <li><kbd>T</kbd> cycle theme</li>
          <li><kbd>D</kbd> dark / light</li>
          <li><kbd>L</kbd> language</li>
          <li><kbd>C</kbd> copy output</li>
          <li><kbd>/</kbd> focus input</li>
          <li><kbd>G</kbd> docs</li>
          <li><kbd>A</kbd> admin</li>
          <li><kbd>?</kbd> this overlay</li>
          <li><kbd>Esc</kbd> close</li>
        </ul>
      </div>
    </div>
  );
}
