'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/i18n';

interface Result {
  name: string;
  output: string;
  author: string;
  license: string;
  copyright: string;
  source: string;
}

interface Props {
  text: string;
  width?: number;
  layout: 'default' | 'full' | 'fitted';
}

export default function FontWall({ text, width, layout }: Props) {
  const { t } = useLocale();
  const [results, setResults] = useState<Result[]>([]);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Result | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setViewing(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewing]);

  const copy = (r: Result) => {
    navigator.clipboard.writeText(r.output)
      .then(() => {
        setCopied(r.name);
        if (copyTimer.current) clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => {});
  };

  useEffect(() => {
    const id = setTimeout(() => {
      const controller = new AbortController();
      fetch('/api/generate-all', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, width, horizontalLayout: layout }),
        signal: controller.signal,
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.results) setResults(d.results as Result[]);
        })
        .catch(() => {});
      return () => controller.abort();
    }, 300);
    return () => clearTimeout(id);
  }, [text, width, layout]);

  const filtered = results.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="font-wall">
      <input
        type="search"
        className="wall-filter"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('gen.search.placeholder')}
      />
      <div className="wall-grid">
        {filtered.map((r) => (
          <article key={r.name} className="wall-card">
            <div className="wall-head">
              <button
                type="button"
                className="wall-copy"
                onClick={() => copy(r)}
              >
                {copied === r.name ? t('gen.copied') : t('gen.copy')}
              </button>
              <button
                type="button"
                className="wall-copy"
                onClick={() => setViewing(r)}
              >
                {t('gen.view')}
              </button>
            </div>
            <pre className="wall-preview">{r.output}</pre>
            <div className="wall-meta">
              <strong>{r.name}</strong>
              {r.author ? <span>by {r.author}</span> : null}
            </div>
          </article>
        ))}
      </div>
      {viewing && (
        <div className="wall-modal" onClick={() => setViewing(null)} role="dialog" aria-modal="true">
          <div className="wall-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="wall-modal-head">
              <strong>{viewing.name}</strong>
              <button type="button" className="wall-modal-close" onClick={() => setViewing(null)}>
                {t('shortcuts.close')}
              </button>
            </div>
            <pre className="wall-modal-art">{viewing.output}</pre>
          </div>
        </div>
      )}
    </section>
  );
}
