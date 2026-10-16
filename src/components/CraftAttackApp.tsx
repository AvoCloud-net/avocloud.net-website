import type { ReactNode } from 'react';
import { useRef } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLang } from '@/hooks/useLang';
import { Nav, Footer } from './Site';
import { useSlotMotion } from './slot-motion';
import { Btn } from './Btn';
import { CountUp } from './motion';
import { DiscordIcon } from './icons';
import { HeroShell } from './HeroShell';

const JoinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* Nav + hero + Footer as ONE React root, like BaxiApp — the Wordmark reveal
   only completes when it shares a gsap context with the shell. The body is
   plain Astro markup slotted in; useSlotMotion upgrades it. */
export default function CraftAttackApp({ children }: { children: ReactNode }) {
  useSmoothScroll();
  const slot = useRef<HTMLElement>(null);
  useSlotMotion(slot);
  const { lang, t, toggle } = useLang();

  return (
    <>
      <Nav active="" t={t} lang={lang} toggle={toggle} base="/" />

      <main id="main" tabIndex={-1} ref={slot}>
        <HeroShell
          id="hero"
          word="CRAFT ATTACK"
          coralFrom={0}
          round={new Set()}
          kicker="Open Community Server · Season 2"
          claim="The Ashes of Aerlon. Free to join, no application form."
          stats={
            <>
              <div className="stat">
                <span className="n">S2</span>
                <span className="l">Season</span>
              </div>
              <div className="stat">
                <CountUp className="n" value={10} />
                <span className="l">Rules</span>
              </div>
              <div className="stat">
                <span className="n">J+B</span>
                <span className="l">Crossplay</span>
              </div>
              <div className="stat">
                <span className="n">0€</span>
                <span className="l">Free</span>
              </div>
            </>
          }
          links={
            <>
              <Btn href="#join" icon={<JoinIcon />} primary>How to Join</Btn>
              <Btn href="/discord/" icon={<DiscordIcon />}>Discord</Btn>
            </>
          }
          footnote={
            <>
              <a className="chip link" href="#world">World</a>
              <a className="chip link" href="#features">Features</a>
              <a className="chip link" href="#join">Join</a>
              <a className="chip link" href="#rules">Rules</a>
            </>
          }
        />

        {children}
      </main>
      <Footer t={t} />
    </>
  );
}
