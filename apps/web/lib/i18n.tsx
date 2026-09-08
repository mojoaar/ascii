'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { en, type MessageKey } from '@/messages/en';
import { da } from '@/messages/da';

export type Locale = 'en' | 'da';
const dicts: Record<Locale, Record<MessageKey, string>> = { en, da };

function readLocale(): Locale {
  try {
    return localStorage.getItem('ascii-locale') === 'da' ? 'da' : 'en';
  } catch {
    return 'en';
  }
}

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale);
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    document.documentElement.setAttribute('lang', l);
    localStorage.setItem('ascii-locale', l);
  };
  const t = (key: MessageKey, vars?: Record<string, string | number>) => {
    let s = dicts[locale][key] ?? en[key];
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
    return s;
  };
  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
