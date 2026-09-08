'use client';
import { useEffect, useState } from 'react';

interface Stats { total: number; last24h: number; bySource: { source: string; c: number }[]; byFont: { font: string; c: number }[] }

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then(setStats).catch(() => {});
  }, []);
  if (!stats) return <p>loading…</p>;
  return (
    <div className="stats">
      <div className="stat-card"><strong>{stats.total}</strong><span>total</span></div>
      <div className="stat-card"><strong>{stats.last24h}</strong><span>last 24h</span></div>
      <div className="stat-list">
        <h3>By source</h3>
        {stats.bySource.map((s) => <div key={s.source}>{s.source}: {s.c}</div>)}
      </div>
      <div className="stat-list">
        <h3>Top fonts</h3>
        {stats.byFont.map((f) => <div key={f.font}>{f.font}: {f.c}</div>)}
      </div>
    </div>
  );
}
