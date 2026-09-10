'use client';
import { useEffect, useRef, useState } from 'react';
import FontWall from './FontWall';
import { useLocale } from '@/lib/i18n';

export default function Generator() {
  const { t } = useLocale();
  const [text, setText] = useState('ascii');
  const [width, setWidth] = useState<number | ''>('');
  const [layout, setLayout] = useState<'default' | 'full' | 'fitted'>('default');
  const [filter, setFilter] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focus = () => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.select();
    };
    window.addEventListener('ascii:focus', focus);
    return () => window.removeEventListener('ascii:focus', focus);
  }, []);

  useEffect(() => {
    const focus = () => {
      const el = filterRef.current;
      if (!el) return;
      el.focus();
      el.select();
    };
    window.addEventListener('ascii:focus-filter', focus);
    return () => window.removeEventListener('ascii:focus-filter', focus);
  }, []);

  return (
    <main className="gen">
      <div className="gen-row">
        <input
          ref={inputRef}
          className="gen-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('gen.input.placeholder')}
        />
        <input
          ref={filterRef}
          type="search"
          className="wall-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              if (filter) {
                setFilter('');
              } else {
                filterRef.current?.blur();
              }
            }
          }}
          placeholder={t('gen.search.placeholder')}
        />
      </div>
      <div className="gen-controls">
        <label>
          {t('gen.width')}{' '}
          <input
            type="number"
            min={5}
            value={width}
            onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>
        <label>
          {t('gen.layout')}{' '}
          <select value={layout} onChange={(e) => setLayout(e.target.value as never)}>
            <option value="default">default</option>
            <option value="full">full</option>
            <option value="fitted">fitted</option>
          </select>
        </label>
      </div>
      <FontWall text={text} width={width === '' ? undefined : width} layout={layout} filter={filter} />
    </main>
  );
}
