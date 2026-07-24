import { useRef, useState, Suspense, lazy } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  gsap,
  ScrollTrigger,
  Draggable,
  useGSAP,
  EASE,
  DUR,
  STAG,
  START,
  PRIORITY,
} from "@/lib/motion";
import {
  navLinks,
  tabs,
  projects,
  team,
  type Chip,
  type Project,
} from "@/data/content";
import { useLang } from "@/hooks/useLang";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Reveal, Kicker } from "./reveal";
import { Btn } from "./Btn";
import { Magnetic, CountUp } from "./motion";
import { Wordmark } from "./Wordmark";
import { HeroShell } from "./HeroShell";
import { Stage, useStage } from "./stage";
import { Intro } from "./Intro";
import { Ticker } from "./Ticker";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  })),
);

import {
  ProjectIcon,
  IconChat,
  IconLayers,
  IconMail,
  IconFile,
  GithubIcon,
  DiscordIcon,
  MailStroke,
  BrandMark,
} from "./icons";

const SECTION_IDS = ["top", "about", "projects", "staff", "contact"];

/* Ticker copy. Terse declaratives in the brand voice (§7) — what we make and
   who we are, not a slogan. Untranslated on purpose: these are product and
   category nouns that read the same in both languages. */
const TICKER = [
  "OPEN SOURCE",
  "DISCORD BOTS",
  "MINECRAFT PLUGINS",
  "WEB TOOLS",
  "MIT LICENSED",
  "SINCE 2024",
  "AUSTRIA & GERMANY",
  "TOOLS THAT JUST RUN",
];

/* Small helper: render a chip list (static + link chips). */
function Chips({ items }: { items: Chip[] }) {
  return (
    <div className="chips">
      {items.map((c, i) =>
        c.href ? (
          <a
            key={i}
            href={c.href}
            // own pages keep the referrer; only outbound links drop it
            rel={c.href.startsWith('/') ? undefined : 'noreferrer'}
            className="chip link"
            onClick={(e) => e.stopPropagation()}
          >
            {c.label}
          </a>
        ) : (
          <span key={i} className="chip">
            {c.label}
          </span>
        ),
      )}
    </div>
  );
}

