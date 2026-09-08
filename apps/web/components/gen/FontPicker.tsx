'use client';
import { useEffect, useState } from 'react';
import type { Font } from '@ascii/core';

export default function FontPicker({ value, onChange }: { value: string; onChange: (f: string) => void }) {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/fonts')
      .then((r) => r.json())
      .then((d) => setFonts(d.fonts ?? []))
      .catch(() => {});
  }, []);

  const filtered = fonts.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="font-picker">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="search fonts…"
      />
      <select size={8} value={value} onChange={(e) => onChange(e.target.value)}>
        {filtered.map((f) => (
          <option key={f.name} value={f.name}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
}
