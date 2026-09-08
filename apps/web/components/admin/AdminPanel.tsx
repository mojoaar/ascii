'use client';
import { useEffect, useState } from 'react';
import StatsCards from './StatsCards';

export default function AdminPanel() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((d) => setSettings(d.settings ?? {})).catch(() => {});
  }, []);

  const save = async () => {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="admin-panel">
      <h2>Settings</h2>
      <label>
        date format{' '}
        <select value={settings.date_format ?? 'iso'} onChange={(e) => setSettings((s) => ({ ...s, date_format: e.target.value }))}>
          <option value="iso">ISO (YYYY-MM-DD)</option>
          <option value="eu">EU (DD.MM.YYYY)</option>
        </select>
      </label>
      <label>
        clock{' '}
        <select value={settings.clock ?? '24h'} onChange={(e) => setSettings((s) => ({ ...s, clock: e.target.value }))}>
          <option value="24h">24-hour</option>
          <option value="12h">12-hour</option>
        </select>
      </label>
      <button className="btn" onClick={save}>save{saved ? ' ✓' : ''}</button>
      <StatsCards />
    </div>
  );
}