/* ---- NAV ---------------------------------------------------------------- */
// `base` prefixes the in-page section links ('#about' etc.) — homepage uses
// '' (plain anchors), subpages pass '/' so the nav routes back to the
// homepage's sections ('/#about') instead of scrolling nowhere on the spot.
export function Nav({
  active,
  t,
  lang,
  toggle,
  base = "",
}: {
  active: string;
  t: (k: string) => string;
  lang: string;
  toggle: () => void;
  base?: string;
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
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={`${base}${l.href}`}
            className={active && `#${active}` === l.href ? "active" : undefined}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
        {/* mobile-only: the GitHub pill lives in nav-actions on desktop, but at
            <=900px nav-actions no longer gets pushed right (nav-links' auto
            margin vanishes with it), so it crowded the logo and its hit-area
            overlapped the hamburger. Give it a proper spot in the dropdown. */}
        <a
          href="https://github.com/AvoCloud-net"
          rel="noreferrer"
          className="nav-links-github"
          onClick={() => setOpen(false)}
        >
          GitHub ↗
        </a>
      </div>

      <div className="nav-actions">
        <Magnetic
          className="nav-btn"
          onClick={toggle}
          strength={0.25}
          title={lang === "en" ? "Auf Deutsch wechseln" : "Switch to English"}
        >
          {lang === "en" ? "DE" : "EN"}
        </Magnetic>
        <Magnetic
          className="nav-btn pill"
          href="https://github.com/AvoCloud-net"
          rel="noreferrer"
          strength={0.25}
        >
          GitHub ↗
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
    });
    return () => st.kill();
  });

  return (
    <nav className="scroll-tabs" aria-hidden="true" ref={ref}>
      {tabs.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          className={`#${active}` === tab.href ? "active" : undefined}
        >
          <span className="tick" />
          <span className="lbl">{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}

/* ---- HERO --------------------------------------------------------------- */
function Hero({ t }: { t: (k: string) => string }) {
  return (
    <HeroShell
      id="top"
      kicker={t("hero.eyebrow")}
      claim={t("hero.claim")}
      stats={
        <>
          <div className="stat">
            <CountUp className="n" value={8} suffix="+" />
            <span className="l">{t("stat.projects")}</span>
          </div>
          <div className="stat">
            <CountUp className="n" value={team.length} />
            <span className="l">{t("stat.members")}</span>
          </div>
          <div className="stat">
            <CountUp className="n" value={2024} />
            <span className="l">{t("stat.founded")}</span>
          </div>
        </>
      }
      links={
        <>
          <Btn
            href="https://github.com/AvoCloud-net"
            rel="noreferrer"
            icon={<GithubIcon />}
            primary
          >
            GitHub
          </Btn>
          <Btn
            href="/discord/"
            icon={<DiscordIcon />}
          >
            Discord
          </Btn>
          <Btn href="/mail/" icon={<MailStroke />}>
            Support
          </Btn>
        </>
      }
    />
  );
}

/* ---- ABOUT -------------------------------------------------------------- */
function About({ t }: { t: (k: string) => string }) {
  return (
    <Stage id="about">
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
        <div data-depth="0.4">
          <Reveal delay={0.14}>
            <h3 className="sub-h">
              <IconLayers />
              <span>{t("about.opensource.heading")}</span>
            </h3>
            <p style={{ color: "var(--muted)" }}>
              {t("about.opensource.body")}
            </p>
            <h3 className="sub-h">
              <IconChat />
              <span>{t("about.community.heading")}</span>
            </h3>
            <p style={{ color: "var(--muted)" }}>{t("about.community.body")}</p>
          </Reveal>
        </div>
      </div>
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
    },
    { scope: ref, dependencies: [reduce] },
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
        <Reveal
          as="p"
          className="big"
          variant="text"
          delay={0.08}
          dangerouslySetInnerHTML={{ __html: t("mission.big") }}
        />
      </div>
    </section>
  );
}

/* ---- PROJECTS — pinned horizontal-scroll showcase (GSAP ScrollTrigger) --- */
function Projects({ t }: { t: (k: string) => string }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  // Which card owns the shader. Held here, not per-card: each panel used to
  // mount its own Dithering on first hover and keep it forever, so hovering
  // the whole track left ~10 live WebGL contexts (plus the hero's) against a
  // browser limit around 16. One at a time is all a hover effect ever needs.
  const [hovered, setHovered] = useState<string | null>(null);

  useGSAP(
    () => {
      if (reduce) return;
      const mm = gsap.matchMedia();
      // Desktop only: pin the section, pan the track horizontally as we scroll.
      mm.add("(min-width: 901px)", () => {
        const track = trackRef.current!;
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);

        const panels = gsap.utils.toArray<HTMLElement>(".proj-panel", track);

        /* Settle at both ends of the pin.

           Handing off from vertical to horizontal is a direction change, and
           doing it in the same frame the pin engages is what made it feel like
           a jolt: forward motion stopped dead and sideways motion started at
           full rate simultaneously, with a pin-spacer being inserted in
           between. Holding the track still for a beat at each end separates
           those events — the pin engages while nothing is moving sideways yet,
           and releases after the sideways motion has already stopped.

           Fractions of the pan distance, so the settle scales with the track
           instead of being a magic pixel count. ~7% in, ~5% out is roughly a
           quarter-screen each: enough for the eye to register a pause, small
           enough not to feel like the page has stalled. */
        const LEAD = 0.07;
        const TAIL = 0.05;

        const pan = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + distance() * (1 + LEAD + TAIL),
            pin: true,
            // Lenis already smooths the raw scroll input, so an extra scrub
            // lag on top of it (was 1) made the pan visibly trail behind /
            // snap at the pin's start & end. scrub:true ties the pan 1:1 to
            // Lenis' already-smoothed position instead of double-smoothing.
            scrub: true,
            // Kills the little jump/kick when the pin engages by nudging the
            // pin-spacer into place a touch early instead of on the exact frame.
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current)
                gsap.set(barRef.current, { scaleX: self.progress });
            },
          },
        });

        // ease:"none" throughout — the card triggers below read their position
        // off this timeline via containerAnimation, and any easing here breaks
        // the 1:1 mapping between scroll position and horizontal position.
        pan
          .to(track, { x: 0, duration: LEAD, ease: "none" })
          .to(track, { x: () => -distance(), duration: 1, ease: "none" })
          .to(track, { x: () => -distance(), duration: TAIL, ease: "none" });

        /* Drag the track directly, with a throw.

           The showcase is pinned horizontal scroll, which only responds to
           vertical wheel/trackpad input. That leaves the most obvious gesture
           — grab a card and pull — doing nothing, and on a trackpad a
           horizontal swipe over a horizontal-looking row is a very reasonable
           thing to try.

           Draggable doesn't move the track itself (the pan tween owns that
           transform and would fight it). It converts drag distance into scroll
           position, so drag and wheel drive the exact same thing and the
           progress bar, card focus and pin all stay consistent. InertiaPlugin
           gives the release a throw instead of a dead stop. */
        const proxy = document.createElement('div');
        const st = pan.scrollTrigger!;
        let startScroll = 0;

        const drag = Draggable.create(proxy, {
          type: 'x',
          trigger: track,
          inertia: true,
          allowNativeTouchScrolling: false,
          cursor: 'grab',
          activeCursor: 'grabbing',
          onPressInit() {
            startScroll = st.scroll();
            gsap.set(proxy, { x: 0 });
          },
          onDrag() {
            st.scroll(startScroll - this.x);
          },
          onThrowUpdate() {
            st.scroll(startScroll - this.x);
          },
        })[0];

        // Depth of field, not a transition. Each card is continuously scrubbed
        // across its whole pass through the viewport: it comes forward as it
        // approaches centre, sits fully resolved while it IS the card you're
        // reading, then recedes again. So the track always has exactly one card
        // in focus, and scrolling always moves every card on screen.
        //
        // This replaces a one-shot fade-in plus a velocity skew. The skew was
        // the wrong idiom — leaning type is a fashion effect, and this system
        // is a drafting table: things come into focus, they don't tilt.
        //
        // Opacity + scale only, deliberately NO filter: blur(). Blur is the
        // most expensive property to animate, and running it scrubbed on ten
        // cards at once cost frames exactly where the pin engages — which is a
        // large part of why the vertical→horizontal handoff felt choppy. Scale
        // and opacity composite on the GPU and read as depth on their own.
        panels.forEach((panel) => {
          const thru = {
            trigger: panel,
            containerAnimation: pan,
            scrub: true,
          } as const;

          // approach → focus
          gsap.fromTo(
            panel,
            { opacity: 0.25, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              ease: EASE.out,
              scrollTrigger: {
                ...thru,
                start: "left right",
                end: "center center",
              },
            },
          );
          // focus → recede
          gsap.fromTo(
            panel,
            { opacity: 1, scale: 1 },
            {
              opacity: 0.25,
              scale: 0.9,
              ease: EASE.inOut,
              scrollTrigger: {
                ...thru,
                start: "center center",
                end: "right left",
              },
            },
          );

          // Contents assemble once, on their own clock — a card that builds
          // itself reads as a card; a card whose contents scrub reads as a glitch.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: panel,
                containerAnimation: pan,
                start: "left 80%",
                once: true,
              },
            })
            .from(panel.querySelector(".pp-num"), {
              opacity: 0,
              x: -10,
              duration: DUR.ui,
              ease: EASE.out,
            })
            .from(
              panel.querySelectorAll(".pp-icon svg *"),
              {
                drawSVG: "0%",
                duration: DUR.enter,
                ease: EASE.out,
                stagger: STAG.card,
              },
              0,
            )
            .from(
              panel.querySelectorAll(".chip"),
              {
                opacity: 0,
                y: 10,
                duration: DUR.ui,
                ease: EASE.spring,
                stagger: STAG.card,
              },
              "-=0.35",
            );
        });

        return () => drag.kill();
      });
    },
    { scope: sectionRef, dependencies: [reduce] },
  );

  return (
    <section
      className={`proj-h${reduce ? " no-pin" : ""}`}
      id="projects"
      ref={sectionRef}
    >
      <div className="proj-track" ref={trackRef}>
        <div className="proj-intro">
          <Kicker>{t("projects.label")}</Kicker>
          <Reveal as="h2" className="proj-intro-title" variant="text">
            {t("projects.heading")}
          </Reveal>
          <div className="proj-scroll-cue" aria-hidden="true">
            <span>SCROLL</span>
            {/* direction flips via CSS (arrow.css ::before) — desktop pins
                  horizontal (→), mobile falls back to plain vertical (↓);
                  reduced-motion also gets the vertical fallback either way */}
            <span className="arrow" />
          </div>
        </div>

        {projects.map((p) => (
          <ProjectPanel
            key={p.num}
            p={p}
            t={t}
            active={hovered === p.num}
            onHover={setHovered}
          />
        ))}
      </div>

      {!reduce && (
        <div className="proj-progress" aria-hidden="true">
          <span className="proj-progress-bar" ref={barRef} />
        </div>
      )}
    </section>
  );
}

