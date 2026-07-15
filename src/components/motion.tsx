import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------------------------------------------------------------------------
   Magnetic — button/link that eases toward the cursor + hover pop.
   Driven by gsap.quickTo (writes straight to the transform, no React renders).
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
      const sTo = gsap.quickTo(el, 'scale', { duration: 0.3, ease: 'power2.out' });

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const onEnter = () => sTo(1.045);
      const onLeave = () => {
        xTo(0);
        yTo(0);
        sTo(1);
      };
      const onDown = () => sTo(0.96);
      const onUp = () => sTo(1.045);

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('mousedown', onDown);
      el.addEventListener('mouseup', onUp);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.removeEventListener('mousedown', onDown);
        el.removeEventListener('mouseup', onUp);
      };
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
   TiltStage — hero wordmark 3D tilt toward the cursor, spring-smoothed.
--------------------------------------------------------------------------- */
export function TiltStage({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduce) return;

      const rxTo = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power2.out' });
      const ryTo = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power2.out' });
      const onMove = (e: MouseEvent) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        ryTo(((e.clientX - cx) / cx) * 8);
        rxTo((-(e.clientY - cy) / cy) * 15);
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    },
    { scope: ref, dependencies: [reduce] },
  );

  return (
    <div className="hero-stage" ref={ref} style={{ perspective: 900 }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   CountUp — animates 0 → value when scrolled into view.
--------------------------------------------------------------------------- */
export function CountUp({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduce) {
        setDisplay(value);
        return;
      }
      const proxy = { v: 0 };
      setDisplay(0);
      gsap.to(proxy, {
        v: value,
        duration: 1.4,
        ease: 'power3.out',
        onUpdate: () => setDisplay(Math.round(proxy.v)),
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    },
    { scope: ref, dependencies: [reduce, value] },
  );

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

/* ---------------------------------------------------------------------------
   Scramble — decode text effect. Renders final text on the server (SEO-safe),
   then plays the decode on mount and whenever `text` changes (language switch).
--------------------------------------------------------------------------- */
const GLYPHS = '!<>-_\\/[]{}=+*^?#________ABCDEFGHKLMNPRSTVXZ';

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function Scramble({ text, className, duration = 1200 }: { text: string; className?: string; duration?: number }) {
  const reduce = useReducedMotion();
  const final = `<span class="hi">${escapeHtml(text)}</span>`;
  const [html, setHtml] = useState(final);

  useGSAP(
    () => {
      if (reduce) {
        setHtml(final);
        return;
      }
      let raf = 0;
      let start: number | null = null;
      const chars = text.split('');
      const reveal = chars.map((_, i) => (i / chars.length) * 0.6 + Math.random() * 0.4);

      function frame(now: number) {
        if (start === null) start = now;
        const p = Math.min((now - start) / duration, 1);
        let out = '';
        for (let i = 0; i < chars.length; i++) {
          if (chars[i] === ' ') { out += ' '; continue; }
          if (p >= reveal[i]) out += `<span class="hi">${escapeHtml(chars[i])}</span>`;
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setHtml(out + (p < 1 ? '<span class="cursor">_</span>' : ''));
        if (p < 1) raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(raf);
    },
    { dependencies: [text, reduce] },
  );

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
