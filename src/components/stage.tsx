import { useRef, type RefObject } from 'react';
import { gsap, useGSAP, EASE } from '@/lib/motion';

/* ---------------------------------------------------------------------------
   useStage — continuous, scroll-scrubbed choreography for a full-height
   section.

   The site used to read as static, and the reason was structural rather than a
   shortage of effects: every element animated in **once** and then never moved
   again. Past the first 300px of a section, nothing on screen responded to
   scrolling at all.

   So this is not another entrance. It is a three-phase timeline scrubbed
   across the section's whole transit through the viewport:

       enter (0 → 0.30)   content rises into place and resolves
       hold  (0.30 → 0.68) fully settled and readable — the reading zone
       exit  (0.68 → 1)   drifts on and recedes as the next section arrives

   Because it is scrubbed, the content is bound to scroll position for the
   entire time it is on screen: scrolling always moves something, and reversing
   always reverses it. The hold phase is what keeps this from being motion for
   its own sake — copy is never moving while you are trying to read it.

   Nothing fades below `EXIT_OPACITY`; a section leaving the viewport dims, it
   does not disappear out from under someone who scrolled a little too far.
--------------------------------------------------------------------------- */
const EXIT_OPACITY = 0.22;

type StageOpts = {
  /** element that carries the choreography; defaults to the section's `.wrap` */
  selector?: string;
  /** skip the exit phase — for sections that should stay put on the way out */
  noExit?: boolean;
};

export function useStage(ref: RefObject<HTMLElement | null>, opts: StageOpts = {}) {
  const { selector = '.wrap', noExit = false } = opts;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // matchMedia gates reduced motion and reverts everything on cleanup.
      // Also gated on width: on a phone a 100vh section plus a 200vh transit is
      // a lot of scrolling for a paragraph, so small screens keep the plain
      // one-shot reveals.
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)', () => {
        const section = ref.current;
        if (!section) return;
        const content = section.querySelector<HTMLElement>(selector);
        if (!content) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Phase split favours enter/exit over hold. Sections are content-height,
        // not 100vh, so the transit is short — at a 0.30/0.38/0.32 split the
        // hold ate most of it and the movement was too small to register.
        tl.fromTo(
          content,
          { yPercent: 12, opacity: 0, scale: 0.96 },
          { yPercent: 0, opacity: 1, scale: 1, ease: EASE.out, duration: 0.36 },
        ).to(content, { duration: 0.26 }); // hold — the reading zone, deliberately empty

        if (!noExit) {
          tl.to(content, {
            yPercent: -12,
            opacity: EXIT_OPACITY,
            scale: 0.97,
            ease: EASE.inOut,
            duration: 0.38,
          });
        }

        // Depth layers. `data-depth` moves an element against the section at a
        // multiple of the base rate, so a headline and its body copy separate
        // slightly as the section travels — the section reads as having
        // thickness rather than being one flat plane sliding past.
        gsap.utils.toArray<HTMLElement>('[data-depth]', section).forEach((layer) => {
          const depth = parseFloat(layer.dataset.depth || '1');
          gsap.fromTo(
            layer,
            { yPercent: 5 * depth },
            {
              yPercent: -5 * depth,
              ease: EASE.none,
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );
}

/* Convenience wrapper for the common case: a full-height section whose
   `.wrap` gets the choreography. */
export function Stage({
  id, className = '', children, noExit,
}: { id?: string; className?: string; children: React.ReactNode; noExit?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useStage(ref, { noExit });
  return (
    <section className={`section stage ${className}`} id={id} ref={ref}>
      <div className="wrap">{children}</div>
    </section>
  );
}
