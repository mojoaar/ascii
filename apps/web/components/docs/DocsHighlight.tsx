'use client';
import { useEffect } from 'react';

export default function DocsHighlight() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/highlight.min.js';
    script.onload = () => {
      (window as never as { hljs?: { highlightAll: () => void } }).hljs?.highlightAll();
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);
  return null;
}
