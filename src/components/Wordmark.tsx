import { useRef, useState } from 'react';
import { gsap, useGSAP, EASE } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DEFAULT_WORD = 'AVOCLOUD.NET';
const DEFAULT_CORAL_FROM = 8; // ".NET" onward renders coral
const DEFAULT_ROUND = new Set(['O', 'C', 'D']); // letters that get an inscribed ring

type Line = { x1: number; y1: number; x2: number; y2: number; coral?: boolean };
type Circ = { cx: number; cy: number; r: number; coral?: boolean };
type Geo = { w: number; h: number; lines: Line[]; circles: Circ[] };

type Props = {
  as?: 'h1' | 'div';
  textClass: string;               // font-size / styling class ('hero-wordmark' | 'footer-word')
  trigger?: 'load' | 'scroll';     // load = on mount, scroll = when it enters the viewport
  timeScale?: number;              // <1 slower / longer, >1 faster
  word?: string;                   // defaults to the site wordmark 'AVOCLOUD.NET'
  coralFrom?: number;              // index from which letters render coral; defaults to the '.NET' suffix
  round?: Set<string>;             // letters that get an inscribed ring; defaults to the site wordmark's O/C/D
};

/* ---------------------------------------------------------------------------
   Wordmark — alche.studio-style CAD construction reveal for "AVOCLOUD.NET".
   Construction geometry is MEASURED from the real glyph boxes at runtime
   (cap/mid/baseline horizontals, per-letter boundary ticks, bounding box +
   diagonals, dashed rings inscribing the round letters) so every guide sits on
   a real letter feature. Guides draw in → letters appear as stroked outlines →
   fills rise bottom-up → scaffold fades. Real text lives only in .hw-fill (the
   glyph text stays a single clean "AVOCLOUD.NET" for SEO). Reduced motion /
   no-JS → solid wordmark, no scaffold.
--------------------------------------------------------------------------- */
export function Wordmark({
  as = 'h1', textClass, trigger = 'load', timeScale = 1,
  word = DEFAULT_WORD, coralFrom = DEFAULT_CORAL_FROM, round = DEFAULT_ROUND,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);

  // measure the letters, derive construction geometry tied to the glyphs
  useGSAP(
    () => {
      if (reduce) return;
      let cancelled = false;
      const build = () => {
        const wrap = ref.current;
        if (cancelled || !wrap) return;
        const chs = [...wrap.querySelectorAll<HTMLElement>('.hw-ch')];
        if (!chs.length) return;
        const wr = wrap.getBoundingClientRect();
        const r = chs.map((c) => {
          const b = c.getBoundingClientRect();
          return { left: b.left - wr.left, right: b.right - wr.left, top: b.top - wr.top, bottom: b.bottom - wr.top };
        });
        const w = wr.width;
        const h = wr.height;
        const lead = (r[0].bottom - r[0].top) * 0.11;
        const capTop = Math.min(...r.map((x) => x.top)) + lead;
        const base = Math.max(...r.map((x) => x.bottom)) - lead;
        const midY = (capTop + base) / 2;
        const left = r[0].left;
        const right = r[r.length - 1].right;
        const ext = w * 0.05;

        const lines: Line[] = [];
        [capTop, midY, base].forEach((y) => lines.push({ x1: left - ext, y1: y, x2: right + ext, y2: y }));
        lines.push({ x1: left, y1: capTop - ext * 0.5, x2: left, y2: base + ext * 0.5 });
        lines.push({ x1: right, y1: capTop - ext * 0.5, x2: right, y2: base + ext * 0.5 });
        for (let i = 0; i < r.length - 1; i++) {
          const x = (r[i].right + r[i + 1].left) / 2;
          lines.push({ x1: x, y1: capTop - ext * 0.25, x2: x, y2: base + ext * 0.25 });
        }
        lines.push({ x1: left, y1: capTop, x2: right, y2: base });
        lines.push({ x1: right, y1: capTop, x2: left, y2: base });

        const circles: Circ[] = [];
        chs.forEach((_, i) => {
          if (!round.has(word[i])) return;
          const c = r[i];
          circles.push({
            cx: (c.left + c.right) / 2,
            cy: (c.top + c.bottom) / 2,
            r: ((base - capTop) / 2) * 1.08,
            coral: i >= coralFrom,
          });
        });

        setGeo({ w, h, lines, circles });
      };
      if (document.fonts?.ready) document.fonts.ready.then(build);
      else build();
      return () => {
        cancelled = true;
      };
    },
    { scope: ref, dependencies: [reduce] },
  );

  // play the reveal once geometry is rendered
  useGSAP(
    () => {
      const wrap = ref.current;
      if (!wrap) return;
      const strokes = wrap.querySelectorAll('.hw-stroke');
      const fills = wrap.querySelectorAll('.hw-fill');
      if (reduce) {
        gsap.set(fills, { clipPath: 'inset(0 0 0 0)' });
        return;
      }
      if (!geo) return;
      // Arrays, not live NodeLists, and only kept if non-empty. A word with no
      // round letters (BAXI, FABIAN MURAUER pass `round={new Set()}`) has zero
      // circles, and tweening an empty selection makes GSAP log
      // "target not found" on every play.
      const lines = [...wrap.querySelectorAll('.hw-line')];
      const circles = [...wrap.querySelectorAll('.hw-circ')];

      gsap.set(fills, { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(strokes, { opacity: 0, yPercent: 8 });
      // Guides draw from their midpoint outward — a straightedge being laid
      // down, rather than a line growing from one end. DrawSVGPlugin does the
      // dash arithmetic that this used to hand-roll via pathLength + dashoffset.
      gsap.set(lines, { drawSVG: '50% 50%', opacity: 0 });
      // Circles keep their dashed CSS stroke (the inscribing-ring look), so
      // they scale/fade in — DrawSVG would overwrite strokeDasharray and eat
      // the dashes.
      if (circles.length) gsap.set(circles, { opacity: 0, transformOrigin: '50% 50%' });

      // `paused` for the scroll case — an IntersectionObserver starts it (below).
      // Always paused. `load` plays right away; `scroll` is released by the
      // IntersectionObserver below.
      const tl = gsap.timeline({ delay: trigger === 'load' ? 0.15 : 0, paused: true });
      tl.set(lines, { opacity: 1 })
        .to(lines, { drawSVG: '0% 100%', duration: 0.7, ease: 'power2.inOut', stagger: 0.025 }, 0);
      if (circles.length) {
        tl.fromTo(circles, { scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.55, ease: EASE.out, stagger: 0.06 }, 0.25);
      }
      tl.to(strokes, { opacity: 1, yPercent: 0, duration: 0.4, ease: EASE.out, stagger: 0.045 }, 0.4)
        .to(fills, { clipPath: 'inset(0% 0 0 0)', duration: 0.5, ease: EASE.out, stagger: 0.055 }, 0.85)
        // flattened into one array of elements (not `[lines, circles]`, two
        // nested NodeLists) — the nested form intermittently made GSAP's
        // lazy tween-init throw internally, silently no-op'ing this fade
        // and leaving the CAD guide lines stuck visible forever.
        .to([...lines, ...circles], { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 1.7)
        .to(strokes, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 1.7);
      if (timeScale !== 1) tl.timeScale(timeScale);
      if (trigger === 'load') {
        tl.play();
        return;
      }

      /* IntersectionObserver, deliberately not ScrollTrigger.

         ScrollTrigger resolves a start into an absolute scroll position at
         creation time. This component can only build after the webfont loads
         and the glyphs are measured, and by then the pinned projects section
         has inserted a ~5800px pin-spacer that moves the footer down by that
         much. The trigger kept the pre-pin number, so the reveal fired around
         scrollY 5000 — mid-projects, roughly 4500px before the wordmark is on
         screen at all. It played out completely into an empty viewport, which
         is why it looked like there was no animation.

         `refreshPriority` + a rAF `ScrollTrigger.refresh()` were both tried and
         neither reliably caught the settled layout. An observer sidesteps the
         whole class of problem: it reports actual visibility, so there is no
         cached position to go stale, and no ordering to get wrong.

         Thresholds are deliberately strict: the wordmark must be **75% visible
         AND clear of the bottom 15% of the viewport** before the build starts.
         At 15% it fired while the wordmark was still a sliver at the very
         bottom edge, so most of the ~4s sequence played out below the fold and
         the viewer arrived to a finished wordmark. rootMargin is what enforces
         "properly on screen" rather than merely "technically intersecting". */
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          tl.play();
        },
        { threshold: 0.75, rootMargin: '0px 0px -15% 0px' },
      );
      io.observe(wrap);
      return () => io.disconnect();
    },
    { scope: ref, dependencies: [geo, reduce] },
  );

  const Text = as;
  return (
    <div className="hw" ref={ref}>
      {geo && (
        <svg className="hw-guides" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
          {geo.lines.map((l, i) => (
            <line
              key={i}
              className={`hw-line${l.coral ? ' coral' : ''}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {geo.circles.map((c, i) => (
            <circle key={i} className={`hw-circ${c.coral ? ' coral' : ''}`} cx={c.cx} cy={c.cy} r={c.r} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      )}

      <Text className={textClass}>
        {word.split('').map((ch, i) => (
          <span className={`hw-ch${i >= coralFrom ? ' coral' : ''}`} key={i}>
            <span className="hw-stroke" data-ch={ch} aria-hidden="true" />
            <span className="hw-fill">{ch}</span>
          </span>
        ))}
      </Text>
    </div>
  );
}
