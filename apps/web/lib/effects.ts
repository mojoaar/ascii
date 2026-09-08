import type { CSSProperties } from 'react';

export function crtStyle(): CSSProperties {
  return {
    textShadow: '0 0 2px var(--accent-glow), 0 0 8px var(--accent-glow)',
  };
}

export function typingFrames(art: string): string[] {
  const lines = art.split('\n');
  const frames: string[] = [];
  let acc = '';
  for (const ch of art) {
    acc += ch;
    frames.push(acc);
  }
  return frames;
}
