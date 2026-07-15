import { useRef, useState, Suspense, lazy } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { navLinks, tabs, projects, team, type Chip, type Project } from '@/data/content';
import { useLang } from '@/hooks/useLang';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Reveal } from './reveal';
import { Magnetic, CountUp } from './motion';
import { Wordmark } from './Wordmark';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

gsap.registerPlugin(ScrollTrigger, useGSAP);
import {
  ProjectIcon, IconChat, IconLayers, IconMail, IconFile,
  GithubIcon, DiscordIcon, MailStroke, BrandMark,
} from './icons';

const SECTION_IDS = ['top', 'about', 'projects', 'staff', 'contact'];

/* Small helper: render a chip list (static + link chips). */
function Chips({ items }: { items: Chip[] }) {
  return (
    <div className="chips">
      {items.map((c, i) =>
        c.href ? (
          <a
            key={i}
            href={c.href}
            target="_blank"
            rel="noreferrer"
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
  active, t, lang, toggle, base = '',
}: { active: string; t: (k: string) => string; lang: string; toggle: () => void; base?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useGSAP(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top -40',
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => st.kill();
  });

  return (
    <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
      <Magnetic href="/" className="nav-logo" aria-label="AVOCLOUD.NET" strength={0.2}>
        <BrandMark />
        <span>
          AVOCLOUD<span className="dot">.NET</span>
        </span>
      </Magnetic>

      <div className={`nav-links${open ? ' open' : ''}`}>
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={`${base}${l.href}`}
            className={active && `#${active}` === l.href ? 'active' : undefined}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
        {/* mobile-only: the GitHub pill lives in nav-actions on desktop, but at
            <=900px nav-actions no longer gets pushed right (nav-links' auto
            margin vanishes with it), so it crowded the logo and its hit-area
            overlapped the hamburger. Give it a proper spot in the dropdown. */}
        <a href="https://github.com/AvoCloud-net" target="_blank" rel="noreferrer" className="nav-links-github" onClick={() => setOpen(false)}>
          GitHub ↗
        </a>
      </div>

      <div className="nav-actions">
        <Magnetic
          className="nav-btn"
          onClick={toggle}
          strength={0.25}
          title={lang === 'en' ? 'Auf Deutsch wechseln' : 'Switch to English'}
        >
          {lang === 'en' ? 'DE' : 'EN'}
        </Magnetic>
        <Magnetic className="nav-btn pill" href="https://github.com/AvoCloud-net" target="_blank" rel="noreferrer" strength={0.25}>
          GitHub ↗
        </Magnetic>
      </div>

      <button
        className={`nav-toggle${open ? ' open' : ''}`}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}

/* ---- VERTICAL TABS ------------------------------------------------------ */
function ScrollTabs({ active }: { active: string }) {
  const ref = useRef<HTMLElement>(null);

  // The tabs are fixed at vertical center — flip to dark text whenever the
  // light mission band passes behind them, so the labels stay readable.
  useGSAP(() => {
    const nav = ref.current;
    if (!nav) return;
    const st = ScrollTrigger.create({
      trigger: '#mission',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => nav.classList.add('on-light'),
      onLeave: () => nav.classList.remove('on-light'),
      onEnterBack: () => nav.classList.add('on-light'),
      onLeaveBack: () => nav.classList.remove('on-light'),
    });
    return () => st.kill();
  });

  return (
    <nav className="scroll-tabs" aria-hidden="true" ref={ref}>
      {tabs.map((tab) => (
        <a key={tab.href} href={tab.href} className={`#${active}` === tab.href ? 'active' : undefined}>
          <span className="tick" />
          <span className="lbl">{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}

/* ---- HERO --------------------------------------------------------------- */
function Hero({ t }: { t: (k: string) => string }) {
  const heroRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="hero relative overflow-hidden bg-card md:rounded-[48px] md:border md:border-border md:shadow-sm"
      id="top"
      ref={heroRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen">
          <Dithering
            colorBack="#00000000"
            colorFront="#bf5037" /* --coral, darkened ~25% */
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
          {t('hero.eyebrow')}
        </Reveal>

        <Wordmark as="h1" textClass="hero-wordmark" trigger="load" timeScale={0.6} />

        <p className="hero-claim text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          {t('hero.claim')}
        </p>

        <Reveal
          className="hero-stats flex flex-wrap items-center justify-center gap-8 mb-12"
          y={16}
          delay={0.1}
        >
          <div className="stat">
            <CountUp className="n" value={8} suffix="+" />
            <span className="l">{t('stat.projects')}</span>
          </div>
          <div className="stat">
            <CountUp className="n" value={team.length} />
            <span className="l">{t('stat.members')}</span>
          </div>
          <div className="stat">
            <CountUp className="n" value={2024} />
            <span className="l">{t('stat.founded')}</span>
          </div>
        </Reveal>

        <Reveal className="hero-links flex flex-wrap items-center justify-center gap-3" y={16} delay={0.18}>
          <Magnetic
            href="https://github.com/AvoCloud-net"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-8 text-base font-medium text-primary-foreground backdrop-blur-sm transition-all duration-300 hover:bg-primary/90 hover:ring-4 hover:ring-primary/20"
          >
            <GithubIcon />
            GitHub
          </Magnetic>
          <Magnetic
            href="https://avocloud.net/discord/"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
          >
            <DiscordIcon />
            Discord
          </Magnetic>
          <Magnetic
            href="https://avocloud.net/mail/"
            className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background/40 px-8 text-base font-medium text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-foreground/5"
          >
            <MailStroke />
            Support
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

/* ---- ABOUT -------------------------------------------------------------- */
function About({ t }: { t: (k: string) => string }) {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <Reveal className="section-label">{t('about.label')}</Reveal>
        <div className="about-grid">
          <Reveal delay={0.05}>
            <h2 className="headline">{t('about.heading')}</h2>
            <p>{t('about.intro')}</p>
            <p>{t('about.body2')}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <h3 className="sub-h">
              <IconLayers />
              <span>{t('about.opensource.heading')}</span>
            </h3>
            <p style={{ color: 'var(--muted)' }}>{t('about.opensource.body')}</p>
            <h3 className="sub-h">
              <IconChat />
              <span>{t('about.community.heading')}</span>
            </h3>
            <p style={{ color: 'var(--muted)' }}>{t('about.community.body')}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---- MISSION (light band) ---------------------------------------------- */
function Mission({ t }: { t: (k: string) => string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduce) return;
      // yPercent baseline -50 reproduces the CSS translateY(-50%) centering
      // (which stays as the reduced-motion / no-JS fallback), plus parallax.
      const base = { scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true }, ease: 'none' };
      gsap.fromTo('.mission .giant-mark', { yPercent: -62 }, { yPercent: -38, ...base });
      gsap.fromTo('.mission .foil', { yPercent: -64, xPercent: 6 }, { yPercent: -36, xPercent: -6, ...base });
    },
    { scope: ref, dependencies: [reduce] },
  );

  return (
    <section className="mission" id="mission" ref={ref}>
      <svg className="giant-mark" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <path d="M22 18 L12 18 L12 54 L22 54" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 18 L60 18 L60 54 L50 54" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 30 L33 36 L26 42" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="40" y="28" width="4" height="16" rx="2" fill="rgba(255,107,74,0.45)" stroke="none" />
      </svg>
      <span className="foil" />
      <div className="wrap">
        <Reveal className="section-label">{t('mission.label')}</Reveal>
        <Reveal as="p" className="big" delay={0.08} dangerouslySetInnerHTML={{ __html: t('mission.big') }} />
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

  useGSAP(
    () => {
      if (reduce) return;
      const mm = gsap.matchMedia();
      // Desktop only: pin the section, pan the track horizontally as we scroll.
      mm.add('(min-width: 901px)', () => {
        const track = trackRef.current!;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const pan = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => '+=' + distance(),
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
              if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
            },
          },
        });

        // Each panel eases in as it pans into view. Scrubbed against the same
        // containerAnimation as the pan itself (not a fixed-duration tween),
        // so the reveal is glued to scroll position — no more "pop" when the
        // panel crosses the threshold at whatever speed the user is scrolling.
        gsap.utils.toArray<HTMLElement>('.proj-panel', track).forEach((panel) => {
          gsap.fromTo(
            panel,
            { opacity: 0, scale: 0.94, yPercent: 6 },
            {
              opacity: 1,
              scale: 1,
              yPercent: 0,
              ease: 'power1.out',
              scrollTrigger: { trigger: panel, containerAnimation: pan, start: 'left 95%', end: 'left 55%', scrub: true },
            },
          );
        });
      });
    },
    { scope: sectionRef, dependencies: [reduce] },
  );

  return (
    <section className={`proj-h${reduce ? ' no-pin' : ''}`} id="projects" ref={sectionRef}>
      <div className="proj-track" ref={trackRef}>
          <div className="proj-intro">
            <div className="section-label">{t('projects.label')}</div>
            <h2 className="proj-intro-title">{t('projects.heading')}</h2>
            <div className="proj-scroll-cue" aria-hidden="true">
              <span>SCROLL</span>
              {/* direction flips via CSS (arrow.css ::before) — desktop pins
                  horizontal (→), mobile falls back to plain vertical (↓);
                  reduced-motion also gets the vertical fallback either way */}
              <span className="arrow" />
            </div>
          </div>

          {projects.map((p) => (
            <ProjectPanel key={p.num} p={p} t={t} />
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

/* Single project card. The shader mounts lazily on first hover (kept mounted
   after, so re-hovering is instant) rather than always-on for all ~10 cards
   at once — same Dithering component as the hero, just triggered per-card. */
function ProjectPanel({ p, t }: { p: Project; t: (k: string) => string }) {
  const [hovered, setHovered] = useState(false);
  const [shaderMounted, setShaderMounted] = useState(false);

  // primary link the whole card opens: About > Website > first link chip
  const primary =
    p.chips.find((c) => c.href && /^About/i.test(c.label)) ||
    p.chips.find((c) => c.href && /^Website/i.test(c.label)) ||
    p.chips.find((c) => c.href);
  const rest = primary ? p.chips.filter((c) => c !== primary) : p.chips;
  const open = primary?.href
    ? () => window.open(primary.href, '_blank', 'noopener,noreferrer')
    : undefined;

  return (
    <article
      className={`proj-panel${open ? ' clickable' : ''}`}
      onClick={open}
      role={open ? 'link' : undefined}
      tabIndex={open ? 0 : undefined}
      aria-label={open ? `${p.name} — open` : undefined}
      onMouseEnter={() => {
        setHovered(true);
        setShaderMounted(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={
        open
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
              }
            }
          : undefined
      }
    >
      <span className="mk tl" />
      <span className="mk br" />
      {shaderMounted && (
        <Suspense fallback={null}>
          <div className={`pp-shader${hovered ? ' pp-shader-on' : ''}`} aria-hidden="true">
            <Dithering
              colorBack="#00000000"
              colorFront="#bf5037"
              shape="warp"
              type="4x4"
              speed={hovered ? 0.5 : 0.12}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>
      )}
      <header className="pp-top">
        <span className="pp-num">{p.num}</span>
        <span className="pp-icon"><ProjectIcon icon={p.icon} /></span>
      </header>
      <div className="pp-body">
        <h3 className="pp-name">{p.name}</h3>
        {p.descHtml ? (
          <p className="pp-desc" dangerouslySetInnerHTML={{ __html: t(p.descKey) }} />
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
  return (
    <section className="section" id="staff">
      <div className="wrap">
        <Reveal className="section-label">{t('team.label')}</Reveal>
        <Reveal as="h2" className="headline">
          {t('team.heading')}
        </Reveal>
        <div className="team-grid">
          {team.map((s, i) => (
            <Reveal as="article" className={`card staff${s.wide ? ' span-2' : ''}`} key={s.name} delay={Math.min(i * 0.06, 0.3)} y={22}>
              <span className="mk tl" />
              <span className="mk br" />
              {s.banner ? (
                <img src={s.banner} className="banner" alt={`Banner ${s.name}`} loading="lazy" style={s.bannerPos ? { objectPosition: s.bannerPos } : undefined} />
              ) : (
                <div className="banner" style={{ background: s.bannerColor }} />
              )}
              <img src={s.avatar} className="avatar" alt={s.name} loading="lazy" />
              <div className="body">
                <h3>{s.name}</h3>
                <p>{t(s.descKey)}</p>
                <Chips items={s.chips} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- COLLABORATIONS ----------------------------------------------------- */
function Collab({ t }: { t: (k: string) => string }) {
  return (
    <section className="section" id="cooperation">
      <div className="wrap">
        <Reveal className="section-label">{t('collab.label')}</Reveal>
        <Reveal as="h2" className="headline">
          {t('collab.heading')}
        </Reveal>
        <div style={{ maxWidth: 480 }}>
          <Reveal as="article" className="card" y={22}>
            <span className="mk tl" />
            <span className="mk br" />
            <h3 style={{ gap: '0.9rem' }}>
              <img
                src="/assets/images/cee.png"
                alt="Cee_1"
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', outline: '1px solid rgba(var(--coral-rgb),0.4)' }}
              />
              Cee_1{' '}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 400 }}>
                Twitch Streamer
              </span>
            </h3>
            <p>{t('cee.desc')}</p>
            <Chips
              items={[
                { label: 'Twitch' }, { label: 'Community' }, { label: 'Family friendly' },
                { label: 'Twitch ↗', href: 'https://avocloud.net/link/cee/twitch.html' },
                { label: 'YouTube ↗', href: 'https://avocloud.net/link/cee/yt.html' },
                { label: 'Discord ↗', href: 'https://avocloud.net/link/cee/discord.html' },
              ]}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---- CONTACT ------------------------------------------------------------ */
function Contact({ t }: { t: (k: string) => string }) {
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <Reveal className="section-label">{t('contact.label')}</Reveal>
        <Reveal as="h2" className="headline">
          {t('contact.heading')}
        </Reveal>
        <div className="grid cols-3">
          <Reveal as="article" className="card contact-card">
            <span className="mk tl" />
            <span className="mk br" />
            <h3>
              <IconChat />
              Discord
            </h3>
            <p>{t('contact.discord.text')}</p>
            <a href="https://avocloud.net/discord/" target="_blank" rel="noreferrer" className="accent-link">
              avocloud.net/discord ↗
            </a>
          </Reveal>
          <Reveal as="article" className="card contact-card" delay={0.08}>
            <span className="mk tl" />
            <span className="mk br" />
            <h3>
              <IconMail />
              Support
            </h3>
            <p>{t('contact.support.text')}</p>
            <a href="https://avocloud.net/mail/" className="accent-link">
              support@avocloud.net ↗
            </a>
          </Reveal>
          <Reveal as="article" className="card contact-card" delay={0.16}>
            <span className="mk tl" />
            <span className="mk br" />
            <h3>
              <IconFile />
              Legal
            </h3>
            <p>{t('contact.legal.text')}</p>
            <a href="/impressum" className="accent-link">
              Imprint ↗
            </a>
            <br />
            <a href="/regulations/" className="accent-link">
              Regulations ↗
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---- FOOTER ------------------------------------------------------------- */
export function Footer({ t }: { t: (k: string) => string }) {
  return (
    <footer className="site-footer">
      <Wordmark as="div" textClass="footer-word" trigger="scroll" timeScale={0.6} />
      <div className="footer-meta">
        <span>{t('footer.text')}</span>
        <span className="sep">·</span>
        <a href="https://github.com/AvoCloud-net" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://avocloud.net/discord/" target="_blank" rel="noreferrer">Discord</a>
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
      <Nav active={active} t={t} lang={lang} toggle={toggle} />
      <ScrollTabs active={active} />
      <Hero t={t} />
      <About t={t} />
      <Mission t={t} />
      <Projects t={t} />
      <Team t={t} />
      <Collab t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </>
  );
}
