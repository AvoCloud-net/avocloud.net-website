import type { ReactNode } from 'react';
import { useRef } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLang } from '@/hooks/useLang';
import { Nav, Footer } from './Site';
import { useSlotMotion } from './slot-motion';

/* Nav + Footer wrapper for subpages (404, fabi, project pages, ...) — the
   homepage (Site.tsx) wires these directly since it also needs ScrollTabs
   and active-section tracking, which subpages don't have. */
export default function Shell({ children }: { children: ReactNode }) {
  useSmoothScroll();
  const slot = useRef<HTMLElement>(null);
  useSlotMotion(slot);
  const { lang, t, toggle } = useLang();

  return (
    <>
      <Nav active="" t={t} lang={lang} toggle={toggle} base="/" />
      {/* The slot needs a real element for useSlotMotion to scope to — as a
          bare fragment there was nothing to hold the ref, so the pages using
          this shell (regulations, pwgen, 404, impressum) got no motion at all
          while the ones with their own <main> did. */}
      <main id="main" tabIndex={-1} ref={slot}>{children}</main>
      <Footer t={t} />
    </>
  );
}
