import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Lenis inertia scrolling, wired to GSAP ScrollTrigger.

   Lenis drives the native scroll position; on every Lenis frame we call
   ScrollTrigger.update() so every pin / scrub / reveal stays perfectly in
   sync with the smoothed scroll. GSAP's own ticker runs Lenis' rAF (single
   loop, no competing requestAnimationFrame). In-page anchor clicks route
   through lenis.scrollTo. Everything degrades to native scroll under
   prefers-reduced-motion. */
export function useSmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      // No smoothing, but ScrollTrigger must still work for reveals.
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenis.scrollTo(0, { immediate: true });

    const root = document.documentElement;
    lenis.on('scroll', (l: Lenis) => {
      ScrollTrigger.update();
      // Two independent background layers (fine grid + sparse crosshairs),
      // never meant to align, so different drift rates read as parallax
      // depth instead of a broken/misaligned single grid.
      root.style.setProperty('--grid-shift-fine-y', `${l.scroll * -0.02}px`);
      root.style.setProperty('--grid-shift-cross-y', `${l.scroll * -0.12}px`);
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts change layout widths (Syne) — refresh once settled.
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute('href') || '';
      if (hash.length < 2) return;
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -72 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, [reduce]);
}
