'use client';
import { useEffect, useRef, useState } from 'react';
import FontPicker from './FontPicker';
import AsciiOutput from './AsciiOutput';
import { useLocale } from '@/lib/i18n';

export default function Generator() {
  const { t } = useLocale();
  const [text, setText] = useState('ascii');
  const [font, setFont] = useState('Standard');
  const [width, setWidth] = useState<number | ''>('');
  const [layout, setLayout] = useState<'default' | 'full' | 'fitted'>('default');
  const [animate, setAnimate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    window.addEventListener('ascii:focus', focus);
    return () => window.removeEventListener('ascii:focus', focus);
  }, []);

  return (
    <main className="gen">
      <input
        ref={inputRef}
        className="gen-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('gen.input.placeholder')}
      />
      <div className="gen-controls">
        <FontPicker value={font} onChange={setFont} />
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
        <label>
          <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} />
          {t('gen.animate')}
        </label>
      </div>
      <AsciiOutput text={text} font={font} width={width === '' ? undefined : width} layout={layout} animate={animate} />
    </main>
  );
}
