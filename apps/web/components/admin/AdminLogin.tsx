'use client';
import { useState, type FormEvent } from 'react';

export default function AdminLogin() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = new URLSearchParams({ token });
    const res = await fetch('/api/admin/login', { method: 'POST', body });
    if (res.ok) window.location.reload();
    else setError('invalid token');
  };

  return (
    <form onSubmit={submit} className="admin-login">
      <input
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="admin token"
      />
      <button type="submit" className="btn">login</button>
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}
