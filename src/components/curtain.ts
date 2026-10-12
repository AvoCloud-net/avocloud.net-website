import type { RefObject } from 'react';
import { gsap, useGSAP, EASE } from '@/lib/motion';

/* ---------------------------------------------------------------------------
   useRecede — the scene change between two sections.

   Sections used to simply scroll past each other: one slid out of the top
   while the next slid in at the bottom, with nothing connecting the two. This
   makes the hand-over a cut instead: the outgoing section stops where it is
   and steps back — it shrinks to 93%, takes the 8px box radius and dims —
   while the next section slides over it from below.

   Only for a hand-over to an OPAQUE section (the mission band, the project
   stack, the finale frame). A transparent section sliding over would show the
   receding one straight through it.

   Pinned with `pinSpacing: false`, so the document height never changes and
   nothing below has to be re-measured. Where the pin starts depends on size:
     · taller than the viewport → when its bottom reaches the bottom edge
     · shorter                  → when its top reaches the top edge
   and it holds for exactly as long as the next section needs to cover it.

   The dimming is `--shade` on a `::after` (see `.recede` in global.css), not
   opacity: a transparent section fading out would just reveal the grid, not
   read as stepping back into the dark.

   Desktop only, like the stage choreography — on a phone a pinned section is
   a lot of dead scrolling for very little. Reduced motion: nothing runs.
--------------------------------------------------------------------------- */
export function useRecede(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)', () => {
        const el = ref.current;
        if (!el) return;
        const tall = () => el.offsetHeight > window.innerHeight;

        gsap.fromTo(
          el,
          { scale: 1, borderRadius: 0, '--shade': 0 },
          {
            scale: 0.93,
            borderRadius: 8,
            '--shade': 0.8,
            ease: EASE.none,
            scrollTrigger: {
              trigger: el,
              start: () => (tall() ? 'bottom bottom' : 'top top'),
              end: () => '+=' + Math.min(el.offsetHeight, window.innerHeight),
              scrub: true,
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
              // shrink toward the centre of what is actually on screen, not the
              // centre of a section that may be two screens tall
              onRefresh: () =>
                gsap.set(el, {
                  transformOrigin: `50% ${tall() ? el.offsetHeight - window.innerHeight / 2 : el.offsetHeight / 2}px`,
                }),
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
}
