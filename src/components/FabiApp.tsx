import type { ReactNode } from "react";
import { useRef } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useLang } from "@/hooks/useLang";
import { Nav, Footer } from "./Site";
import { useSlotMotion } from "./slot-motion";
import { Btn } from "./Btn";
import { GithubIcon } from "./icons";
import { HeroShell } from "./HeroShell";

const photoRingStyle: React.CSSProperties = {
  width: "clamp(96px, 12vw, 128px)",
  height: "clamp(96px, 12vw, 128px)",
  borderRadius: "50%",
  overflow: "hidden",
  border: "3px solid rgba(var(--coral-rgb), 0.4)",
  boxShadow:
    "0 0 0 6px rgba(var(--coral-rgb), 0.1), 0 24px 64px rgba(var(--coral-rgb), 0.28)",
  margin: "0 auto 1.5rem",
};

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

/* Same HeroShell as the homepage and the product pages — this page used to
   carry its own copy of the pasted shadcn hero (48px radii, pill CTAs). */
export default function FabiApp({ children }: { children: ReactNode }) {
  useSmoothScroll();
  const slot = useRef<HTMLElement>(null);
  useSlotMotion(slot);
  const { lang, t, toggle } = useLang();

  return (
    <>
      <Nav active="" t={t} lang={lang} toggle={toggle} base="/" />

      <main ref={slot}>
        <HeroShell
          id="intro"
          word="FABIAN MURAUER"
          coralFrom={14}
          round={new Set()}
          media={
            <div style={photoRingStyle}>
              <img
                src="/assets/images/fabian2.jpg"
                alt="Fabian Murauer"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          }
          kicker="Red_Wolf2467 · Avocloud.net"
          claim={
            <>
              Software Developer · Network &amp; Systems Engineering
              <br />
              Founder of Avocloud.net · Student at HTL Traun
            </>
          }
          stats={
            <>
              <div className="stat">
                <span className="n">5+</span>
                <span className="l">Years</span>
              </div>
              <div className="stat">
                <span className="n">6+</span>
                <span className="l">Projects</span>
              </div>
            </>
          }
          links={
            <>
              <Btn
                href="https://github.com/rwolf2467"
                rel="noreferrer"
                icon={<GithubIcon />}
              >
                rwolf2467
              </Btn>
              <Btn
                href="https://github.com/AvoCloud-net"
                rel="noreferrer"
                icon={<GithubIcon />}
              >
                AvoCloud-net
              </Btn>
              <Btn
                href="https://www.instagram.com/red_wolf2467/"
                rel="noreferrer"
                icon={<InstagramIcon />}
              >
                @red_wolf2467
              </Btn>
              <Btn
                href="mailto:fabian.murauer@avocloud.net"
                icon={<MailIcon />}
              >
                E-Mail
              </Btn>
            </>
          }
          footnote={
            <>
              <span className="chip">Student · Not seeking employment</span>
              <span className="chip">Baxi</span>
              <span className="chip">EduGrade</span>
              <span className="chip">QrGate</span>
            </>
          }
        />

        {children}
      </main>
      <Footer t={t} />
    </>
  );
}
