import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
      const lines = wrap.querySelectorAll('.hw-line');
      const circles = wrap.querySelectorAll('.hw-circ');

      gsap.set(fills, { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(strokes, { opacity: 0, yPercent: 8 });
      gsap.set(lines, { strokeDashoffset: 1, opacity: 0 });
      gsap.set(circles, { opacity: 0, transformOrigin: '50% 50%' });

      const tl = gsap.timeline({
        delay: trigger === 'load' ? 0.15 : 0,
        // lenient start: a footer sits near the page bottom, so its top may
        // never reach a tight threshold like 82% at max scroll. 90% is always
        // reachable while still holding the reveal until it's actually in view.
        scrollTrigger: trigger === 'scroll' ? { trigger: wrap, start: 'top 90%', once: true } : undefined,
      });
      tl.set(lines, { opacity: 1 })
        .to(lines, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', stagger: 0.025 }, 0)
        .fromTo(circles, { scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out', stagger: 0.06 }, 0.25)
        .to(strokes, { opacity: 1, yPercent: 0, duration: 0.4, ease: 'power2.out', stagger: 0.045 }, 0.4)
        .to(fills, { clipPath: 'inset(0% 0 0 0)', duration: 0.5, ease: 'power2.out', stagger: 0.055 }, 0.85)
        // flattened into one array of elements (not `[lines, circles]`, two
        // nested NodeLists) — the nested form intermittently made GSAP's
        // lazy tween-init throw internally, silently no-op'ing this fade
        // and leaving the CAD guide lines stuck visible forever.
        .to([...lines, ...circles], { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 1.7)
        .to(strokes, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 1.7);
      if (timeScale !== 1) tl.timeScale(timeScale);

      // This ScrollTrigger is created late (after fonts + measure), by which
      // point the pinned projects section has already added its pin-spacer and
      // shifted the footer. Recompute trigger positions against final layout so
      // the start isn't stale (otherwise it may sit past the document end and
      // never fire). rAF waits for the freshly-rendered SVG to paint first.
      if (trigger === 'scroll') requestAnimationFrame(() => ScrollTrigger.refresh());
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
              pathLength={1}
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
