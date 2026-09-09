export function buildCsp(nonce: string): string {
  const origin = originFromUrl(process.env.UMAMI_SCRIPT_URL) ?? 'https://umami.johansen.foo';
  const scriptSources = [
    "'self'",
    `'nonce-${nonce}'`,
    ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
    origin,
  ];
  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    `connect-src 'self' ${origin}`,
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  return directives.join('; ');
}

function originFromUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}
