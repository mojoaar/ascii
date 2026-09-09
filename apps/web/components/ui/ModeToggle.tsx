'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/i18n';

function readMode(): 'dark' | 'light' {
  try {
    const m = localStorage.getItem('ascii-mode');
    if (m === 'light' || m === 'dark') return m;
  } catch {
    /* ignore */
  }
  return document.documentElement.getAttribute('data-mode') === 'light' ? 'light' : 'dark';
}

function applyMode(m: 'dark' | 'light') {
  document.documentElement.setAttribute('data-mode', m);
  localStorage.setItem('ascii-mode', m);
}

export default function ModeToggle() {
  const { t } = useLocale();
  const [mode, setMode] = useState<'dark' | 'light'>(readMode);

  useEffect(() => {
    const toggle = () => {
      setMode((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        applyMode(next);
        return next;
      });
    };
    window.addEventListener('ascii:toggle-mode', toggle);
    return () => window.removeEventListener('ascii:toggle-mode', toggle);
  }, []);

  return (
    <button
      type="button"
      className="btn"
      aria-label={`${t('common.darkMode')} (D)`}
      onClick={() => {
        const next = mode === 'light' ? 'dark' : 'light';
        applyMode(next);
        setMode(next);
      }}
    >
      {mode === 'light' ? '☀' : '☾'}
    </button>
  );
}
