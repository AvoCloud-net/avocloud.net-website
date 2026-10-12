import { useRef, type RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP, EASE, DUR, STAG, STAG_MAX, START } from '@/lib/motion';

/* ---------------------------------------------------------------------------
   useSlotMotion — gives the motion system to server-rendered slot content.

   The subpages (fabi, baxi, craftattack, qrgate, regulations, pwgen) write
   their body as plain Astro markup and slot it into a React shell. React
   components can't reach into a slot, so `Reveal`, `Kicker` and the stage
   choreography never applied to any of it — everything below the hero on every
   subpage was completely static, no matter how much motion the homepage had.

   Rather than port hundreds of lines of markup into React, this walks the
   slotted DOM once and upgrades what it recognises. The markup stays plain
   HTML — which is also why it degrades correctly: no JS, no upgrade, and the
   page is simply the static document it already was.

   Contract with the markup (all optional, all plain classes):
     section.section    → stage choreography over its transit
     .section-label     → gains a rule that draws itself
     h2.headline        → SplitText line/word build
     .card, .chip       → grouped stagger, one trigger per group
--------------------------------------------------------------------------- */
/* Above-the-fold elements have no scroll event to wait for: `clamp()` pins
   their start to 0 and at scrollY 0 the trigger sits exactly on that boundary
   and never fires, leaving them at opacity 0 until the first scroll. So
   anything already on screen plays immediately, with no ScrollTrigger. */
function revealTrigger(el: HTMLElement, start: string): ScrollTrigger.Vars | undefined {
  const box = el.getBoundingClientRect();
  if (box.top < window.innerHeight && box.bottom > 0) return undefined;
  return { trigger: el, start, once: true };
}

export function useSlotMotion(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = ref.current;
        if (!root) return;
        const splits: SplitText[] = [];

        /* --- kickers: give the rule a real element so it can be drawn ------
           `.section-label::after` is a pseudo-element and therefore not
           animatable; the same swap the Kicker component makes, done here for
           markup that was written as a plain div. */
        gsap.utils.toArray<HTMLElement>('.section-label', root).forEach((label) => {
          if (label.querySelector('.kicker-rule')) return;
          const rule = document.createElement('span');
          rule.className = 'kicker-rule';
          rule.setAttribute('aria-hidden', 'true');
          label.appendChild(rule);
          gsap
            .timeline({ scrollTrigger: revealTrigger(label, START.reveal) })
            .from(label, { opacity: 0, x: -8, duration: DUR.ui, ease: EASE.out })
            .from(rule, { scaleX: 0, duration: DUR.ui, ease: EASE.out }, '-=0.15');
        });

        /* --- headlines: build word by word out of masked lines ------------- */
        gsap.utils.toArray<HTMLElement>('h2.headline', root).forEach((h) => {
          const split = SplitText.create(h, {
            type: 'lines,words',
            mask: 'lines',
            linesClass: 'r-line',
            wordsClass: 'r-word',
            autoSplit: true,
            aria: 'auto',
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 110,
                opacity: 0,
                duration: DUR.enter,
                ease: EASE.out,
                stagger: STAG.word,
                scrollTrigger: revealTrigger(h, START.reveal),
              }),
          });
          splits.push(split);
        });

        /* --- card groups: one trigger per row, stagger inside -------------- */
        const groups = new Set<HTMLElement>();
        gsap.utils.toArray<HTMLElement>('.card', root).forEach((card) => {
          if (card.parentElement) groups.add(card.parentElement);
        });
        groups.forEach((group) => {
          const cards = gsap.utils.toArray<HTMLElement>(':scope > .card', group);
          if (!cards.length) return;
          gsap.from(cards, {
            opacity: 0,
            y: 24,
            duration: DUR.enter,
            ease: EASE.out,
            stagger: { each: STAG.card, amount: Math.min(cards.length * STAG.card, STAG_MAX) },
            scrollTrigger: revealTrigger(group, START.reveal),
          });
        });

        /* --- timeline rail: the line draws, then the entries arrive -------- */
        gsap.utils.toArray<HTMLElement>('.timeline', root).forEach((tl) => {
          const rail = tl.querySelector('.timeline-rail');
          const items = gsap.utils.toArray<HTMLElement>('.tl-item', tl);
          const seq = gsap.timeline({
            scrollTrigger: revealTrigger(tl, START.early),
          });
          if (rail) seq.from(rail, { scaleY: 0, duration: 0.9, ease: EASE.out });
          const dots = items.map((i) => i.querySelector('.tl-dot')).filter(Boolean);
          if (dots.length) {
            seq.from(dots, {
              scale: 0, opacity: 0, duration: DUR.ui, ease: EASE.spring, stagger: STAG.card,
            }, '-=0.6');
          }
          if (items.length) {
            seq.from(items, {
              opacity: 0, x: -14, duration: DUR.ui, ease: EASE.out, stagger: STAG.card,
            }, dots.length ? '<' : '-=0.6');
          }
        });

        /* --- section transit: the same scrubbed choreography as the
               homepage's stages, so subpages don't read as a different site -- */
        gsap.utils.toArray<HTMLElement>('section.section', root).forEach((section) => {
          const content = section.querySelector<HTMLElement>('.wrap');
          if (!content) return;
          gsap
            .timeline({
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
            })
            .fromTo(
              content,
              { yPercent: 8, opacity: 0, scale: 0.98 },
              { yPercent: 0, opacity: 1, scale: 1, ease: EASE.out, duration: 0.34 },
            )
            .to(content, { duration: 0.32 }) // hold — the reading zone
            .to(content, { yPercent: -8, opacity: 0.3, scale: 0.985, ease: EASE.inOut, duration: 0.34 });
        });

        // Deliberately NO ScrollTrigger.refresh() here. SplitText's onSplit
        // creates ScrollTriggers of its own, and calling refresh() while that
        // is still in flight nests a refresh inside ScrollTrigger's own init
        // refresh — which throws `Cannot read properties of undefined
        // (reading 'end')` and takes the whole island down with it. The
        // triggers created above measure correctly on their own; refreshing
        // was defensive and was the thing causing the damage.
        return () => splits.forEach((s) => s.revert());
      });

      return () => mm.revert();
    },
    { scope: ref },
  );
}

/** Attach the slot motion without needing a wrapper element of your own. */
export function useSlotMotionOn(): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement>(null);
  useSlotMotion(ref);
  return ref;
}
