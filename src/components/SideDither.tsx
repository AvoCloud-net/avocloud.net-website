import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import type { ProjectTone } from '@/data/content';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

/* ---------------------------------------------------------------------------
   SideDither — a small decorative piece of the site's dither at the edge of
   a section, so the plain sections share the project scenes' material
   without becoming full-bleed texture. Three designs, each cropped by the
   screen edge so it reads as part of something larger:

     orb    a dithered sphere, half off screen
     plate  a framed panel with hairline border and corner marks (the
            blueprint vocabulary), the dither inside it
     arc    a ring that fades at both edges, like a ripple on the page

   WebGL budget: mounted only while its section is near the viewport and
   unmounted when it leaves, so it never adds to the contexts the project
   stack holds. Decorative: aria-hidden, no pointer events.
--------------------------------------------------------------------------- */
export function SideDither({
  side,
  tone,
  variant = 'orb',
  top = 50,
}: {
  side: 'left' | 'right';
  tone: ProjectTone;
  variant?: 'orb' | 'plate' | 'arc';
  /** vertical centre, % of the section */
  top?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`side-dither ${side} ${variant}`} style={{ top: `${top}%` }} ref={ref} aria-hidden="true">
      {on && (
        <Suspense fallback={null}>
          <Dithering
            colorBack="#00000000"
            colorFront={tone.color}
            shape={tone.shape}
            type="4x4"
            speed={0.15}
            size={variant === 'plate' ? 3 : 2}
            scale={variant === 'plate' ? 1.1 : 0.9}
            className="size-full"
            minPixelRatio={1}
          />
        </Suspense>
      )}
      {variant === 'plate' && (
        <>
          <span className="mk tl" />
          <span className="mk br" />
        </>
      )}
    </div>
  );
}
