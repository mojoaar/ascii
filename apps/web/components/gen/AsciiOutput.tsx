'use client';
import { useEffect, useRef, useState } from 'react';
import { crtStyle } from '@/lib/effects';

interface Props {
  text: string;
  font: string;
  width?: number;
  layout: 'default' | 'full' | 'fitted';
  animate: boolean;
}

export default function AsciiOutput({ text, font, width, layout, animate: doAnimate }: Props) {
  const [art, setArt] = useState('');
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    (async () => {
      if (doAnimate) {
        const res = await fetch('/api/animate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text, font, kind: 'reveal' }),
        });
        if (cancelled || !res.ok) return;
        const { frames } = (await res.json()) as { frames: string[] };
        let i = 0;
        intervalId = setInterval(() => {
          setArt(frames[i] ?? '');
          i += 1;
          if (i >= frames.length && intervalId) clearInterval(intervalId);
        }, 80);
        return;
      }
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, font, width, horizontalLayout: layout }),
      });
      if (cancelled || !res.ok) return;
      const { output } = (await res.json()) as { output: string };
      setArt(output);
    })();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, font, width, layout, doAnimate]);

  useEffect(() => {
    const copy = async () => {
      if (!art) return;
      await navigator.clipboard.writeText(art);
    };
    window.addEventListener('ascii:copy', copy);
    return () => window.removeEventListener('ascii:copy', copy);
  }, [art]);

  return (
    <pre ref={preRef} className="ascii-output" style={crtStyle()}>
      {art}
    </pre>
  );
}
