import { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  EASE,
  DUR,
  STAG,
  PRIORITY,
} from "@/lib/motion";
import {
  navLinks,
  tabs,
  projects,
  COPYRIGHT_YEAR,
} from "@/data/content";
import { company } from "@/data/company";
import { useLang } from "@/hooks/useLang";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Reveal, Kicker } from "./reveal";
import { Btn } from "./Btn";
import { Magnetic, CountUp } from "./motion";
import { Wordmark } from "./Wordmark";
import { HeroShell } from "./HeroShell";
import { Stage } from "./stage";
import { Ticker } from "./Ticker";
import { Chips } from "./Chips";
import { ProjectStack } from "./ProjectStack";
import { registerSnap } from "@/lib/snap";
import { Finale } from "./Finale";

import {
  ProjectIcon,
  IconChat,
  IconLayers,
  IconShield,
  IconHeart,
  IconMail,
  IconFile,
  DiscordIcon,
  MailStroke,
  BrandMark,
} from "./icons";

const SECTION_IDS = ["top", "about", "projects", "contact"];

/* Screen-high segments the scroll snap rests on (lib/snap.ts). The project
   stack and the finale register their own, finer zones — one per card and
   per sentence — so they are not listed here. */
const SNAP_SEGMENTS = [".seg-hero", "#about", "#mission", ".seg-collab", "#support", "#contact", ".site-footer"];

/* Each segment rests at its top; one taller than the screen (a phone, a long
   card grid) is a range from its top to its bottom edge, read freely.
   Passive ScrollTriggers rather than offsetTop: their start/end are already
   corrected for the pin spacers above, and recomputed on every refresh.
   Created after every section (this hook lives in the root, whose effects run
   last) and refreshed after the pins for the same reason. */
function useSegmentSnap() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const sts = SNAP_SEGMENTS.flatMap((sel) => {
        const el = document.querySelector(sel);
        return el
          ? [ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", refreshPriority: PRIORITY.nav })]
          : [];
      });
      const unsnap = registerSnap(() =>
        sts.map((st) => [st.start, Math.max(st.start, st.end)] as [number, number]),
      );
      return () => {
        unsnap();
        sts.forEach((st) => st.kill());
      };
    });
    return () => mm.revert();
  });
}

/* Ticker copy. Terse declaratives in the brand voice — what we make and
   who we are, not a slogan. Untranslated on purpose: these are product and
   category nouns that read the same in both languages. */
const TICKER = [
  "SOFTWARE FROM AUSTRIA",
  "DISCORD BOTS",
  "EVENT TICKETING",
  "GRADE MANAGEMENT",
  "WEB DEVELOPMENT",
  "SINCE 2024",
  "TOOLS THAT JUST RUN",
];

