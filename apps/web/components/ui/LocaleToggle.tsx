'use client';
import { useEffect } from 'react';
import { useLocale } from '@/lib/i18n';

export default function LocaleToggle() {
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    const toggle = () => setLocale(locale === 'en' ? 'da' : 'en');
    window.addEventListener('ascii:toggle-locale', toggle);
    return () => window.removeEventListener('ascii:toggle-locale', toggle);
  }, [locale, setLocale]);

  return (
    <button
      type="button"
      className="btn"
      aria-label={`${t('common.language')} (L)`}
      onClick={() => setLocale(locale === 'en' ? 'da' : 'en')}
    >
      {locale === 'en' ? 'DA' : 'EN'}
    </button>
  );
}
