import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';
import { JetBrains_Mono } from 'next/font/google';
import { LocaleProvider } from '@/lib/i18n';
import Hotkeys from '@/components/ui/Hotkeys';
import './globals.css';

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const THEME_INIT = `(function(){try{var t=localStorage.getItem('ascii-theme')||'terminal';var m=localStorage.getItem('ascii-mode')||'dark';document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('data-mode',m);}catch(e){}})()`;

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'ASCII Generator',
    template: '%s | ASCII Generator',
  },
  description: 'Self-hosted FIGlet / ASCII art generator. Browse 330+ fonts, generate ASCII banners, and export from your terminal, API, or MCP client.',
  keywords: ['ASCII art', 'FIGlet', 'text art', 'monospace', 'banner', 'terminal'],
  authors: [{ name: 'Morten Johansen', url: 'https://johansen.foo' }],
  openGraph: {
    type: 'website',
    siteName: 'ASCII Generator',
    title: 'ASCII Generator',
    description: 'Self-hosted FIGlet / ASCII art generator with 330+ fonts.',
    images: ['/og.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASCII Generator',
    description: 'Self-hosted FIGlet / ASCII art generator with 330+ fonts.',
    images: ['/og.svg'],
  },
  manifest: '/manifest.webmanifest',
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    { rel: 'mask-icon', url: '/favicon.svg', color: '#7c6af7' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ASCII Generator',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f6fa' },
    { media: '(prefers-color-scheme: dark)', color: '#11131a' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  const umamiUrl = process.env.UMAMI_SCRIPT_URL;
  const umamiId = process.env.UMAMI_WEBSITE_ID;
  return (
    <html lang="en" data-theme="terminal" data-mode="dark" suppressHydrationWarning className={jetbrains.variable}>
      <body>
        <Script id="theme-init" strategy="beforeInteractive" nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {umamiUrl && umamiId ? <Script src={umamiUrl} data-website-id={umamiId} strategy="afterInteractive" /> : null}
        <LocaleProvider>
          <Hotkeys />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
