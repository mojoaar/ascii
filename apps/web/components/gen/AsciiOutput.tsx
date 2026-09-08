'use client';
import { useEffect, useRef, useState } from 'react';
import { generate, animate } from '@ascii/core';
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
    (async () => {
      if (doAnimate) {
        const { frames } = await animate(text, { font, kind: 'reveal' });
        if (cancelled) return;
        let i = 0;
        const id = setInterval(() => {
          setArt(frames[i] ?? '');
          i += 1;
          if (i >= frames.length) clearInterval(id);
        }, 80);
        return () => clearInterval(id);
      }
      const out = await generate(text, { font, width, horizontalLayout: layout });
      if (!cancelled) setArt(out);
    })();
    return () => {
      cancelled = true;
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
