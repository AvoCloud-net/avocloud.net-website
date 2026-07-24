import { useRef } from 'react';
import { gsap, useGSAP, EASE, DUR, INTRO_DONE_EVENT } from '@/lib/motion';

/* ---------------------------------------------------------------------------
   Intro — the page-load sequence.

   A drafting sheet being set up, then the drawing revealed:

     1. a frame draws itself around the mark (DrawSVG, corner-first)
     2. the mark draws inside it, coral cursor last
     3. a mono counter runs 000 → 100
     4. the whole sheet lifts as a curtain and the page is underneath

   Runs on **every homepage load** — it is the brand's handshake, not a
   first-visit-only easter egg. It is only mounted by the homepage, so internal
   navigation to a subpage never pays for it.

   Safety: the overlay is `display: none` in CSS and only shown when the head
   script adds `html.intro`. That script runs before first paint and only when
   motion is allowed, so no-JS and reduced-motion visitors never get an overlay
   that JS would have to remove. It cannot strand anyone on a black screen.
--------------------------------------------------------------------------- */

/* Timeline stretch. The choreography is authored at a comfortable working
   speed and then slowed as a whole, so the proportions between the four beats
   stay fixed no matter how the overall length is tuned — the same approach the
   wordmark reveal uses (SIGNATURE_TIMESCALE). Lower = longer. */
const INTRO_TIMESCALE = 0.68;
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // the head script decides whether we run at all
      if (!document.documentElement.classList.contains('intro')) return;

      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        clearTimeout(failsafe);
        document.documentElement.classList.remove('intro');
        el.remove();
        // releases everything queued behind the curtain (see afterIntro)
        window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      };

      const counter = { v: 0 };
      const out = el.querySelector<HTMLElement>('.intro-count')!;

      const tl = gsap
        .timeline({ onComplete: done })
        .from(el.querySelectorAll('.intro-frame line'), {
          drawSVG: '0%', duration: 0.5, ease: EASE.out, stagger: 0.06,
        })
        .from(el.querySelectorAll('.intro-mark path'), {
          drawSVG: '0%', duration: 0.6, ease: EASE.out, stagger: 0.08,
        }, '-=0.25')
        .from(el.querySelector('.intro-mark rect'), {
          opacity: 0, scaleY: 0, transformOrigin: '50% 50%', duration: DUR.micro,
        }, '-=0.15')
        .to(counter, {
          // runs long enough to land just before the hold — at the old
          // duration it hit 100 while the sheet was still being drawn and then
          // sat there dead for the rest of the sequence
          v: 100, duration: 1.45, ease: 'power1.inOut', snap: { v: 1 },
          onUpdate: () => { out.textContent = String(counter.v).padStart(3, '0'); },
        }, 0.35)
        // a beat on the finished drawing before it is taken away — without it
        // the mark completes and vanishes in the same breath
        .to({}, { duration: 0.45 })
        // curtain: the sheet lifts away rather than fading, so the page under
        // it is revealed by an edge moving — same "a line passes over it"
        // language as every other transition on the site
        .to(el, { yPercent: -100, duration: 0.75, ease: 'power3.inOut' });

      tl.timeScale(INTRO_TIMESCALE);

      /* Fail-safe. The overlay is fixed, full-screen and locks scrolling, so
         anything that stops the timeline short — a plugin that fails on a
         target, an exception in a callback, a tab throttled in the background —
         strands the visitor on a black screen with no way out. That is a far
         worse failure than a missing animation, so it gets a hard deadline
         independent of GSAP.

         Derived from the timeline rather than hardcoded: a fixed 5000ms was
         fine at the old length but would have cut the slower sequence off
         mid-build. Note the `/ timeScale()` — duration() is the *authored*
         length and ignores the stretch, so using it raw would have put the
         deadline only ~1.5s past the end. Doubling the real playback time
         leaves room for a throttled tab (where rAF stalls and the timeline
         genuinely does need the escape hatch) without ever being reachable in
         normal playback. */
      const realSeconds = tl.duration() / tl.timeScale();  // 4.41s
      const failsafe = window.setTimeout(done, realSeconds * 1000 * 2);

      return () => clearTimeout(failsafe);
    },
    { scope: ref },
  );

  return (
    <div className="intro-overlay" ref={ref} aria-hidden="true">
      <div className="intro-stage">
        <svg className="intro-frame" viewBox="0 0 200 120" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden="true">
          <line x1="2" y1="2" x2="60" y2="2" /><line x1="2" y1="2" x2="2" y2="40" />
          <line x1="198" y1="2" x2="140" y2="2" /><line x1="198" y1="2" x2="198" y2="40" />
          <line x1="2" y1="118" x2="60" y2="118" /><line x1="2" y1="118" x2="2" y2="80" />
          <line x1="198" y1="118" x2="140" y2="118" /><line x1="198" y1="118" x2="198" y2="80" />
        </svg>
        <svg className="intro-mark" viewBox="0 0 72 72" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M22 18 L12 18 L12 54 L22 54" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 18 L60 18 L60 54 L50 54" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 30 L33 36 L26 42" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          <rect x="40" y="28" width="4" height="16" rx="2" fill="var(--coral)" stroke="none" />
        </svg>
      </div>
      <span className="intro-count mono">000</span>
    </div>
  );
}
