'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import ModeToggle from './ModeToggle';
import LocaleToggle from './LocaleToggle';
import { useLocale } from '@/lib/i18n';

export default function SiteHeader() {
  const { t } = useLocale();
  return (
    <header className="site-header">
      <Link href="/" className="logo">{t('home.title')}</Link>
      <nav>
        <Link href="/">{t('nav.generate')}</Link>
        <Link href="/fonts">{t('nav.fonts')}</Link>
        <Link href="/docs">{t('nav.docs')}</Link>
      </nav>
      <ThemeToggle />
      <ModeToggle />
      <LocaleToggle />
    </header>
  );
}
