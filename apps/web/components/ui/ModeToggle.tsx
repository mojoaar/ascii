'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/i18n';

export default function ModeToggle() {
  const { t } = useLocale();
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    let m: 'dark' | 'light' | null = null;
    try {
      const stored = localStorage.getItem('ascii-mode');
      if (stored === 'light' || stored === 'dark') m = stored;
    } catch {
      /* ignore */
    }
    if (!m) m = document.documentElement.getAttribute('data-mode') === 'light' ? 'light' : 'dark';
    setMode(m);
  }, []);

  useEffect(() => {
    const toggle = () => {
      setMode((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-mode', next);
        localStorage.setItem('ascii-mode', next);
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
        document.documentElement.setAttribute('data-mode', next);
        localStorage.setItem('ascii-mode', next);
        setMode(next);
      }}
    >
      {mode === 'light' ? '☀' : '☾'}
    </button>
  );
}
