import { createElement, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE = 'power3.out';

/* ---------------------------------------------------------------------------
   Reveal — GSAP scroll-into-view entrance (fade + rise + de-blur).
   Same API as the old framer version so call sites are unchanged.
   `data-reveal` is pre-hidden by CSS (html.gsap-ready) so there is no FOUC;
   under reduced motion the head script never arms that class → content shows.
--------------------------------------------------------------------------- */
type RevealProps = {
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article' | 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'li';
  delay?: number;
  y?: number;
  className?: string;
  id?: string;
  dangerouslySetInnerHTML?: { __html: string };
};

export function Reveal({ children, as = 'div', delay = 0, y = 26, className, id, dangerouslySetInnerHTML }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: EASE,
          delay,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    },
    { scope: ref },
  );

  return createElement(as, {
    ref,
    id,
    className,
    'data-reveal': '',
    ...(dangerouslySetInnerHTML ? { dangerouslySetInnerHTML } : { children }),
  });
}
