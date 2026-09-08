'use client';
import { isValidTheme, nextTheme } from '@/lib/themes';

export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={() => {
        const cur = (document.documentElement.getAttribute('data-theme') || 'terminal') as never;
        const next = nextTheme(isValidTheme(cur) ? cur : 'terminal');
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ascii-theme', next);
      }}
      aria-label="Cycle theme (T)"
      className="btn"
    >
      ◐
    </button>
  );
}
