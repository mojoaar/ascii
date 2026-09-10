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

export const metadata: Metadata = {
  title: 'ASCII Generator',
  description: 'Self-hosted FIGlet / ASCII art generator',
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
