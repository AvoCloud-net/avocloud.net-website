import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/motion';

/* ---------------------------------------------------------------------------
   Ticker — a mono band that runs continuously between sections.

   Two jobs. It's the one element on the page that moves whether or not you
   scroll, which gives the layout a pulse; and it reacts to scrolling, so the
   page feels connected to the input rather than merely triggered by it:

     · base drift runs forever at a slow constant rate (`ease: none`)
     · scroll velocity multiplies the rate, so a fast scroll flings it
     · scroll direction flips its direction

   Seamless loop: the item list is rendered twice and the track animates a flat
   -50%. At the halfway point the second copy sits exactly where the first
   started, so `repeat: -1` is invisible — no measuring, no resize maths, no
   gap on wide screens.
--------------------------------------------------------------------------- */
export function Ticker({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = ref.current!.querySelector<HTMLElement>('.ticker-track')!;

        const loop = gsap.to(track, {
          xPercent: -50,
          duration: 28,
          ease: EASE.none,
          repeat: -1,
        });

        // timeScale carries both speed and direction. clamp() keeps a flick
        // from turning it into a blur, and quickTo eases it back to the base
        // rate on its own as velocity decays — no reset timer needed.
        const clamp = gsap.utils.clamp(-9, 9);
        const rate = gsap.quickTo(loop, 'timeScale', { duration: 0.6, ease: EASE.out });

        const st = ScrollTrigger.create({
          trigger: document.body,
          start: 'top top',
          end: 'max',
          onUpdate: (self) => {
            const v = self.getVelocity() / 260;
            rate(clamp(self.direction === -1 ? -1 - Math.abs(v) : 1 + Math.abs(v)));
          },
        });

        return () => {
          st.kill();
          loop.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // rendered twice — see the seamless-loop note above
  const row = (key: string) => (
    <div className="ticker-row" key={key} aria-hidden={key === 'b' ? true : undefined}>
      {items.map((it, i) => (
        <span className="ticker-item" key={i}>
          {it}
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker" ref={ref}>
      <div className="ticker-track">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
