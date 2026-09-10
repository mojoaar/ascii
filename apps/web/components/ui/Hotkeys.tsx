'use client';
import { useEffect, useState } from 'react';
import { HOTKEYS, matchHotkey } from '@/lib/hotkeys';
import { isValidTheme, nextTheme } from '@/lib/themes';
import { useLocale } from '@/lib/i18n';

export default function Hotkeys() {
  const { t } = useLocale();
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
        case 'toggle-mode':
          window.dispatchEvent(new CustomEvent('ascii:toggle-mode'));
          break;
        case 'toggle-locale':
          window.dispatchEvent(new CustomEvent('ascii:toggle-locale'));
          break;
        case 'focus-input':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('ascii:focus'));
          break;
        case 'focus-filter':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('ascii:focus-filter'));
          break;
        case 'goto-docs':
          window.location.href = '/docs';
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
        <h2>{t('shortcuts.title')}</h2>
        <ul>
          <li><kbd>T</kbd> {t('shortcuts.cycleTheme')}</li>
          <li><kbd>D</kbd> {t('shortcuts.darkMode')}</li>
          <li><kbd>L</kbd> {t('shortcuts.language')}</li>
          <li><kbd>I</kbd> {t('shortcuts.focus')}</li>
          <li><kbd>F</kbd> {t('shortcuts.filter')}</li>
          <li><kbd>G</kbd> {t('shortcuts.docs')}</li>
          <li><kbd>?</kbd> {t('shortcuts.overlay')}</li>
          <li><kbd>Esc</kbd> {t('shortcuts.close')}</li>
        </ul>
      </div>
    </div>
  );
}
