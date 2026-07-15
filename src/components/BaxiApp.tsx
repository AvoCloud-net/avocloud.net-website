import type { ReactNode } from 'react';
import { useState, Suspense, lazy } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLang } from '@/hooks/useLang';
import { Nav, Footer } from './Site';
import { Reveal } from './reveal';
import { Magnetic, CountUp } from './motion';
import { GithubIcon, DiscordIcon } from './icons';
import { Wordmark } from './Wordmark';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

const InviteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

/* Nav + Hero + Footer as ONE React root (like the homepage's Site.tsx) —
   the Wordmark's GSAP reveal only completes reliably when it shares a
   react tree/gsap context with Shell; as a separate client:load island
   (the previous BaxiHero.tsx approach) its fade-out tween silently never
   applies to the live DOM (confirmed: gsap reports the timeline reaching
   progress 1, but the CAD guide lines stay visually stuck). See Shell.tsx
   for the plain (no-hero) version other subpages use. */
export default function BaxiApp({ children }: { children: ReactNode }) {
  useSmoothScroll();
  const { lang, t, toggle } = useLang();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Nav active="" t={t} lang={lang} toggle={toggle} base="/" />

      <main>
      <section
        className="hero relative overflow-hidden bg-card md:rounded-[48px] md:border md:border-border md:shadow-sm"
        id="hero"
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
          <Reveal
            as="div"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
            y={12}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Discord Bot · Verified · Open Source
          </Reveal>

          <Wordmark as="h1" textClass="hero-wordmark" trigger="load" timeScale={0.6} word="BAXI" coralFrom={4} round={new Set()} />

          <Reveal
            as="p"
            className="hero-claim text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
            y={16}
            delay={0.1}
          >
            A modern, privacy-focused Discord moderation bot.
          </Reveal>

          <Reveal className="hero-stats flex flex-wrap items-center justify-center gap-8 mb-12" y={16} delay={0.16}>
            <div className="stat">
              <CountUp className="n" value={20} suffix="+" />
              <span className="l">Features</span>
            </div>
            <div className="stat">
              <span className="n">MIT</span>
              <span className="l">License</span>
            </div>
            <div className="stat">
              <span className="n">✓</span>
              <span className="l">Verified</span>
            </div>
          </Reveal>

          <Reveal className="hero-links flex flex-wrap items-center justify-center gap-3" y={16} delay={0.22}>
            <Magnetic
              href="https://avocloud.net/baxi/invite/"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-8 text-base font-medium text-primary-foreground backdrop-blur-sm transition-all duration-300 hover:bg-primary/90 hover:ring-4 hover:ring-primary/20"
            >
              <InviteIcon />
              Invite Baxi
            </Magnetic>
            <Magnetic
              href="https://baxi.avocloud.net/"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
            >
              <DashboardIcon />
              Dashboard
            </Magnetic>
            <Magnetic
              href="https://github.com/AvoCloud-net/Baxi"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
            >
              <GithubIcon />
              GitHub
            </Magnetic>
            <Magnetic
              href="https://avocloud.net/discord/"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
            >
              <DiscordIcon />
              Discord
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {children}
      </main>
      <Footer t={t} />
    </>
  );
}