/* ---- NAV ---------------------------------------------------------------- */
// `base` prefixes the in-page section links ('#about' etc.) — homepage uses
// '' (plain anchors), subpages pass '/' so the nav routes back to the
// homepage's sections ('/#about') instead of scrolling nowhere on the spot.
//
// `i18n` gates the DE/EN switch. Only the homepage's copy lives in
// content.ts with both languages; every subpage is written in English in its
// own markup. Showing the switch there gave a control that changed the label
// on itself and nothing else — worse than not offering the choice.
export function Nav({
  active,
  t,
  lang,
  toggle,
  base = "",
  i18n = false,
  links,
}: {
  active: string;
  t: (k: string) => string;
  lang: string;
  toggle: () => void;
  base?: string;
  i18n?: boolean;
  /** in-page section links for a one-page subpage; default is the homepage's */
  links?: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top -40",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
      refreshPriority: PRIORITY.nav,
    });

    // Get the nav out of the way when reading downward, bring it straight back
    // on any upward intent. Held past 'top -40' so it never hides while the
    // hero is still on screen.
    const hide = ScrollTrigger.create({
      trigger: document.body,
      start: "top -240",
      end: "max",
      onUpdate: (self) => setHidden(self.direction === 1),
      onLeaveBack: () => setHidden(false),
      refreshPriority: PRIORITY.nav,
    });

    return () => {
      st.kill();
      hide.kill();
    };
  });

  // Entrance: the mark draws itself (same locked geometry as the logo,
  // BRANDING.md §2), then the wordmark and links arrive. Runs once on mount.
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav || reduce) return;
      gsap
        .timeline({ delay: 0.1 })
        // path only — the <rect> is the coral cursor (stroke:none, CSS blink);
        // DrawSVG has nothing to draw on it and would stamp a dasharray.
        .from(nav.querySelectorAll(".nav-logo svg path"), {
          drawSVG: "0%",
          duration: DUR.enter,
          ease: EASE.out,
        })
        .from(
          nav.querySelector(".nav-logo svg rect"),
          { opacity: 0, duration: DUR.micro },
          "-=0.15",
        )
        .from(
          nav.querySelector(".nav-logo span"),
          { opacity: 0, x: -6, duration: DUR.ui, ease: EASE.out },
          "-=0.35",
        )
        .from(
          nav.querySelectorAll(".nav-links > a, .nav-actions > *"),
          {
            opacity: 0,
            y: -6,
            duration: DUR.ui,
            ease: EASE.out,
            stagger: STAG.card,
          },
          "-=0.2",
        );
    },
    { scope: navRef, dependencies: [reduce] },
  );

  return (
    <nav
      // `!open`: never hide while the mobile dropdown is up — the user is in it
      className={`site-nav${scrolled ? " scrolled" : ""}${hidden && !open ? " hidden" : ""}`}
      ref={navRef}
    >
      <Magnetic
        href="/"
        className="nav-logo"
        aria-label="AVOCLOUD.NET"
        strength={0.2}
      >
        <BrandMark />
        <span>
          AVOCLOUD<span className="dot">.NET</span>
        </span>
      </Magnetic>

      <div className={`nav-links${open ? " open" : ""}`}>
        {(links ?? navLinks).map((l) => (
          <a
            key={l.href}
            href={links ? l.href : `${base}${l.href}`}
            className={active && `#${active}` === l.href ? "active" : undefined}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </div>

      <div className="nav-actions">
        {i18n && (
          <Magnetic
            className="nav-btn"
            onClick={toggle}
            strength={0.25}
            aria-label={lang === "en" ? "Auf Deutsch wechseln" : "Switch to English"}
            title={lang === "en" ? "Auf Deutsch wechseln" : "Switch to English"}
          >
            {lang === "en" ? "DE" : "EN"}
          </Magnetic>
        )}
<Magnetic
          className="nav-btn pill"
          href={`${base}#contact`}
          strength={0.25}
        >
          {lang === "en" ? "Contact" : "Kontakt"}
        </Magnetic>
      </div>

      <button
        className={`nav-toggle${open ? " open" : ""}`}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}

/* ---- READ PROGRESS ------------------------------------------------------
   Coral hairline across the top edge, scrubbed to document progress. Written
   with gsap.set from onUpdate rather than a tween: it's a readout, so it
   should track the scrollbar exactly, with no easing or catch-up lag.
--------------------------------------------------------------------------- */
function ReadProgress() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const bar = ref.current;
      if (!bar || reduce) return;
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "max",
        onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
        refreshPriority: PRIORITY.nav,
      });
      return () => st.kill();
    },
    { dependencies: [reduce] },
  );

  if (reduce) return null;
  return (
    <div className="read-progress" aria-hidden="true">
      <span ref={ref} />
    </div>
  );
}

