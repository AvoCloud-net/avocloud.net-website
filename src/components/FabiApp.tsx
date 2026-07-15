import type { ReactNode } from 'react';
import { useState, Suspense, lazy } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLang } from '@/hooks/useLang';
import { Nav, Footer } from './Site';
import { Reveal } from './reveal';
import { Magnetic } from './motion';
import { GithubIcon } from './icons';
import { Wordmark } from './Wordmark';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

const photoRingStyle: React.CSSProperties = {
  width: 'clamp(96px, 12vw, 128px)',
  height: 'clamp(96px, 12vw, 128px)',
  borderRadius: '50%',
  overflow: 'hidden',
  border: '3px solid rgba(var(--coral-rgb), 0.4)',
  boxShadow: '0 0 0 6px rgba(var(--coral-rgb), 0.1), 0 24px 64px rgba(var(--coral-rgb), 0.28)',
  margin: '0 auto 1.5rem',
};

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

/* Same shader-hero treatment as Baxi/QrGate/index — Dithering backdrop,
   eyebrow badge, Wordmark reveal, stat row, frosted pill links — the
   fabi page's hero previously used a completely different (plain, no
   shader, mono .btn) style that clashed with the rest of the redesign. */
export default function FabiApp({ children }: { children: ReactNode }) {
  useSmoothScroll();
  const { lang, t, toggle } = useLang();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Nav active="" t={t} lang={lang} toggle={toggle} base="/" />

      <main>
        <section
          className="hero relative overflow-hidden bg-card md:rounded-[48px] md:border md:border-border md:shadow-sm"
          id="intro"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen">
              <Dithering
                colorBack="#00000000"
                colorFront="#bf5037"
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
            <Reveal as="div" y={12}>
              <div style={photoRingStyle}>
                <img src="/assets/images/fabian2.jpg" alt="Fabian Murauer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>

            <Reveal
              as="div"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
              y={12}
              delay={0.05}
            >
              Red_Wolf2467 · Avocloud.net
            </Reveal>

            <Wordmark as="h1" textClass="hero-wordmark" trigger="load" timeScale={0.6} word="FABIAN MURAUER" coralFrom={14} round={new Set()} />

            <Reveal
              as="p"
              className="hero-claim text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
              y={16}
              delay={0.1}
            >
              Software Developer · Network &amp; Systems Engineering
              <br />
              Founder of Avocloud.net · Student at HTL Traun
            </Reveal>

            <Reveal className="chips justify-center mb-6" y={16} delay={0.13}>
              <span className="chip">Student · Not seeking employment</span>
            </Reveal>

            <Reveal className="hero-stats flex flex-wrap items-center justify-center gap-8 mb-12" y={16} delay={0.16}>
              <div className="stat">
                <span className="n">5+</span>
                <span className="l">Years</span>
              </div>
              <div className="stat">
                <span className="n">6+</span>
                <span className="l">Projects</span>
              </div>
            </Reveal>

            <Reveal className="hero-links flex flex-wrap items-center justify-center gap-3" y={16} delay={0.22}>
              <Magnetic
                href="https://github.com/rwolf2467"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
              >
                <GithubIcon />
                rwolf2467
              </Magnetic>
              <Magnetic
                href="https://github.com/AvoCloud-net"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
              >
                <GithubIcon />
                AvoCloud-net
              </Magnetic>
              <Magnetic
                href="https://www.instagram.com/red_wolf2467/"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
              >
                <InstagramIcon />
                @red_wolf2467
              </Magnetic>
              <Magnetic
                href="mailto:fabian.murauer@avocloud.net"
                className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
              >
                <MailIcon />
                E-Mail
              </Magnetic>
            </Reveal>

            <Reveal className="chips justify-center items-center mt-8" y={16} delay={0.28}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)' }}>Currently building:</span>
              <span className="chip">Baxi</span>
              <span className="chip">EduGrade</span>
              <span className="chip">QrGate</span>
            </Reveal>
          </div>
        </section>

        {children}
      </main>
      <Footer t={t} />
    </>
  );
}
