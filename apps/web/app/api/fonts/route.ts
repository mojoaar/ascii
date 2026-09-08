import { listFonts } from '@ascii/core';
import { requireAdmin } from '@/lib/admin-auth';
import { apiError } from '@/lib/api';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const fonts = await listFonts();
  return Response.json({ fonts });
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return apiError('invalid_input', 'file is required');
  const content = await file.text();
  if (!content.startsWith('flf2a')) return apiError('invalid_input', 'not a valid .flf font');
  const name = String(form.get('name') ?? file.name.replace(/\.flf$/, ''));
  getDb()
    .prepare('INSERT INTO fonts (name, content, author, source, license, created_at) VALUES (?,?,?,?,?,?) ON CONFLICT(name) DO UPDATE SET content = excluded.content')
    .run(name, content, String(form.get('author') ?? ''), String(form.get('source') ?? ''), String(form.get('license') ?? ''), Date.now());
  return Response.json({ ok: true, name });
}
