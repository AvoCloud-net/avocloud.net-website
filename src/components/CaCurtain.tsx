import type { ReactNode } from 'react';
import { ShaderBoundary } from './ShaderBoundary';
import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { gsap, useGSAP, EASE } from '@/lib/motion';
import type { ProjectTone } from '@/data/content';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

/* ---------------------------------------------------------------------------
   CaCurtain — a full-bleed frame that opens as it scrolls in, the same move
   as the homepage Finale: an inset window with the 8px box radius widens to
   full bleed while the picture inside settles from 112% to 100%. Scrubbed, so
   it runs backwards on the way up.

   Used twice on /craftattack/: the trailer band and the closing scene. Those
   are the page's two cinematic beats; everything between them stays quiet.

   `dither` puts the site's warp texture behind the content (the closing scene
   only — never over the video). Mounted on first approach, stopped off screen.
   No JS / reduced motion: the frame is simply open.
--------------------------------------------------------------------------- */
export function CaCurtain({
  id,
  className = '',
  label,
  dither = false,
  tone = { shape: 'warp', color: '#7a4534' },
  children,
}: {
  id?: string;
  className?: string;
  label?: string;
  dither?: boolean;
  /** shape and colour of the dither; defaults to Craft Attack's rust warp */
  tone?: ProjectTone;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!dither) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setNear(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [dither]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(ref);
        const st = { trigger: ref.current, start: 'top bottom', end: 'top 15%', scrub: true };
        gsap.fromTo(
          q('.ca-curtain-frame'),
          { clipPath: 'inset(7% 9% 7% 9% round 8px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: EASE.none, scrollTrigger: st },
        );
        const media = q('.ca-curtain-media, video');
        if (media.length) {
          gsap.fromTo(media, { scale: 1.12 }, { scale: 1, ease: EASE.none, scrollTrigger: st });
        }
        // the copy arrives late, once the frame is mostly open
        const copy = q('.ca-curtain-copy');
        if (copy.length) {
          gsap.fromTo(
            copy,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: EASE.out,
              scrollTrigger: { trigger: ref.current, start: 'top 55%', end: 'top 10%', scrub: true },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section className={`ca-curtain ${className}`} id={id} ref={ref} aria-label={label}>
      <div className="ca-curtain-frame">
        {dither && (
          <div className="ca-curtain-media ca-curtain-dither" aria-hidden="true">
            {seen && (
              <ShaderBoundary>
                <Suspense fallback={null}>
                  <Dithering
                    colorBack="#00000000"
                    colorFront={tone.color}
                    shape={tone.shape}
                    type="4x4"
                    speed={near ? 0.14 : 0}
                    className="size-full"
                    minPixelRatio={1}
                  />
                </Suspense>
              </ShaderBoundary>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
