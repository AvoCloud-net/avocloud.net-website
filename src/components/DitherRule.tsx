import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { ShaderBoundary } from './ShaderBoundary';
import { gsap, useGSAP, EASE } from '@/lib/motion';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

/* ---------------------------------------------------------------------------
   DitherRule — a quiet section separator made of the site's dither.

   A slim strip (not a band): calm shapes only (warp / simplex, no rings),
   a dark rust well below the hero's intensity, and an elliptical mask so it
   fades out on all four sides and never meets the page edge as a hard line.
   Scrubbed: it brightens while it crosses the middle of the viewport and the
   texture drifts sideways, so it reads as a pass of light between chapters.

   Mounted only near the viewport; decorative, aria-hidden.
--------------------------------------------------------------------------- */
export function DitherRule({
  shape = 'warp',
  color = '#7a4534',
}: {
  shape?: 'warp' | 'simplex';
  color?: string;
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(ref);
        const st = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true };
        gsap
          .timeline({ scrollTrigger: st })
          .fromTo(q('.dither-rule-in'), { opacity: 0.15 }, { opacity: 1, ease: EASE.out, duration: 0.5 })
          .to(q('.dither-rule-in'), { opacity: 0.15, ease: EASE.inOut, duration: 0.5 });
        gsap.fromTo(q('.dither-rule-in'), { xPercent: -4 }, { xPercent: 4, ease: EASE.none, scrollTrigger: st });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div className="dither-rule" ref={ref} aria-hidden="true">
      <div className="dither-rule-in">
        {on && (
          <ShaderBoundary>
            <Suspense fallback={null}>
              <Dithering
                colorBack="#00000000"
                colorFront={color}
                shape={shape}
                type="4x4"
                speed={0.12}
                size={2}
                scale={0.9}
                className="size-full"
                minPixelRatio={1}
              />
            </Suspense>
          </ShaderBoundary>
        )}
      </div>
    </div>
  );
}
