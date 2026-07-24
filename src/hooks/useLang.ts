import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { messages, seo, type Lang } from '@/data/content';
import { gsap, Flip, EASE, DUR } from '@/lib/motion';

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

  /* German runs noticeably longer than English, so a language switch resizes
     cards and reflows whole sections — the page used to jump. Flip records
     the layout before React re-renders and animates every card from its old
     box to its new one, so the switch reads as the layout adjusting rather
     than snapping.

     `useLayoutEffect` matters: the state has to be captured after React has
     committed the new text but before the browser paints it, otherwise the
     "before" snapshot is already the "after". */
  const flipState = useRef<Flip.FlipState | null>(null);

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    Flip.from(state, {
      duration: DUR.ui,
      ease: EASE.out,
      // only position/size, no cross-fading of contents — the text changed,
      // so morphing between the two strings would read as a glitch
      simple: true,
      absolute: false,
    });
  }, [lang]);

  const t = useCallback((key: string) => messages[lang][key] ?? key, [lang]);
  const toggle = useCallback(() => {
    flipState.current = Flip.getState('.card, .proj-panel, .hero-stats, .chips');
    setLang((l) => (l === 'en' ? 'de' : 'en'));
  }, []);

  return { lang, t, toggle };
}
