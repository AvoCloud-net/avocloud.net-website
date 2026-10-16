import type { ReactNode } from "react";
import { useRef } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useLang } from "@/hooks/useLang";
import { Nav, Footer } from "./Site";
import { useSlotMotion } from "./slot-motion";
import { Btn } from "./Btn";
import { HeroShell } from "./HeroShell";

const LaunchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const DocsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

/* Nav + Hero + Footer as one React root — same shape as BaxiApp/EntreeApp,
   and for the same reason (the Wordmark reveal needs to share a gsap context
   with Shell). See BaxiApp.tsx.

   Replaces public/edugrade/index.html, a standalone 2183-line page that pulled
   Tailwind off a CDN at runtime and linked assets/css/main.css and
   assets/js/theme.js — neither of which exists, so its own stylesheet and its
   theme toggle 404'd in production. */
export default function EduGradeApp({ children }: { children: ReactNode }) {
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
          word="EDUGRADE"
          coralFrom={3}
          round={new Set()}
          kicker="Notenverwaltung · DSGVO-konform"
          claim="Klassen, Noten und Anwesenheit an einem Ort."
          stats={
            <>
              <div className="stat">
                <span className="n">DSGVO</span>
                <span className="l">konform</span>
              </div>
              <div className="stat">
                <span className="n">AT</span>
                <span className="l">Entwickelt in</span>
              </div>
              <div className="stat">
                <span className="n">AES-256</span>
                <span className="l">verschlüsselt</span>
              </div>
            </>
          }
          links={
            <>
              <Btn href="https://edugrade.at" rel="noreferrer" icon={<LaunchIcon />} primary>
                Jetzt starten
              </Btn>
              <Btn href="https://edugrade.at/docs/" rel="noreferrer" icon={<DocsIcon />}>
                Dokumentation
              </Btn>
            </>
          }
          footnote={
            <>
              <span className="chip">Schullizenzen</span>
              <span className="chip">Kein Download</span>
              <span className="chip">Auf jedem Gerät</span>
              <span className="chip">Zero-Knowledge</span>
            </>
          }
        />

        {children}
      </main>
      <Footer t={t} />
    </>
  );
}
