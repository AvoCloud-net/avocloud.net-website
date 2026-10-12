import type { ReactNode } from 'react';
import { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { Wordmark } from './Wordmark';
import { gsap, useGSAP, SIGNATURE_TIMESCALE, EASE, DUR, STAG } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* The claim decodes in like a terminal settling on its output — the brand
   voice is "reads like a good terminal" (BRANDING.md §1). ScrambleTextPlugin
   replaces a hand-rolled rAF character shuffler that did the same job with
   more code and no reduced-motion story.

   Only runs when the claim is a plain string: markup (fabi's two-line claim
   with a <br>) would be flattened into text by the scramble. */
function Claim({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const text = typeof children === 'string' ? children : null;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce || !text) return;
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: DUR.ui,
          ease: EASE.out,
          delay: 0.35,
          scrambleText: { text, chars: 'upperCase', speed: 0.5, revealDelay: 0.15 },
        },
      );
    },
    { scope: ref, dependencies: [reduce, text] },
  );

  // Final text is in the markup, so SSR/no-JS/reduced-motion all get the real
  // sentence — the scramble only ever overwrites something already correct.
  return <p className="hero-claim" ref={ref}>{children}</p>;
}

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

/* ---------------------------------------------------------------------------
   HeroShell — the one hero used by the homepage and every product page.

   Previously each of Site/Baxi/Fabi/Qrgate carried its own ~80-line copy of a
   pasted shadcn "dithering CTA card": 48px radii, rounded-full pill CTAs,
   ring-4 focus rings, an opaque card background. All of that is explicitly
   retired by BRANDING.md §6/§11 (radii above 8px = the v1 rounded-card look)
   and §3 (coral is a spark, not a background fill). Four copies also meant a
   fix had to land four times, which is how the drift survived.

   What ships now: a hairline blueprint frame, the shader demoted to a masked
   rim texture so the wordmark keeps its black canvas, and the site's own
   .btn / .section-label components instead of Tailwind pills.
--------------------------------------------------------------------------- */
type Props = {
  id: string;
  /** mono `// KICKER` eyebrow — replaces the old ping-dot pill badge. */
  kicker: ReactNode;
  claim: ReactNode;
  /** `.btn` / `.btn.primary` CTAs. */
  links: ReactNode;
  /** `.stat` blocks. Omitted on pages without a number row. */
  stats?: ReactNode;
  /** optional visual above the kicker (fabi's portrait ring). */
  media?: ReactNode;
  /** optional chip row under the CTAs. */
  footnote?: ReactNode;
  /** Wordmark overrides — default is the site wordmark AVOCLOUD.NET. */
  word?: string;
  coralFrom?: number;
  round?: Set<string>;
};

export function HeroShell({
  id, kicker, claim, links, stats, media, footnote, word, coralFrom, round,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  /* The shader kept animating a ~3.8 megapixel fragment shader for the entire
     visit, including the ten-thousand-odd pixels of page where the hero is
     nowhere near the viewport. ShaderMount pauses itself when the *tab* is
     hidden, but knows nothing about scroll position.

     `speed: 0` is the library's own off switch — it stops the rAF loop
     outright rather than idling it (see ShaderMount.setSpeed). So the hero
     costs nothing once you scroll past it, and picks up again on the way
     back. The rootMargin restarts it just before it comes back into view, so
     the texture is already moving when it arrives. */
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* One timeline for the whole hero entrance, sequenced with labels.
     Previously each block was a separate scroll-triggered Reveal with a
     hand-tuned `delay` — which chained animations by delay instead of
     sequencing them (the thing timelines exist for), and worse, tied
     above-the-fold content to a scroll event that never comes.

     matchMedia does the reduced-motion gate: under `reduce` the timeline is
     never created and GSAP reverts anything it set, so the markup's own
     end state stands. No manual branch, no cleanup to forget.

     The wordmark is NOT in here. It runs its own brand-locked reveal
     (trigger="load", timeScale 0.6) and stays untouched — this only
     choreographs what sits around it. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(ref);
        // built paused and played at the end, once every step is queued
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out, duration: DUR.enter } });

        // `media`, `stats` and `footnote` are optional props, so on any given
        // page some of these select nothing — the homepage has neither media
        // nor a footnote. Tweening an empty selection makes GSAP log
        // "target not found" on every play, which is where the console noise
        // on every page was coming from.
        const at = (sel: string, vars: gsap.TweenVars, pos: string) => {
          const els = q(sel);
          if (els.length) tl.from(els, vars, pos);
        };

        tl.addLabel('start', 0.1).addLabel('afterMark', 'start+=0.55');
        at('.hero-media', { opacity: 0, scale: 0.9, duration: DUR.ui }, 'start');
        at('.hero-kicker', { opacity: 0, y: 12, duration: DUR.ui }, 'start+=0.1');
        // the wordmark owns the stretch between the two labels
        at('.hero-stats .stat', { opacity: 0, y: 16, stagger: STAG.card }, 'afterMark');
        at('.hero-links > *', { opacity: 0, y: 16, stagger: STAG.card }, 'afterMark+=0.12');
        at('.hero-footnote > *', { opacity: 0, y: 10, stagger: STAG.card, duration: DUR.ui }, 'afterMark+=0.28');

        // Scroll-out: the type lifts away and fades while the texture behind it
        // pushes in slightly, so leaving the hero reads as a camera move rather
        // than the page sliding up. On the container and the shader wrapper —
        // neither is touched by the entrance above, so the two never fight.
        const out = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('.hero-inner'), {
          y: -56,
          opacity: 0,
          ease: EASE.none,
          scrollTrigger: { ...out, end: '55% top' },
        });
        // .hero-zoom, not .hero-shader: the shader sits inside a Suspense
        // boundary that hydrates late, and an inline style written into it
        // before then trips React's hydration check.
        gsap.fromTo(q('.hero-zoom'), { scale: 1 }, { scale: 1.08, ease: EASE.none, scrollTrigger: out });

        tl.play();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      className="hero"
      id={id}
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Full-viewport background texture. The wrapper's CSS mask clears only
          the band the wordmark and CTAs occupy; everywhere else the dither is
          meant to be seen. colorFront stays a desaturated rust so it reads as
          texture and not as a coral field — see BRANDING.md §6. */}
      <div className="hero-zoom" aria-hidden="true">
        <Suspense fallback={null}>
          <div className="hero-shader">
            <Dithering
              colorBack="#00000000"
              colorFront="#7a4534"
              shape="warp"
              type="4x4"
              speed={onScreen ? (hovered ? 0.4 : 0.18) : 0}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>
      </div>

      {/* Plain elements — the entrance is the timeline above, so nothing here
          is pre-hidden by `data-reveal`. Without JS the hero renders complete
          and static, which is the correct fallback. */}
      <div className="hero-inner">
        {media && <div className="hero-media">{media}</div>}

        <div className="section-label hero-kicker">{kicker}</div>

        <Wordmark
          as="h1"
          textClass="hero-wordmark"
          trigger="load"
          timeScale={SIGNATURE_TIMESCALE}
          word={word}
          coralFrom={coralFrom}
          round={round}
        />

        <Claim>{claim}</Claim>

        {stats && <div className="hero-stats">{stats}</div>}

        <div className="hero-links">{links}</div>

        {footnote && <div className="chips hero-footnote">{footnote}</div>}
      </div>
    </section>
  );
}
