import type { ReactNode } from 'react';
import { useRef } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLang } from '@/hooks/useLang';
import { Nav, Footer } from './Site';
import { useSlotMotion } from './slot-motion';
import { Btn } from './Btn';
import { DiscordIcon } from './icons';
import { HeroShell } from './HeroShell';
import { copy, facts, todoText } from '@/data/community';

const JoinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* Same structure as CraftAttackApp: Nav + hero + Footer in one React root so
   the Wordmark reveal shares the shell's gsap context, page body slotted in.

   `.mc-theme` on <main> swaps the accent for this page's own. It stops at
   <main> on purpose: the nav logo and the footer wordmark are the AvoCloud
   brand and keep its coral.

   `hero={false}` is the join and rules subpages: same nav and footer, no
   hero. Their section links (`#about`, …) point back at the main page. */
export default function CommunityApp({ children, hero = true }: { children: ReactNode; hero?: boolean }) {
  useSmoothScroll();
  const slot = useRef<HTMLElement>(null);
  useSlotMotion(slot);
  const { lang, t, toggle } = useLang();
  const c = copy.de.hero;
  const links = copy.de.nav.map((l) => (!hero && l.href.startsWith('#') ? { ...l, href: `/craftattack/${l.href}` } : l));

  return (
    <>
      <Nav active="" t={t} lang={lang} toggle={toggle} base="/" links={links} />

      <main id="main" className="mc-theme" tabIndex={-1} ref={slot}>
        {hero && <HeroShell
          id="hero"
          word={(facts.name ?? todoText('NAME')).toUpperCase()}
          coralFrom={0}
          round={new Set()}
          tone="#7a5a2a"
          backdrop="/assets/images/craftattack/ca-hero.webp"
          /* a fragment, not a string: HeroShell only runs the terminal-style
             scramble on plain strings, and this page talks to players */
          claim={<>{c.claim}</>}
          stats={
            <>
              {c.stats.map((s) => (
                <div className="stat" key={s.l}>
                  <span className="n">{s.n}</span>
                  <span className="l">{s.l}</span>
                </div>
              ))}
            </>
          }
          links={
            <>
              <Btn href="/craftattack/join/" icon={<JoinIcon />} primary>{c.join}</Btn>
              <Btn href={facts.discord} icon={<DiscordIcon />}>{c.discord}</Btn>
            </>
          }
        />}

        {children}
      </main>
      <Footer t={t} />
    </>
  );
}
