import type { ReactNode } from 'react';
import { useState, Suspense, lazy } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLang } from '@/hooks/useLang';
import { Nav, Footer } from './Site';
import { Reveal } from './reveal';
import { Magnetic } from './motion';
import { Wordmark } from './Wordmark';
import { GithubIcon, MailStroke } from './icons';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

/* Nav + Hero + Footer as ONE React root — see BaxiApp.tsx for why: the
   Wordmark reveal only reliably fades out when it shares a gsap context
   with Shell, not as its own separate client:load island. */
export default function QrgateApp({ children }: { children: ReactNode }) {
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
            Open-source · Event Ticketing
          </Reveal>

          <Wordmark as="h1" textClass="hero-wordmark" trigger="load" timeScale={0.6} word="QRGATE" coralFrom={2} round={new Set(['G'])} />

          <Reveal
            as="p"
            className="hero-claim text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
            y={16}
            delay={0.1}
          >
            Sell tickets online and at the door, scan QR codes at entry, and manage everything from a
            single dashboard. Free. Self-hosted. Open source.
          </Reveal>

          <Reveal className="hero-stats flex flex-wrap items-center justify-center gap-8 mb-12" y={16} delay={0.16}>
            <div className="stat">
              <span className="n">0€</span>
              <span className="l">License Cost</span>
            </div>
            <div className="stat">
              <span className="n">3</span>
              <span className="l">User Roles</span>
            </div>
            <div className="stat">
              <span className="n">2</span>
              <span className="l">Payment Methods</span>
            </div>
            <div className="stat">
              <span className="n">MIT</span>
              <span className="l">License</span>
            </div>
          </Reveal>

          <Reveal className="hero-links flex flex-wrap items-center justify-center gap-3" y={16} delay={0.22}>
            <Magnetic
              href="https://github.com/rwolf2467/qr_gate"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-8 text-base font-medium text-primary-foreground backdrop-blur-sm transition-all duration-300 hover:bg-primary/90 hover:ring-4 hover:ring-primary/20"
            >
              <GithubIcon />
              View on GitHub
            </Magnetic>
            <Magnetic
              href="mailto:support@avocloud.net"
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
            >
              <MailStroke />
              Contact
            </Magnetic>
          </Reveal>

          <Reveal className="chips justify-center mt-8" y={16} delay={0.28}>
            <span className="chip">Free & Open Source</span>
            <span className="chip">No App Needed</span>
            <span className="chip">Self-Hosted</span>
            <span className="chip">In Production</span>
          </Reveal>
        </div>
      </section>

      {children}
      </main>
      <Footer t={t} />
    </>
  );
}