/* Single project card. The shader lives on whichever card is hovered right
   now (see Projects' `hovered` state) — one WebGL context for the whole
   track instead of one per card accumulating as you scroll past them. */
function ProjectPanel({
  p,
  t,
  active,
  onHover,
}: {
  p: Project;
  t: (k: string) => string;
  active: boolean;
  onHover: (num: string | null) => void;
}) {
  // primary link the whole card opens: About > Website > first link chip
  const primary =
    p.chips.find((c) => c.href && /^About/i.test(c.label)) ||
    p.chips.find((c) => c.href && /^Website/i.test(c.label)) ||
    p.chips.find((c) => c.href);
  const rest = primary ? p.chips.filter((c) => c !== primary) : p.chips;
  // Same tab. This used to be window.open(..., "_blank"), which is how the
  // whole project showcase — the main route from the homepage into a subpage —
  // was spawning tabs instead of navigating, so no page transition could ever
  // run on the click people actually make.
  const open = primary?.href ? () => { window.location.href = primary.href!; } : undefined;

  return (
    <article
      className={`proj-panel${open ? " clickable" : ""}`}
      onClick={open}
      role={open ? "link" : undefined}
      tabIndex={open ? 0 : undefined}
      aria-label={open ? `${p.name} — open` : undefined}
      onMouseEnter={() => onHover(p.num)}
      onMouseLeave={() => onHover(null)}
      onKeyDown={
        open
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
              }
            }
          : undefined
      }
    >
      <span className="mk tl" />
      <span className="mk br" />
      {active && (
        <Suspense fallback={null}>
          <div className="pp-shader pp-shader-on" aria-hidden="true">
            <Dithering
              colorBack="#00000000"
              colorFront="#5c3226"
              shape="warp"
              type="4x4"
              speed={0.45}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>
      )}
      <header className="pp-top">
        <span className="pp-num">{p.num}</span>
        <span className="pp-icon">
          <ProjectIcon icon={p.icon} />
        </span>
      </header>
      <div className="pp-body">
        <h3 className="pp-name">{p.name}</h3>
        {p.descHtml ? (
          <p
            className="pp-desc"
            dangerouslySetInnerHTML={{ __html: t(p.descKey) }}
          />
        ) : (
          <p className="pp-desc">{t(p.descKey)}</p>
        )}
      </div>
      <Chips items={rest} />
    </article>
  );
}

