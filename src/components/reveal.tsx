import { createElement, useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP, EASE, DUR, STAG, STAG_MAX, START } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ---------------------------------------------------------------------------
   Reveal — GSAP scroll-into-view entrance.

   Three variants instead of the single fade+rise+blur that used to apply
   identically to headlines, paragraphs, cards and chips alike:

     block   (default) opacity + rise. No blur — blur() is the most expensive
                       property to animate and it was previously on every
                       element on the page.
     text              SplitText per line+word, each word rising out of a
                       masked line box. For Syne headlines — the brand's
                       typographic moment, which previously just faded.
     stagger           one ScrollTrigger for the whole group, children rise in
                       sequence. Replaces N separate triggers for N cards.

   `data-reveal` is pre-hidden by CSS (html.gsap-ready) so there is no FOUC;
   under reduced motion the head script never arms that class → content shows
   and every variant below short-circuits to the end state.
--------------------------------------------------------------------------- */
type Variant = 'block' | 'text' | 'stagger';

type RevealProps = {
  children?: React.ReactNode;
  as?: 'div' | 'section' | 'article' | 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'li';
  variant?: Variant;
  delay?: number;
  y?: number;
  /** opt-in de-blur — hero and headline only, never on lists. */
  blur?: boolean;
  className?: string;
  id?: string;
  dangerouslySetInnerHTML?: { __html: string };
};

export function Reveal({
  children, as = 'div', variant = 'block', delay = 0, y = 26, blur = false,
  className, id, dangerouslySetInnerHTML,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Reduced motion: reveal instantly, and never touch the DOM with
      // SplitText — a split/revert cycle on text a screen reader is already
      // walking is exactly the churn the preference asks us to avoid.
      if (reduce) {
        gsap.set(el, { opacity: 1, y: 0, filter: 'none' });
        return;
      }

      // Anything already on screen when this runs plays immediately, with no
      // ScrollTrigger at all. Above-the-fold content has no scroll event to
      // wait for: `clamp()` pins its start to 0, and at scrollY 0 the trigger
      // sits exactly on that boundary and never fires — the whole hero stayed
      // at opacity 0 until you scrolled. `delay` still sequences the entrance.
      const box = el.getBoundingClientRect();
      const alreadyVisible = box.top < window.innerHeight && box.bottom > 0;
      const trigger = alreadyVisible
        ? undefined
        : ({ trigger: el, start: START.reveal, once: true } as const);

      if (variant === 'text') {
        gsap.set(el, { opacity: 1 });

        // autoSplit handles the font-load re-split (Syne shifts line breaks
        // when it swaps in), replacing a hand-rolled `document.fonts.ready`
        // wait. The animation is created inside onSplit() so it targets the
        // fresh elements, and returned from it so SplitText can revert and
        // time-sync it whenever it re-splits.
        //
        // Measured, not assumed: it does NOT re-split on a width change in
        // this build — squeezing the element 1200px → 240px left the line
        // split untouched. Masked lines therefore clip rather than rewrap on
        // resize. Acceptable today (headings are short and the masks are
        // generous); if that changes, revert + re-split on a debounced
        // ResizeObserver rather than expecting autoSplit to cover it.
        const split = SplitText.create(el, {
          type: 'lines,words',
          mask: 'lines',              // wraps each line in an overflow-clip box
          linesClass: 'r-line',
          wordsClass: 'r-word',
          autoSplit: true,
          // 'auto' (the default) puts an aria-label on the element and hides
          // the split fragments from the a11y tree, so the heading is still
          // read as one sentence rather than word by word.
          aria: 'auto',
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              opacity: 0,
              duration: DUR.enter,
              ease: EASE.out,
              delay,
              stagger: STAG.word,
              scrollTrigger: trigger,
            }),
        });

        // Still needed on unmount: the language switch re-renders React
        // children into a DOM SplitText has already cut into per-word spans.
        return () => split.revert();
      }

      if (variant === 'stagger') {
        gsap.set(el, { opacity: 1 });
        const kids = gsap.utils.toArray<HTMLElement>(el.children);
        gsap.from(kids, {
          opacity: 0,
          y,
          duration: DUR.enter,
          ease: EASE.out,
          delay,
          stagger: { each: STAG.card, amount: Math.min(kids.length * STAG.card, STAG_MAX) },
          scrollTrigger: trigger,
        });
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y, ...(blur ? { filter: 'blur(6px)' } : null) },
        {
          opacity: 1,
          y: 0,
          ...(blur ? { filter: 'blur(0px)' } : null),
          duration: DUR.enter,
          ease: EASE.out,
          delay,
          scrollTrigger: trigger,
        },
      );
    },
    { scope: ref, dependencies: [reduce, variant] },
  );

  return createElement(as, {
    ref,
    id,
    className,
    'data-reveal': '',
    ...(dangerouslySetInnerHTML ? { dangerouslySetInnerHTML } : { children }),
  });
}

/* ---------------------------------------------------------------------------
   Kicker — the `// SECTION NAME` eyebrow with a rule that draws itself.

   The rule used to be `.section-label::after`, a pseudo-element, which is why
   it could never animate. It's a real span now.
--------------------------------------------------------------------------- */
export function Kicker({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduce) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.set(el, { opacity: 1 });
      // same above-the-fold rule as Reveal — see the comment there
      const box = el.getBoundingClientRect();
      const visible = box.top < window.innerHeight && box.bottom > 0;
      const tl = gsap.timeline({
        scrollTrigger: visible ? undefined : { trigger: el, start: START.reveal, once: true },
      });
      tl.from(el.querySelector('.kicker-txt'), { opacity: 0, x: -8, duration: DUR.ui, ease: EASE.out })
        .from(el.querySelector('.kicker-rule'), { scaleX: 0, duration: DUR.ui, ease: EASE.out }, '-=0.15');
    },
    { scope: ref, dependencies: [reduce] },
  );

  return (
    <div className={`section-label ${className}`} data-reveal="" ref={ref}>
      <span className="kicker-txt">{children}</span>
      <span className="kicker-rule" aria-hidden="true" />
    </div>
  );
}
