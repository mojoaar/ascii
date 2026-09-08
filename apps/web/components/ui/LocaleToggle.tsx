'use client';
import { useLocale } from '@/lib/i18n';

export default function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <button
      type="button"
      className="btn"
      aria-label="Toggle language (L)"
      onClick={() => setLocale(locale === 'en' ? 'da' : 'en')}
    >
      {locale === 'en' ? 'DA' : 'EN'}
    </button>
  );
}
