import { api } from './client.js';

export async function generateAscii(text: string, font?: string, width?: number): Promise<string> {
  const { output } = await api<{ output: string }>('/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text, font, width }),
  });
  return output;
}

export async function listFonts(): Promise<{ name: string; author: string; license: string }[]> {
  const { fonts } = await api<{ fonts: { name: string; author: string; license: string }[] }>('/api/fonts');
  return fonts;
}

export async function previewFont(font: string, text: string): Promise<string> {
  return generateAscii(text, font, undefined);
}

export async function animate(text: string, font?: string): Promise<{ frames: string[]; kind: string }> {
  return api<{ frames: string[]; kind: string }>('/api/animate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text, font, kind: 'reveal' }),
  });
}
