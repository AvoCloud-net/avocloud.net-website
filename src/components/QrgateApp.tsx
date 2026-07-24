import type { ReactNode } from "react";
import { useRef } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useLang } from "@/hooks/useLang";
import { Nav, Footer } from "./Site";
import { useSlotMotion } from "./slot-motion";
import { Btn } from "./Btn";
import { GithubIcon, MailStroke } from "./icons";
import { HeroShell } from "./HeroShell";

/* Nav + Hero + Footer as ONE React root — see BaxiApp.tsx for why: the
   Wordmark reveal only reliably fades out when it shares a gsap context
   with Shell, not as its own separate client:load island. */
export default function QrgateApp({ children }: { children: ReactNode }) {
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
          word="QRGATE"
          coralFrom={2}
          round={new Set(["G"])}
          kicker="Open-source · Event Ticketing"
          claim={
            <>
              Sell tickets online and at the door, scan QR codes at entry, and
              manage everything from a single dashboard. Free. Self-hosted. Open
              source.
            </>
          }
          stats={
            <>
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
            </>
          }
          links={
            <>
              <Btn
                href="https://github.com/rwolf2467/qr_gate"
                rel="noreferrer"
                icon={<GithubIcon />}
                primary
              >
                View on GitHub
              </Btn>
              <Btn href="mailto:support@avocloud.net" icon={<MailStroke />}>
                Contact
              </Btn>
            </>
          }
          footnote={
            <>
              <span className="chip">Free &amp; Open Source</span>
              <span className="chip">No App Needed</span>
              <span className="chip">Self-Hosted</span>
              <span className="chip">In Production</span>
            </>
          }
        />

        {children}
      </main>
      <Footer t={t} />
    </>
  );
}
