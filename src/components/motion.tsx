import { useRef } from 'react';
import { gsap, ScrollTrigger, Observer, useGSAP, EASE, DUR, START } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ---------------------------------------------------------------------------
   Magnetic — button/link that eases toward the cursor + hover pop.
   Driven by gsap.quickTo (writes straight to the transform, no React renders).
   Pointer plumbing is a single GSAP Observer rather than five hand-attached
   listeners, so pointer/touch/mouse normalisation is the library's problem.
--------------------------------------------------------------------------- */
type MagneticProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  strength?: number;
  target?: string;
  rel?: string;
  'aria-label'?: string;
  title?: string;
  onClick?: () => void;
};

export function Magnetic({ children, href, className, strength = 0.32, onClick, ...rest }: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduce || !ref.current) return;
      const el = ref.current;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      const sTo = gsap.quickTo(el, 'scale', { duration: DUR.micro, ease: EASE.out });

      const obs = Observer.create({
        target: el,
        type: 'pointer',
        onMove: (self) => {
          const e = self.event as PointerEvent;
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        },
        onHover: () => sTo(1.045),
        onHoverEnd: () => {
          // settle back with a touch of overshoot instead of sliding linearly
          // home — the button reads as sprung rather than scripted.
          gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.55, ease: EASE.spring, overwrite: 'auto' });
        },
        onPress: () => sTo(0.96),
        onRelease: () => sTo(1.045),
      });

      return () => obs.kill();
    },
    { scope: ref, dependencies: [reduce, strength] },
  );

  const Tag: any = href ? 'a' : 'button';
  return (
    <Tag ref={ref} href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------------------
   CountUp — animates 0 → value when scrolled into view.
   Writes straight to textContent: routing every frame through setState meant
   ~84 React renders per counter for a number that nothing else depends on.
--------------------------------------------------------------------------- */
export function CountUp({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // Server-rendered content is already the final value, so reduced motion
      // needs to do nothing at all.
      if (reduce) return;

      const run = () => {
        const proxy = { v: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(proxy, {
          v: value,
          duration: 1.4,
          ease: 'power3.out',
          snap: { v: 1 },
          onUpdate: () => { el.textContent = `${proxy.v}${suffix}`; },
        });
      };

      // Counters in the hero are on screen at load. A ScrollTrigger there
      // never fires — `clamp()` pins its start to 0 and at scrollY 0 the
      // trigger sits exactly on that boundary — so the count was zeroed and
      // then left there, permanently reading "0+ / 0 / 0".
      //
      // Visible now → run it. Below the fold → wait for the scroll.
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) {
        run();
        return;
      }

      const st = ScrollTrigger.create({ trigger: el, start: START.reveal, once: true, onEnter: run });
      return () => st.kill();
    },
    { scope: ref, dependencies: [reduce, value, suffix] },
  );

  // SSR/no-JS renders the final number — the tween only ever counts up to
  // something that is already correct in the markup.
  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