/* ---- VERTICAL TABS ------------------------------------------------------ */
function ScrollTabs({ active }: { active: string }) {
  const ref = useRef<HTMLElement>(null);

  // The tabs are fixed at vertical center — flip to dark text whenever the
  // light mission band passes behind them, so the labels stay readable.
  // `toggleClass` replaces four hand-written enter/leave callbacks doing
  // classList add/remove; ScrollTrigger also removes the class on revert,
  // which the manual version never did.
  useGSAP(() => {
    const nav = ref.current;
    if (!nav) return;
    const st = ScrollTrigger.create({
      trigger: "#mission",
      start: "top center",
      end: "bottom center",
      toggleClass: { targets: nav, className: "on-light" },
      // These are created before the section pins further down the page
      // (this component mounts first), so they have to be re-measured after
      // the pins have inserted their scroll distance, not before.
      refreshPriority: PRIORITY.nav,
    });
    // Out of the way over the two fullscreen set pieces, where the rail would
    // sit on top of the big type.
    const away = ["#projects", "#finale"].map((trigger) =>
      ScrollTrigger.create({
        trigger,
        start: "top 60%",
        end: "bottom 40%",
        toggleClass: { targets: nav, className: "is-away" },
        refreshPriority: PRIORITY.nav,
      }),
    );
    return () => {
      st.kill();
      away.forEach((a) => a.kill());
    };
  });

  return (
    <nav className="scroll-tabs" aria-hidden="true" ref={ref}>
      {tabs.map((tab, i) => (
        <a
          key={tab.href}
          href={tab.href}
          /* aria-hidden AND focusable was the worst of both: assistive tech
             never sees these links, but a keyboard still lands on them, so
             tabbing walked through five stops that announce nothing. They
             duplicate the main nav exactly, so they stay hidden and leave the
             tab order rather than being read out twice. */
          tabIndex={-1}
          className={`#${active}` === tab.href ? "active" : undefined}
        >
          <span className="tick" />
          <span className="idx">{String(i + 1).padStart(2, "0")}</span>
          <span className="lbl">{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}

/* ---- HERO --------------------------------------------------------------- */
function Hero({ t }: { t: (k: string) => string }) {
  const products = projects.length;
  return (
    <HeroShell
      id="top"
      kicker={t("hero.eyebrow")}
      claim={t("hero.claim")}
      stats={
        <>
          <div className="stat">
            <CountUp className="n" value={products} />
            <span className="l">{t("stat.products")}</span>
          </div>
          <div className="stat">
            <span className="n">{company.countryCode}</span>
            <span className="l">{t("stat.based")}</span>
          </div>
          <div className="stat">
            <CountUp className="n" value={company.founded} />
            <span className="l">{t("stat.founded")}</span>
          </div>
        </>
      }
      links={
        <>
          <Btn href="#projects" primary>
            {t("projects.heading")}
          </Btn>
          <Btn href="#contact" icon={<MailStroke />}>
            {t("contact.heading")}
          </Btn>
        </>
      }
    />
  );
}

/* ---- ABOUT -------------------------------------------------------------- */
function About({ t }: { t: (k: string) => string }) {
  return (
    <Stage id="about" noExit dither={{ side: "right", variant: "orb", top: 38, tone: { shape: "sphere", color: "#c0654a" } }}>
      <Kicker>{t("about.label")}</Kicker>
      {/* data-depth separates the two columns slightly as the section travels,
          so it reads with thickness instead of one flat plane sliding past */}
      <div className="about-grid">
        <div data-depth="1.4">
          <Reveal as="h2" className="headline" variant="text">
            {t("about.heading")}
          </Reveal>
          <Reveal delay={0.05}>
            <p>{t("about.intro")}</p>
            <p>{t("about.body2")}</p>
          </Reveal>
        </div>
        {/* data-depth has to sit on a plain element — Reveal only forwards the
            props it knows about, so putting it on the component silently
            dropped it and the column never separated. */}
        {/* Two cards rather than two bare icon+heading+paragraph stacks. That
            pattern was the one place on the page with no blueprint vocabulary
            on it at all — no frame, no registration marks — so it read as
            generic filler next to every other section. */}
        <div data-depth="0.4">
          <Reveal variant="stagger" delay={0.14}>
            <article className="card">
              <span className="mk tl" />
              <span className="mk br" />
              <h3>
                <IconLayers />
                {t("about.build.heading")}
              </h3>
              <p>{t("about.build.body")}</p>
            </article>
            <article className="card mt">
              <span className="mk tl" />
              <span className="mk br" />
              <h3>
                <IconShield />
                {t("about.privacy.heading")}
              </h3>
              <p>{t("about.privacy.body")}</p>
            </article>
          </Reveal>
        </div>
      </div>
      <Reveal as="dl" className="about-facts" variant="stagger" delay={0.2}>
        {[
          [t("about.fact.seat"), `${company.city}, ${company.countryCode}`],
          [t("about.fact.since"), String(company.founded)],
          [t("about.fact.products"), String(projects.length).padStart(2, "0")],
          [t("about.fact.tracking"), t("about.fact.none")],
        ].map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </Reveal>
    </Stage>
  );
}

/* ---- MISSION (light band) ---------------------------------------------- */
function Mission({ t }: { t: (k: string) => string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduce) return;
      const base = {
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
        ease: EASE.none,
      };

      // Clear the CSS `translateY(-50%)` before driving these with yPercent.
      // GSAP parses that CSS rule into `y` (as px), and yPercent then stacks on
      // top of it rather than replacing it — the mark was ending up around
      // -100% instead of the intended -50%, which pushed it ~195px above the
      // section and clipped it against `overflow: hidden`.
      gsap.set(".mission .giant-mark, .mission .foil", { y: 0, yPercent: -50 });

      // ±7% of the element's own height. The band is short; a wide range walks
      // the mark straight out of the top or bottom edge no matter where it
      // starts, which is what the old -62 → -38 spread did.
      gsap.fromTo(
        ".mission .giant-mark",
        { yPercent: -57 },
        { yPercent: -43, ...base },
      );
      gsap.fromTo(
        ".mission .foil",
        { yPercent: -58, xPercent: 5 },
        { yPercent: -42, xPercent: -5, ...base },
      );

      // The blueprint diagram draws itself instead of just sitting there —
      // it's the same locked mark geometry as the logo (BRANDING.md §2), so
      // the section's visual event is the brand constructing itself. This
      // replaces the retired rainbow --iri foil as the band's focal point.
      const marks = gsap.utils.toArray<SVGPathElement>(
        ".mission .giant-mark path",
      );
      gsap
        .timeline({
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        })
        .from(marks, {
          drawSVG: "0%",
          duration: 1.1,
          ease: EASE.out,
          stagger: STAG.line,
        })
        .from(
          ".mission .giant-mark rect",
          {
            opacity: 0,
            scaleY: 0,
            transformOrigin: "50% 50%",
            duration: DUR.ui,
            ease: EASE.spring,
          },
          "-=0.3",
        )
        .from(
          ".mission .foil",
          { opacity: 0, duration: DUR.enter, ease: EASE.out },
          "-=0.5",
        );

      // The band arrives as an inset window and opens to full bleed. Done by
      // "top center", which is where ScrollTabs flips to dark labels — the
      // band is edge to edge by the time the tabs sit over it.
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(0% 6% 0% 6% round 8px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: EASE.none,
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "top center",
            scrub: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [reduce] },
  );

  /* The statement is read, not revealed: it sits dimmed and lights up word by
     word as the band scrolls through, so the eye is pulled along the sentence
     at scroll speed. Words inside the `.mark` highlight light up as one unit —
     its black plate can't dim with the words, so the plate itself carries the
     opacity. Separate from the hook above because it re-runs per language. */
  const bigRef = useRef<HTMLParagraphElement>(null);
  const big = t("mission.big");
  useGSAP(
    () => {
      const el = bigRef.current;
      if (!el || reduce) return;
      const split = SplitText.create(el, {
        type: "words",
        wordsClass: "lit-word",
        autoSplit: true,
        aria: "auto",
        onSplit: (self) => {
          const units = [
            ...new Set(
              (self.words as HTMLElement[]).map(
                (w) => w.closest<HTMLElement>(".mark") ?? w,
              ),
            ),
          ];
          // Played, not scrubbed. The page snaps, so the band is read from a
          // fixed rest position — a scrubbed reveal that only completes once
          // the text has travelled up the screen never finished there. It
          // starts as the band comes in and runs at its own pace; scrolling
          // back out above the trigger rewinds it.
          return gsap.fromTo(
            units,
            { opacity: 0.15 },
            {
              opacity: 1,
              ease: EASE.out,
              duration: 0.5,
              stagger: 0.09,
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        },
      });
      return () => split.revert();
    },
    { scope: bigRef, dependencies: [reduce, big] },
  );

  return (
    <section className="mission" id="mission" ref={ref}>
      <svg
        className="giant-mark"
        viewBox="0 0 72 72"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M22 18 L12 18 L12 54 L22 54"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 18 L60 18 L60 54 L50 54"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 30 L33 36 L26 42"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="40"
          y="28"
          width="4"
          height="16"
          rx="2"
          fill="rgba(255,107,74,0.45)"
          stroke="none"
        />
      </svg>
      <span className="foil" />
      <div className="wrap">
        <Kicker>{t("mission.label")}</Kicker>
        {/* keyed by the string: a language switch mounts a fresh <p> instead
            of React writing new HTML into one SplitText has already cut up */}
        <p
          key={big}
          ref={bigRef}
          className="big"
          dangerouslySetInnerHTML={{ __html: big }}
        />
        <Reveal as="ul" className="mission-points" variant="stagger" delay={0.1}>
          {[1, 2, 3].map((n) => (
            <li key={n}>
              <span className="mp-n">{String(n).padStart(2, "0")}</span>
              <b>{t(`mission.p${n}.h`)}</b>
              <span>{t(`mission.p${n}.b`)}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---- COLLABORATIONS ----------------------------------------------------- */
function Collab({ t }: { t: (k: string) => string }) {
  return (
    <Stage id="cooperation" dither={{ side: "left", variant: "arc", top: 55, tone: { shape: "wave", color: "#4aa3b8" } }}>
      <div data-depth="1.5">
        <Kicker>{t("collab.label")}</Kicker>
        <Reveal as="h2" className="headline" variant="text">
          {t("collab.heading")}
        </Reveal>
      </div>

      <Reveal className="grid cols-2" variant="stagger">
        <article className="card">
          <span className="mk tl" />
          <span className="mk br" />
          <h3 style={{ gap: "0.9rem" }}>
            <img
              className="avatar sm"
              src="/assets/images/cee.webp"
              alt=""
              width={52}
              height={52}
            />
            Cee_1{" "}
            <span className="role">Twitch Streamer</span>
          </h3>
          <p>{t("cee.desc")}</p>
          <Chips
            items={[
              { label: "Twitch" },
              { label: "Community" },
              { label: "Family friendly" },
              { label: "Twitch \u2197", href: "/link/cee/twitch.html" },
              { label: "YouTube \u2197", href: "/link/cee/yt.html" },
              { label: "Discord \u2197", href: "/link/cee/discord.html" },
            ]}
          />
        </article>
        <article className="card">
          <span className="mk tl" />
          <span className="mk br" />
          <h3>
            <ProjectIcon icon="ticket" />
            Helenenbühne Sattledt{" "}
            <span className="role">Parish theater group</span>
          </h3>
          <p>{t("helene.desc")}</p>
          <Chips
            items={[
              { label: "Client project" },
              { label: "Website" },
              { label: "Ticketing" },
              { label: "Website \u2197", href: "https://helenenbuehne.at" },
            ]}
          />
        </article>
      </Reveal>
    </Stage>
  );
}

/* ---- SUPPORT (Ko-fi) ---------------------------------------------------- */
function Support({ t }: { t: (k: string) => string }) {
  return (
    <Stage id="support" recede dither={{ side: "right", variant: "arc", top: 40, tone: { shape: "ripple", color: "#b89a4a" } }}>
      <div data-depth="1.5">
        <Kicker>{t("support.label")}</Kicker>
        <Reveal as="h2" className="headline" variant="text">
          {t("support.heading")}
        </Reveal>
      </div>

      <Reveal className="grid cols-2" variant="stagger">
        <article className="card kofi-card">
          <span className="mk tl" />
          <span className="mk br" />
          <h3>
            <IconHeart />
            Ko-fi
          </h3>
          <p>{t("support.body")}</p>
          {/* Ko-fi paints its own light UI and it is cross-origin, so it cannot
              be themed. Framed as a deliberate inset inside the card. */}
          <iframe
            id="kofiframe"
            className="kofi-embed"
            src="https://ko-fi.com/avocloudnet/?hidefeed=true&widget=true&embed=true&preview=true"
            height={640}
            loading="lazy"
            title="Support Avocloud.net on Ko-fi"
          />
        </article>
      </Reveal>
    </Stage>
  );
}

/* ---- CONTACT ------------------------------------------------------------ */
function Contact({ t }: { t: (k: string) => string }) {
  return (
    <Stage id="contact" dither={{ side: "left", variant: "orb", top: 60, tone: { shape: "swirl", color: "#6a70d0" } }}>
      <div data-depth="1.5">
        <Kicker>{t("contact.label")}</Kicker>
        <Reveal as="h2" className="headline" variant="text">
          {t("contact.heading")}
        </Reveal>
      </div>
      {/* one trigger for the row, stagger inside */}
      <Reveal className="grid cols-3" variant="stagger">
        <article className="card contact-card">
          <span className="mk tl" />
          <span className="mk br" />
          <h3>
            <IconMail />
            E-Mail
          </h3>
          <p>{t("contact.mail.text")}</p>
          <a href="/mail/" className="accent-link">
            {company.supportEmail} ↗
          </a>
        </article>
        <article className="card contact-card">
          <span className="mk tl" />
          <span className="mk br" />
          <h3>
            <IconChat />
            Discord
          </h3>
          <p>{t("contact.discord.text")}</p>
          <a href="/discord/" className="accent-link">
            avocloud.net/discord ↗
          </a>
        </article>
        <article className="card contact-card">
          <span className="mk tl" />
          <span className="mk br" />
          <h3>
            <IconFile />
            Legal
          </h3>
          <p>{t("contact.legal.text")}</p>
          <a href="/impressum/" className="accent-link">
            Imprint ↗
          </a>
          <br />
          <a href="/regulations/" className="accent-link">
            Regulations ↗
          </a>
        </article>
      </Reveal>
    </Stage>
  );
}

/* ---- FOOTER ------------------------------------------------------------- */
export function Footer({ t }: { t: (k: string) => string }) {
  return (
    <footer className="site-footer">
      <Wordmark
        as="div"
        textClass="footer-word"
        trigger="scroll"
        timeScale={0.6}
      />

      {/* One plain line under the wordmark — no frame, no box. */}
      <div className="footer-row">
        <span className="footer-copy">
          &copy; {COPYRIGHT_YEAR} {company.brand}. All rights reserved.
        </span>
        <a href="/mail/">Contact</a>
        <a href="/discord/">Discord</a>
        <a href="/impressum/">Imprint</a>
        <a href="/regulations/">Regulations</a>
      </div>
    </footer>
  );
}

/* ---- ROOT --------------------------------------------------------------- */
export default function Site() {
  useSmoothScroll();
  const { lang, t, toggle } = useLang(true);
  const active = useActiveSection(SECTION_IDS);
  useSegmentSnap();

  return (
    <>
      <Nav active={active} t={t} lang={lang} toggle={toggle} i18n />
      <ReadProgress />
      <ScrollTabs active={active} />
      {/* The one landmark the homepage was missing — subpages get theirs from
          Shell. It is also the skip link's target (see Layout.astro). */}
      <main id="main" className="snap-page" tabIndex={-1}>
        {/* The tickers live inside a segment, not between two: every segment
            fills the screen exactly, and a strip between them would leave the
            snap a choice of hiding it or showing it with a 49px misfit. */}
        <div className="seg seg-hero">
          <Hero t={t} />
          <Ticker items={TICKER} />
        </div>
        <About t={t} />
        <Mission t={t} />
        <ProjectStack t={t} lang={lang} />
        <div className="seg seg-collab">
          <Ticker items={TICKER} />
          <Collab t={t} />
        </div>
        <Support t={t} />
        <Finale t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
