import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LocaleToggle from './LocaleToggle';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="logo">ascii</Link>
      <nav>
        <Link href="/">generate</Link>
        <Link href="/fonts">fonts</Link>
        <Link href="/docs">docs</Link>
        <Link href="/admin">admin</Link>
      </nav>
      <ThemeToggle />
      <LocaleToggle />
    </header>
  );
}
