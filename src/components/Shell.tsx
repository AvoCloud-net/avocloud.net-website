import type { ReactNode } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLang } from '@/hooks/useLang';
import { Nav, Footer } from './Site';

/* Nav + Footer wrapper for subpages (404, fabi, project pages, ...) — the
   homepage (Site.tsx) wires these directly since it also needs ScrollTabs
   and active-section tracking, which subpages don't have. */
export default function Shell({ children }: { children: ReactNode }) {
  useSmoothScroll();
  const { lang, t, toggle } = useLang();

  return (
    <>
      <Nav active="" t={t} lang={lang} toggle={toggle} base="/" />
      {children}
      <Footer t={t} />
    </>
  );
}
