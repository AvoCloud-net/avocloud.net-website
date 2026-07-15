import type { ReactNode } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLang } from '@/hooks/useLang';
import { Nav, Footer } from './Site';
import { Wordmark } from './Wordmark';

/* Nav + video hero + Footer as ONE React root — see BaxiApp.tsx for why:
   the Wordmark reveal only reliably fades out when it shares a gsap
   context with Shell, not as its own separate client:load island (that
   was CraftAttackTitle.tsx's approach before this merge). The `.ca-hero*`
   rules below were previously Astro-scoped page CSS, which never reaches
   markup rendered inside a client:load island — moved here as a plain
   <style> tag (unscoped, real DOM node) so the media query still works. */
export default function CraftAttackApp({ children }: { children: ReactNode }) {
  useSmoothScroll();
  const { lang, t, toggle } = useLang();

  return (
    <>
      <Nav active="" t={t} lang={lang} toggle={toggle} base="/" />

      <main>
        <section className="ca-hero" id="hero">
          <video autoPlay muted loop playsInline preload="auto" poster="/assets/images/craftattack/ca-s2-4.png" aria-label="Craft Attack Season 2 — Aerlon world trailer">
            <source src="/craftattack/craftattack.webm" type="video/webm" />
          </video>
          <div className="ca-hero-overlay" />
          <div className="wrap ca-hero-content">
            <h1 className="ca-h1">
              <span className="font-mono text-sm tracking-widest uppercase opacity-70 mb-2 block">Avocloud.net x</span>
              <Wordmark as="div" textClass="hero-wordmark" trigger="load" timeScale={0.6} word="CRAFT ATTACK" coralFrom={0} round={new Set()} />
              <span className="font-mono text-sm tracking-wide uppercase opacity-85 block">Open Craft Attack Community Server</span>
            </h1>
            <p className="ca-hero-lede">
              <strong>Open Craft Attack Community Server — Season 2: The Ashes of Aerlon</strong>
            </p>
            <p className="ca-hero-lede">
              Server Address: <strong style={{ color: 'var(--coral-soft)' }}>craftattack.avocloud.net</strong>
            </p>
            <p className="ca-hero-tagline">
              The open Craft Attack community for everyone — join Season 2 free, no application form.
            </p>
            <p className="ca-hero-quote">
              „Aerlon was once a great kingdom, powerful, radiant, full of magic and life.
              <br />
              Now new travelers come to the land."
            </p>
            <div className="ca-hero-ctas">
              <a href="/craftattack/join/" className="btn primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                How to Join
              </a>
              <a href="https://avocloud.net/discord/" className="btn" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Discord
              </a>
            </div>
          </div>
        </section>

        {children}
      </main>
      <Footer t={t} />

      <style>{`
        .ca-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
        }
        .ca-hero video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .ca-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.75));
          z-index: 1;
        }
        .ca-hero-content { position: relative; z-index: 2; padding: 8rem 0 4rem; }
        .ca-h1 { margin-bottom: 1.5rem; }
        .ca-hero-lede { font-size: 1rem; margin-bottom: 0.5rem; }
        .ca-hero-tagline { font-size: 0.95rem; margin: 1rem auto 0; max-width: 560px; opacity: 0.9; }
        .ca-hero-quote { font-size: 0.9rem; font-style: italic; opacity: 0.75; max-width: 480px; margin: 0.75rem auto 2rem; line-height: 1.6; }
        .ca-hero-ctas { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .ca-hero-ctas { flex-direction: column; align-items: stretch; }
        }
      `}</style>
    </>
  );
}
