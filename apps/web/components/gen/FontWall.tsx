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
            <pre className="wall-preview">{r.output}</pre>
            <div className="wall-meta">
              <strong>{r.name}</strong>
              {r.author ? <span>by {r.author}</span> : null}
            </div>
            <button
              type="button"
              className="wall-copy"
              onClick={() => navigator.clipboard.writeText(r.output)}
            >
              {t('gen.copy')}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
