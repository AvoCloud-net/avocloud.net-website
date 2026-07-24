import type { ReactNode } from "react";
import { useRef } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useLang } from "@/hooks/useLang";
import { Nav, Footer } from "./Site";
import { useSlotMotion } from "./slot-motion";
import { Btn } from "./Btn";
import { CountUp } from "./motion";
import { GithubIcon, DiscordIcon } from "./icons";
import { HeroShell } from "./HeroShell";

const InviteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const DashboardIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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
  const slot = useRef<HTMLElement>(null);
  useSlotMotion(slot);
  const { lang, t, toggle } = useLang();

  return (
    <>
      <Nav active="" t={t} lang={lang} toggle={toggle} base="/" />

      <main ref={slot}>
        <HeroShell
          id="hero"
          word="BAXI"
          coralFrom={4}
          round={new Set()}
          kicker="Discord Bot · Verified · Open Source"
          claim="A modern, privacy-focused Discord moderation bot."
          stats={
            <>
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
            </>
          }
          links={
            <>
              <Btn
                href="/baxi/invite/"
                icon={<InviteIcon />}
                primary
              >
                Invite Baxi
              </Btn>
              <Btn
                href="https://baxi.avocloud.net/"
                rel="noreferrer"
                icon={<DashboardIcon />}
              >
                Dashboard
              </Btn>
              <Btn
                href="https://github.com/AvoCloud-net/Baxi"
                rel="noreferrer"
                icon={<GithubIcon />}
              >
                GitHub
              </Btn>
              <Btn
                href="/discord/"
                icon={<DiscordIcon />}
              >
                Discord
              </Btn>
            </>
          }
        />

        {children}
      </main>
      <Footer t={t} />
    </>
  );
}
