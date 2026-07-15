import { useCallback, useEffect, useState } from 'react';
import { messages, seo, type Lang } from '@/data/content';

function setMeta(sel: string, attr: string, val: string) {
  const el = document.querySelector(sel);
  if (el) el.setAttribute(attr, val);
}

/* Client-side language state. Default 'en' matches the server-rendered HTML
   (so hydration is stable + EN content is what crawlers see); the client then
   upgrades to ?lang / localStorage preference and keeps <head> meta in sync. */
export function useLang() {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const url = new URLSearchParams(window.location.search).get('lang');
    const stored = localStorage.getItem('avo-lang');
    const initial: Lang =
      url === 'de' || url === 'en' ? url : stored === 'de' || stored === 'en' ? stored : 'en';
    if (initial !== 'en') setLang(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('avo-lang', lang);
    const s = seo[lang];
    document.title = s.title;
    setMeta('meta[name="description"]', 'content', s.description);
    setMeta('meta[property="og:title"]', 'content', s.title);
    setMeta('meta[property="og:description"]', 'content', s.description);
    setMeta('meta[property="og:locale"]', 'content', lang === 'de' ? 'de_DE' : 'en_US');
    setMeta('meta[property="og:locale:alternate"]', 'content', lang === 'de' ? 'en_US' : 'de_DE');
    setMeta('meta[name="twitter:title"]', 'content', s.title);
    setMeta('meta[name="twitter:description"]', 'content', s.description);
  }, [lang]);

  const t = useCallback((key: string) => messages[lang][key] ?? key, [lang]);
  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'de' : 'en')), []);

  return { lang, t, toggle };
}