/* ---- TEAM --------------------------------------------------------------- */
function Team({ t }: { t: (k: string) => string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Banners drift inside their own frame as the grid passes — the cards read
  // as windows rather than flat tiles. `objectPosition` is already used by
  // some members to frame their banner, so this scales the image and moves it
  // with yPercent instead, which composites and leaves that framing intact.
  useGSAP(
    () => {
      if (reduce) return;
      gsap.utils
        .toArray<HTMLElement>(".staff .banner", ref.current!)
        .forEach((b) => {
          gsap.fromTo(
            b,
            { yPercent: -8, scale: 1.16 },
            {
              yPercent: 8,
              scale: 1.16,
              ease: EASE.none,
              scrollTrigger: {
                trigger: b.closest(".staff")!,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
    },
    { scope: ref, dependencies: [reduce] },
  );

  useStage(ref);

  return (
    <section className="section stage" id="staff" ref={ref}>
      <div className="wrap">
        <div data-depth="1.5">
          <Kicker>{t("team.label")}</Kicker>
          <Reveal as="h2" className="headline" variant="text">
            {t("team.heading")}
          </Reveal>
        </div>
        {/* One trigger with an internal stagger, not one per card — the grid
            used to build a ScrollTrigger for every member plus a hand-computed
            index delay. BRANDING.md §5b calls for the group form. */}
        <Reveal className="team-grid" variant="stagger" y={22}>
          {team.map((s) => (
            <article
              className={`card staff${s.wide ? " span-2" : ""}`}
              key={s.name}
            >
              <span className="mk tl" />
              <span className="mk br" />
              {s.banner ? (
                <img
                  src={s.banner}
                  className="banner"
                  alt={`Banner ${s.name}`}
                  loading="lazy"
                  style={
                    s.bannerPos ? { objectPosition: s.bannerPos } : undefined
                  }
                />
              ) : (
                <div className="banner" style={{ background: s.bannerColor }} />
              )}
              <img
                src={s.avatar}
                className="avatar"
                alt={s.name}
                loading="lazy"
              />
              <div className="body">
                <h3>{s.name}</h3>
                <p>{t(s.descKey)}</p>
                <Chips items={s.chips} />
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---- COLLABORATIONS ----------------------------------------------------- */
function Collab({ t }: { t: (k: string) => string }) {
  return (
    <Stage id="cooperation">
      <div data-depth="1.5">
        <Kicker>{t("collab.label")}</Kicker>
        <Reveal as="h2" className="headline" variant="text">
          {t("collab.heading")}
        </Reveal>
      </div>
      <div style={{ maxWidth: 480 }}>
        <Reveal as="article" className="card" y={22}>
          <span className="mk tl" />
          <span className="mk br" />
          <h3 style={{ gap: "0.9rem" }}>
            <img
              src="/assets/images/cee.png"
              alt="Cee_1"
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                objectFit: "cover",
                outline: "1px solid rgba(var(--coral-rgb),0.4)",
              }}
            />
            Cee_1{" "}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--muted)",
                fontWeight: 400,
              }}
            >
              Twitch Streamer
            </span>
          </h3>
          <p>{t("cee.desc")}</p>
          <Chips
            items={[
              { label: "Twitch" },
              { label: "Community" },
              { label: "Family friendly" },
              {
                label: "Twitch ↗",
                href: "/link/cee/twitch.html",
              },
              {
                label: "YouTube ↗",
                href: "/link/cee/yt.html",
              },
              {
                label: "Discord ↗",
                href: "/link/cee/discord.html",
              },
            ]}
          />
        </Reveal>
      </div>
    </Stage>
  );
}

/* ---- SUPPORT (Ko-fi) ---------------------------------------------------- */
function Support({ t }: { t: (k: string) => string }) {
  return (
    <Stage id="support">
      <div data-depth="1.5">
        <Kicker>{t("support.label")}</Kicker>
        <Reveal as="h2" className="headline" variant="text">
          {t("support.heading")}
        </Reveal>
      </div>
      <div style={{ maxWidth: 420 }}>
        <Reveal delay={0.05}>
          <iframe
            id="kofiframe"
            src="https://ko-fi.com/avocloudnet/?hidefeed=true&widget=true&embed=true&preview=true"
            style={{ border: "none", width: "100%", padding: 4, background: "#f9f9f9", borderRadius: 12 }}
            height={712}
            title="avocloudnet"
          />
        </Reveal>
      </div>
    </Stage>
  );
}

/* ---- CONTACT ------------------------------------------------------------ */
function Contact({ t }: { t: (k: string) => string }) {
  return (
    <Stage id="contact">
      <div data-depth="1.5">
        <Kicker>{t("contact.label")}</Kicker>
        <Reveal as="h2" className="headline" variant="text">
          {t("contact.heading")}
        </Reveal>
      </div>
      {/* one trigger for the row, stagger inside — see Team above */}
      <Reveal className="grid cols-3" variant="stagger">
        <article className="card contact-card">
          <span className="mk tl" />
          <span className="mk br" />
          <h3>
            <IconChat />
            Discord
          </h3>
          <p>{t("contact.discord.text")}</p>
          <a
            href="/discord/"
            className="accent-link"
          >
            avocloud.net/discord ↗
          </a>
        </article>
        <article className="card contact-card">
          <span className="mk tl" />
          <span className="mk br" />
          <h3>
            <IconMail />
            Support
          </h3>
          <p>{t("contact.support.text")}</p>
          <a href="/mail/" className="accent-link">
            support@avocloud.net ↗
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
          <a href="/impressum" className="accent-link">
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
      <div className="footer-meta">
        <span>{t("footer.text")}</span>
        <span className="sep">·</span>
        <a
          href="https://github.com/AvoCloud-net"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          href="/discord/"
        >
          Discord
        </a>
        <a href="/impressum">Imprint</a>
        <a href="/regulations/">Regulations</a>
        <span className="sep">·</span>
        <span>©2025 Avocloud.net</span>
      </div>
    </footer>
  );
}

/* ---- ROOT --------------------------------------------------------------- */
export default function Site() {
  useSmoothScroll();
  const { lang, t, toggle } = useLang();
  const active = useActiveSection(SECTION_IDS);

  return (
    <>
      <Intro />
      <Nav active={active} t={t} lang={lang} toggle={toggle} />
      <ReadProgress />
      <ScrollTabs active={active} />
      <Hero t={t} />
      <Ticker items={TICKER} />
      <About t={t} />
      <Mission t={t} />
      <Projects t={t} />
      <Ticker items={TICKER} />
      <Team t={t} />
      <Collab t={t} />
      <Support t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </>
  );
}
