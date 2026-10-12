import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { gsap, useGSAP, EASE } from '@/lib/motion';
import { company } from '@/data/company';
import { registerSnap } from '@/lib/snap';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

/* ---------------------------------------------------------------------------
   Finale — the closing title sequence before Contact.

   A tall section (420vh, see .finale in global.css) with a sticky 100vh stage,
   so the picture stands still and only the type changes. Everything is scrubbed
   to scroll position: stop and you get a still frame, scroll back and it runs
   in reverse.

       0 → top      the frame opens from an inset window to full bleed
       4 → 28%      sentence 1   ┐ each one: resolves out of blur with its
      28 → 52%      sentence 2   │ letter-spacing closing in, holds sharp,
      52 → 76%      sentence 3   ┘ then blurs out upward as the next arrives
      76 → 100%     the name is set like an end credit — and stays

   Blur is normally kept off scroll animation (BRANDING.md §6.3). It is used
   here because exactly one line is ever in transition, on a plain black field
   — the cost the rule guards against is blur on many elements at once.

   No JS / reduced motion: `html.gsap-ready` is never armed, so the CSS falls
   back to a normal-height section with every line visible over the frame.
--------------------------------------------------------------------------- */

/** Scroll windows, as fractions of the sticky play time. */
const SCENES: [number, number][] = [
  [0.04, 0.28],
  [0.28, 0.52],
  [0.52, 0.76],
];
const NAME_AT = 0.76;

const BLUR = 'blur(12px)';
const SHARP = 'blur(0px)';

export function Finale({ t }: { t: (k: string) => string }) {
  const ref = useRef<HTMLElement>(null);
  const lines = [t('finale.1'), t('finale.2'), t('finale.3')];

  /* Same shader budget rule as the hero: mount on first approach, and stop the
     rAF loop (speed 0) whenever the section is off screen. Mounted once and
     kept, so scrolling past repeatedly doesn't churn WebGL contexts. */
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const section = ref.current!;
        const q = gsap.utils.selector(section);
        const counter = q('.finale-count')[0];

        // The curtain: an inset window with the 8px box radius opens to full
        // bleed while the section rises into view. Done by the time the stage
        // sticks, so the sentences always play over the open frame.
        gsap.fromTo(
          q('.finale-frame'),
          { clipPath: 'inset(4% 6% 4% 6% round 8px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: EASE.none,
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true },
          },
        );

        // A slow pull-back across the whole transit — barely noticeable at any
        // one moment, which is the point.
        gsap.fromTo(
          q('.finale-bg'),
          { scale: 1.14 },
          {
            scale: 1,
            ease: EASE.none,
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom bottom', scrub: true },
          },
        );

        // Leaving: once the sequence has run out and the stage un-sticks, it
        // steps back like every other scene while Contact scrolls in below.
        gsap.fromTo(
          q('.finale-stage'),
          { scale: 1, borderRadius: 0, '--shade': 0 },
          {
            scale: 0.93,
            borderRadius: 8,
            '--shade': 0.8,
            ease: EASE.none,
            scrollTrigger: { trigger: section, start: 'bottom bottom', end: 'bottom top', scrub: true },
          },
        );

        const tl = gsap.timeline({
          defaults: { ease: EASE.none },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            // short catch-up, as in ProjectStack — smooths trackpad input
            scrub: 1.4,
            onUpdate: (self) => {
              // readout, not a tween — tracks the scrollbar exactly
              gsap.set(q('.finale-progress span'), { scaleX: self.progress });
              if (counter) {
                const scene = Math.min(4, Math.max(1, Math.ceil((self.progress - 0.04) / 0.24)));
                counter.textContent = `0${scene} / 04`;
              }
            },
          },
        });

        // A pull focus, not a cut: each sentence resolves, holds, and blurs
        // away upward while the next one is already rising underneath it.
        q('.finale-line').forEach((line, i) => {
          const [a, b] = SCENES[i];
          const third = (b - a) / 3;
          tl.fromTo(
            line,
            { opacity: 0, filter: BLUR, y: 26, letterSpacing: '0.2em' },
            { opacity: 1, filter: SHARP, y: 0, letterSpacing: '-0.01em', ease: EASE.out, duration: third },
            a,
          ).to(
            line,
            { opacity: 0, filter: BLUR, y: -26, ease: 'power1.in', duration: third },
            b - third,
          );
        });

        // The name is set like a credit: very wide tracking closes in slowly,
        // the rule draws from the centre out, the line under it follows.
        tl.fromTo(
          q('.finale-name'),
          { opacity: 0, filter: BLUR, y: 20, letterSpacing: '0.6em' },
          { opacity: 1, filter: SHARP, y: 0, letterSpacing: '0.02em', ease: EASE.out, duration: 0.14 },
          NAME_AT,
        )
          .fromTo(q('.finale-rule'), { scaleX: 0 }, { scaleX: 1, ease: EASE.inOut, duration: 0.08 }, NAME_AT + 0.08)
          .fromTo(q('.finale-sub'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, ease: EASE.out, duration: 0.06 }, NAME_AT + 0.12)
          // empty tail so the name holds still for the last stretch of scroll
          .to({}, { duration: 1 - (NAME_AT + 0.18) });

        // Rest zones for the snap (lib/snap.ts): the middle third of each
        // sentence's window, where it stands sharp, and the set name once the
        // rule and subline are in.
        const unsnap = registerSnap(() => {
          const st = tl.scrollTrigger;
          if (!st) return [];
          const at = (p: number) => st.start + p * (st.end - st.start);
          const zones: [number, number][] = SCENES.map(([a, b]) => {
            const third = (b - a) / 3;
            return [at(a + third), at(b - third)];
          });
          zones.push([at(NAME_AT + 0.18), at(1)]);
          return zones;
        });
        return () => unsnap();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section className="finale" id="finale" ref={ref}>
      <div className="finale-stage recede">
        <div className="finale-frame" aria-hidden="true">
          <div className="finale-bg">
            {seen && (
              <Suspense fallback={null}>
                <div className="finale-shader">
                  <Dithering
                    colorBack="#00000000"
                    colorFront="#7a4534"
                    shape="warp"
                    type="4x4"
                    speed={near ? 0.14 : 0}
                    className="size-full"
                    minPixelRatio={1}
                  />
                </div>
              </Suspense>
            )}
          </div>
          <span className="finale-vignette" />
        </div>

        <div className="finale-copy">
          {lines.map((l, i) => (
            <p key={i} className="finale-line">
              {l}
            </p>
          ))}
          <div className="finale-credit">
            <p className="finale-name">
              AVOCLOUD<span className="dot">.NET</span>
            </p>
            <span className="finale-rule" aria-hidden="true" />
            <p className="finale-sub">
              {t('finale.sub')} · {t('finale.est')} {company.founded}
            </p>
          </div>
        </div>

        <div className="finale-meta" aria-hidden="true">
          <span className="finale-label">{t('finale.label')}</span>
          <span className="finale-count">01 / 04</span>
          <span className="finale-progress">
            <span />
          </span>
        </div>
      </div>
    </section>
  );
}
