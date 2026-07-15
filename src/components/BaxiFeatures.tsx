import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { baxiFeatures } from '@/data/baxiFeatures';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Same pinned horizontal-scroll pattern as the homepage's Projects section
   (src/components/Site.tsx) — reuses the exact .proj-h/.proj-track/.proj-panel/
   pp-* classes from global.css so the two carousels look and behave identically. */
export default function BaxiFeatures() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (reduce) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        const track = trackRef.current!;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const pan = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
            },
          },
        });

        gsap.utils.toArray<HTMLElement>('.proj-panel', track).forEach((panel) => {
          gsap.fromTo(
            panel,
            { opacity: 0, scale: 0.94, yPercent: 6 },
            {
              opacity: 1,
              scale: 1,
              yPercent: 0,
              ease: 'power1.out',
              scrollTrigger: { trigger: panel, containerAnimation: pan, start: 'left 95%', end: 'left 55%', scrub: true },
            },
          );
        });
      });
    },
    { scope: sectionRef, dependencies: [reduce] },
  );

  return (
    <section className={`proj-h${reduce ? ' no-pin' : ''}`} id="features" ref={sectionRef}>
      <div className="proj-track" ref={trackRef}>
        <div className="proj-intro">
          <div className="section-label">FEATURES</div>
          <h2 className="proj-intro-title">What Baxi Offers</h2>
          <div className="proj-scroll-cue" aria-hidden="true">
            <span>SCROLL</span>
            <span className="arrow" />
          </div>
        </div>

        {baxiFeatures.map((f) => (
          <article className="proj-panel" key={f.num}>
            <span className="mk tl" />
            <span className="mk br" />
            <header className="pp-top">
              <span className="pp-num">{f.num}</span>
              <span className="pp-icon" dangerouslySetInnerHTML={{ __html: f.icon }} />
            </header>
            <div className="pp-body">
              <h3 className="pp-name" dangerouslySetInnerHTML={{ __html: f.name }} />
              <p className="pp-desc" dangerouslySetInnerHTML={{ __html: f.desc }} />
            </div>
          </article>
        ))}
      </div>

      {!reduce && (
        <div className="proj-progress" aria-hidden="true">
          <span className="proj-progress-bar" ref={barRef} />
        </div>
      )}
    </section>
  );
}
