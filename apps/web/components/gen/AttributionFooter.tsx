'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/i18n';

interface FontAttribution {
  name: string;
  author: string;
  source: string;
  license: string;
  copyright: string;
}

export default function AttributionFooter({ font }: { font: string }) {
  const { t } = useLocale();
  const [info, setInfo] = useState<FontAttribution | null>(null);

  useEffect(() => {
    let cancelled = false;
    setInfo(null);
    fetch(`/api/fonts/${encodeURIComponent(font)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.font) setInfo(d.font);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [font]);

  if (!info) return null;
  return (
    <footer className="attribution">
      <span>{t('gen.attribution', { font: info.name, author: info.author })}</span>
      {info.copyright ? <span>{info.copyright}</span> : null}
      <span>{t('gen.license')}: {info.license}</span>
    </footer>
  );
}
