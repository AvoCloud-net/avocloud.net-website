import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/motion';
import { registerSnap } from '@/lib/snap';
import { projects, projectDetails, type Lang, type Project } from '@/data/content';
import { Kicker, Reveal } from './reveal';
import { Btn } from './Btn';
import { Chips } from './Chips';
import { ProjectIcon } from './icons';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

/* ---------------------------------------------------------------------------
   ProjectStack — the products as fullscreen scenes that stack like film
   chapters.

   Replaces the pinned horizontal card track. Each product gets the whole
   screen and its own dithered texture (shape + tint from `tone` in content.ts).
   The section pins, and scrolling slides the next scene up over the current
   one, which steps back as it is covered: it shrinks to 93%, takes the 8px box
   radius and dims to 80% black. The incoming scene's texture settles from
   112% to 100%, and its copy rises in once the scene is mostly in.

   Per scene, in timeline units (one unit = one viewport of scroll):
       hold 0.6 → slide-over 1.0 → hold 0.6 → slide-over 1.0 → …

   WebGL budget: a shader is mounted only on the scene on screen and its two
   neighbours (the one leaving, the one about to arrive), and all of them are
   unmounted once the section is off screen. Six live dithers at once would
   be six GL contexts against a browser cap around 16, for textures nobody
   can see. Their props never change while mounted — see the transition
   notes below for why.

   Phones: no pin, the same idea in CSS. Every scene is `position: sticky`,
   so the next one slides over it natively as you swipe — no scroll-jacking
   on touch — and the script below only reads the scroll position to make the
   covered scene step back. A scene taller than the screen sticks at a
   negative offset, so its bottom is reachable before the next one arrives.

   Reduced motion (and no JS): scenes in normal flow, one after another.
   `html.gsap-ready` plus the 901px query in global.css switches the layouts,
   so the CSS and the matchMedia branches below always agree.
--------------------------------------------------------------------------- */
const LEAD = 0.4;

/** Scroll distance per timeline unit, in viewports. >1 stretches every
 *  transition over more scrolling, so a flick of a trackpad or a thumb no
 *  longer crosses a whole scene change in one frame. */
const PACE = 1.4;

/* The dither at rest — passed to <Dithering> as props, and the value every
   transition returns the shader uniforms to. scale/size are the library's own
   defaults, written out so the two can't drift apart. */
const PX = { size: 2, scale: 0.6, rotation: 0 };

type Uniforms = { px: number; scale: number; rot: number; off: number };
type ShaderHost = HTMLElement & { paperShaderMount?: { setUniforms: (u: Record<string, number>) => void } };

/** Push the transition state straight into a scene's live shader, if it has
 *  one mounted — bypassing React, which would re-render per scroll frame. */
function drive(scene: HTMLElement, u: Uniforms) {
  return () =>
    scene
      .querySelector<ShaderHost>('.ps-shader > div')
      ?.paperShaderMount?.setUniforms({ u_pxSize: u.px, u_scale: u.scale, u_rotation: u.rot, u_offsetY: u.off });
}
const HOLD = 0.6;
const SLIDE = 1;
/** How far inside the hold a rest point sits, in viewports (see unsnap below). */
const HOLD_INSET = 0.12;

/** Primary link the CTA opens: About > Website > first link chip. */
function primaryOf(p: Project) {
  return (
    p.chips.find((c) => c.href && /^About/i.test(c.label)) ||
    p.chips.find((c) => c.href && /^Website/i.test(c.label)) ||
    p.chips.find((c) => c.href)
  );
}

export function ProjectStack({ t, lang }: { t: (k: string) => string; lang: Lang }) {
  const ref = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  // scene index on screen: 0 = intro, 1..n = products
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const total = projects.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), {
      rootMargin: '300px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)', () => {
        const section = ref.current!;
        const q = gsap.utils.selector(section);
        const scenes = q('.ps-scene') as HTMLElement[];
        const counter = q('.ps-count')[0];
        const bar = q('.ps-progress span')[0];

        /* Scroll length = the timeline's real duration, never a sum worked out
           separately. They used to be two numbers that only agreed while every
           tween stayed inside its slide; once the copy stagger ran past the
           last slide, the timeline grew, scroll positions were scaled against
           it, and every rest point drifted a little further per card — the
           snap left a strip of the next scene showing. */
        const length = LEAD + (scenes.length - 1) * (SLIDE + HOLD);
        // Built paused, then handed to the pin below once it is complete, so
        // the pin measures the finished timeline.
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.none } });

        tl.to({}, { duration: LEAD });
        /* Rack focus, not a slide. Each change is a pull through depth, the
           same move as the finale's sentences applied to a whole scene:

             0.00–0.55  outgoing: copy dissolves upward into blur, one layer
                        after another, the name's tracking opening as it goes;
                        the texture loses its resolution — the dither's pixels
                        swell into coarse blocks while the pattern zooms out
                        and turns away, and it fades
             0.30–1.00  incoming: the texture arrives as coarse blocks, zoomed
                        in and turned the other way, and resolves down to its
                        fine 2px grain; the copy resolves out of blur layer by
                        layer and the name's tracking closes until it locks —
                        exactly at the end of the slide

           The texture never gets a CSS blur: pixelating the dither itself is
           the brand's own material doing the transition, and it costs the
           GPU nothing extra — the shader draws the frame either way, where a
           filter on a full-screen canvas is the most expensive thing to
           animate. Uniforms are driven from proxy objects (one per scene, so
           its in- and out-state chain), applied in onUpdate.

           Everything finishes inside the slide (the DEV check below enforces
           it), so at every snap rest the scene is still and fully sharp.
           autoAlpha, not opacity: a scene that has faded out is also
           visibility:hidden, so the invisible one on top can't take clicks. */
        const shader = new Map<HTMLElement, Uniforms>();
        scenes.forEach((scene) => {
          if (scene.querySelector('.ps-bg')) shader.set(scene, { px: PX.size, scale: PX.scale, rot: PX.rotation, off: 0 });
        });
        scenes.forEach((scene, i) => {
          if (i === 0) return;
          const prev = scenes[i - 1];
          const at = LEAD + (i - 1) * (SLIDE + HOLD);
          const out = prev.querySelectorAll('.ps-inner > *');
          const inn = scene.querySelectorAll('.ps-inner > *');
          const prevBg = prev.querySelector('.ps-bg');
          const prevName = prev.querySelector('.ps-name');
          const prevU = shader.get(prev);
          const u = shader.get(scene)!;

          tl.to(out, { opacity: 0, filter: 'blur(14px)', y: -40, ease: 'power1.in', stagger: 0.04, duration: 0.42 }, at);
          if (prevName) tl.to(prevName, { letterSpacing: '0.14em', ease: 'power1.in', duration: 0.45 }, at);
          if (prevBg) tl.to(prevBg, { scale: 0.94, opacity: 0, ease: 'power1.in', duration: 0.55 }, at);
          if (prevU) {
            tl.to(prevU, { px: 14, scale: 0.5, rot: 8, ease: 'sine.in', duration: 0.6, onUpdate: drive(prev, prevU) }, at);
          }
          tl.to(prev, { autoAlpha: 0, duration: 0.12 }, at + 0.5);

          tl.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, at + 0.3)
            .fromTo(
              scene.querySelector('.ps-bg'),
              { scale: 1.12, opacity: 0 },
              // power2, not the house avo-out: avo-out lands ~90% of the way in
              // the first half, which crushed the focus pull into a snap
              { scale: 1, opacity: 1, ease: 'sine.out', duration: 0.75 },
              at + 0.3,
            )
            .fromTo(
              u,
              { px: 14, scale: 0.9, rot: -8, off: 0 },
              { px: PX.size, scale: PX.scale, rot: PX.rotation, ease: 'sine.out', duration: 0.75, onUpdate: drive(scene, u) },
              at + 0.3,
            )
            .fromTo(
              inn,
              { opacity: 0, filter: 'blur(12px)', y: 40 },
              { opacity: 1, filter: 'blur(0px)', y: 0, ease: 'power2.out', stagger: 0.05, duration: 0.4 },
              at + 0.42,
            )
            .fromTo(
              scene.querySelector('.ps-name'),
              { letterSpacing: '0.24em' },
              { letterSpacing: '-0.03em', ease: 'power3.out', duration: 0.55 },
              at + 0.45,
            );
          if (i < scenes.length - 1) tl.to({}, { duration: HOLD }, at + SLIDE);
        });
        /* Scroll feedback. Between transitions nothing moved, so a stretch of
           every scroll felt dead. Now the wallpaper keeps drifting across the
           hold — the dither pattern zooms in and turns a little — scrubbed to
           scroll like everything else, so it is always in the direction you
           scroll, runs backwards when you go back, and costs nothing extra.
           A snapped card therefore shows its wallpaper slightly drifted; the
           next transition starts from wherever the drift has got to. */
        scenes.forEach((scene, i) => {
          const u = shader.get(scene);
          if (i === 0 || !u) return;
          const start = LEAD + (i - 1) * (SLIDE + HOLD) + SLIDE;
          tl.to(u, { scale: PX.scale * 1.15, rot: 4, ease: 'none', duration: HOLD, onUpdate: drive(scene, u) }, start);
        });

        // the last hold sits at its own position, after the last slide — not
        // after whatever tween happens to end last
        tl.to({}, { duration: HOLD }, length - HOLD);

        /* The wallpapers travel with the scroll. Each pattern pans vertically
           while its card is on screen: from below-centre as it arrives,
           through centre at its rest, to above-centre as the next card takes
           over — so scrolling down visibly carries the background toward
           the next page and scrolling up carries it back. The pan stays
           within +-PAN of centre: the shapes (sphere, ripple, warp...) are
           objects, not endless textures, and an earlier whole-timeline pan
           slid them clean out of frame, leaving black. */
        const PAN = 0.3;
        scenes.forEach((scene, i) => {
          const u = shader.get(scene);
          if (i === 0 || !u) return;
          const from = LEAD + (i - 1) * (SLIDE + HOLD);
          const span = i < scenes.length - 1 ? 2 * SLIDE + HOLD : SLIDE + HOLD;
          const slope = (2 * PAN) / (2 * SLIDE + HOLD);
          tl.fromTo(u, { off: PAN }, { off: PAN - slope * span, ease: 'none', duration: span, onUpdate: drive(scene, u) }, from);
        });
        if (import.meta.env.DEV && Math.abs(tl.duration() - length) > 0.001) {
          console.warn(`ProjectStack: timeline runs ${tl.duration().toFixed(3)} for a ${length.toFixed(3)} layout — a tween overhangs its slide`);
        }

        const pinST = ScrollTrigger.create({
          animation: tl,
          trigger: section,
          pin: viewRef.current,
          start: 'top top',
          end: () => '+=' + tl.duration() * window.innerHeight * PACE,
          // A short catch-up rather than 1:1. A trackpad feeds scroll in small
          // uneven steps, and with the timeline bolted to each one the focus
          // pulls stuttered; half a second of follow smooths them into one
          // motion. (The pin itself still tracks scroll exactly.)
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(bar, { scaleX: self.progress });
            // a scene counts as current once it is more than half way in
            const time = self.progress * tl.duration() - LEAD;
            const idx = Math.max(0, Math.min(scenes.length - 1, Math.floor((time + HOLD + SLIDE / 2) / (SLIDE + HOLD))));
            setActive((a) => (a === idx ? a : idx));
            if (counter) counter.textContent = `${String(Math.max(1, idx)).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
          },
        });

        // Rest zones for the snap (lib/snap.ts): the intro before anything
        // moves, then each product across its hold — the stretch where the
        // scene is fully in and nothing is sliding.
        const unsnap = registerSnap(() => {
          const st = pinST;
          // timeline time → scroll, through the same scale the pin uses
          const at = (t: number) => st.start + (t / tl.duration()) * (st.end - st.start);
          const zones: [number, number][] = [[at(0), at(LEAD)]];
          // Inset from both edges of the hold: a rest exactly on the edge is
          // one pixel of lag away from the next scene poking in (or the copy
          // still rising), so the snap lands comfortably inside it.
          for (let i = 1; i < scenes.length; i++) {
            const inAt = LEAD + (i - 1) * (SLIDE + HOLD) + SLIDE;
            zones.push([at(inAt + HOLD_INSET), at(inAt + HOLD - HOLD_INSET)]);
          }
          return zones;
        });

        // Leaving the stack: the last scene steps back the same way the others
        // did, while the page carries on underneath it. On the inner frame —
        // never transform the pinned element itself: after the pin ends,
        // ScrollTrigger offsets it to the end of its spacer with a transform,
        // and a scale tween on the same element wiped that offset out and
        // snapped the whole stack back to the top of the spacer.
        gsap.fromTo(
          q('.ps-frame'),
          { scale: 1, borderRadius: 0, '--shade': 0 },
          {
            scale: 0.93,
            borderRadius: 8,
            '--shade': 0.7,
            ease: EASE.none,
            scrollTrigger: { trigger: section, start: 'bottom bottom', end: 'bottom top', scrub: true },
          },
        );

        return () => unsnap();
      });

      // Phones: sticky stack (see header). Measures each scene once per
      // refresh, then derives everything from the scroll position.
      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 900px)', () => {
        const section = ref.current!;
        const scenes = gsap.utils.toArray<HTMLElement>('.ps-scene', section);
        let tops: number[] = [];
        let sticks: number[] = [];

        const measure = () => {
          const vh = window.innerHeight;
          let acc = 0;
          tops = [];
          sticks = [];
          scenes.forEach((scene) => {
            const h = scene.offsetHeight;
            const stick = Math.min(0, vh - h);
            scene.style.top = `${stick}px`;
            // step back toward the middle of what is on screen
            gsap.set(scene, { transformOrigin: `50% ${vh / 2 - stick}px` });
            tops.push(acc);
            sticks.push(stick);
            acc += h;
          });
        };
        measure();

        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onRefresh: measure,
          onUpdate: (self) => {
            const vh = window.innerHeight;
            const rel = self.scroll() - (self.start + vh); // scroll past the section top
            let idx = 0;
            scenes.forEach((scene, i) => {
              if (rel >= tops[i] - vh / 2) idx = i;
              const next = i + 1;
              if (next >= scenes.length) return;
              const from = tops[next] - vh;
              const p = gsap.utils.clamp(0, 1, (rel - from) / (vh - sticks[next]));
              gsap.set(scene, { scale: 1 - 0.07 * p, borderRadius: 8 * p, '--shade': 0.8 * p });
            });
            setActive((a) => (a === idx ? a : idx));
          },
        });
        // Rest zones: each card from the moment its top reaches the top of
        // the screen until the next card starts to cover it (a card taller
        // than the screen scrolls through that range before it sticks).
        const unsnap = registerSnap(() => {
          const secTop = st.start + window.innerHeight; // st starts at 'top bottom'
          return scenes.map((_, i) => [secTop + tops[i], secTop + tops[i] - sticks[i]] as [number, number]);
        });

        return () => {
          unsnap();
          st.kill();
          scenes.forEach((scene) => (scene.style.top = ''));
        };
      });

      // Reduced motion: plain flow, so "current" is simply whichever scene is
      // mostly on screen.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const scenes = gsap.utils.toArray<HTMLElement>('.ps-scene', ref.current);
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) setActive(scenes.indexOf(e.target as HTMLElement));
            }),
          { threshold: 0.5 },
        );
        scenes.forEach((s) => io.observe(s));
        return () => io.disconnect();
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section className="proj-stack" id="projects" ref={ref}>
      <div className="ps-view" ref={viewRef}>
        <div className="ps-frame">
          <article className="ps-scene ps-intro">
            <div className="ps-inner">
              <div
                className="ps-intro-body"
                // longest word of the heading, so it sizes to fit (see .ps-intro-title)
                style={{ '--len': Math.max(...t('projects.heading').split(' ').map((w) => w.length)) } as React.CSSProperties}
              >
                <Kicker>{t('projects.label')}</Kicker>
                <Reveal as="h2" className="ps-intro-title" variant="text">
                  {t('projects.heading')}
                </Reveal>
                <Reveal as="p" className="ps-intro-lede" delay={0.1}>
                  {t('projects.lede')}
                </Reveal>
              </div>
              {/* table of contents — what's coming, in order */}
              <Reveal as="div" className="ps-index" variant="stagger" delay={0.15}>
                {projects.map((p) => (
                  <span key={p.num}>
                    <b>{p.num}</b>
                    {p.name}
                  </span>
                ))}
              </Reveal>
            </div>
          </article>

          {projects.map((p, i) => {
            const idx = i + 1;
            const primary = primaryOf(p);
            const links = p.chips.filter((c) => c.href && c !== primary);
            const tags = p.chips.filter((c) => !c.href);
            const live = onScreen && Math.abs(idx - active) <= 1;
          const detail = projectDetails[lang][p.descKey.split('.')[0]];
            return (
              <article
                key={p.num}
                className="ps-scene ps-card"
              >
                <div className="ps-bg" aria-hidden="true">
                  {live && (
                    <Suspense fallback={null}>
                      <div className="ps-shader">
                        <Dithering
                          colorBack="#00000000"
                          colorFront={p.tone.color}
                          shape={p.tone.shape}
                          type="4x4"
                          // constant: a changing prop re-renders the memo'd
                          // shader, and its effect would reset the uniforms
                          // the transition is driving to these props mid-pull
                          speed={0.22}
                          size={PX.size}
                          scale={PX.scale}
                          rotation={PX.rotation}
                          className="size-full"
                          minPixelRatio={1}
                        />
                      </div>
                    </Suspense>
                  )}
                </div>
                <div className="ps-inner">
                  {/* chapter number — decoration, the real one is in .ps-num */}
                <span className="ps-ghost" aria-hidden="true">
                  {p.num}
                </span>
                <header className="ps-top">
                    <span className="ps-num">
                      {p.num}
                      <span className="ps-of"> / {String(total).padStart(2, '0')}</span>
                    </span>
                    <span className="ps-icon">
                      <ProjectIcon icon={p.icon} />
                    </span>
                  </header>
                  <div className="ps-body">
                    <div className="ps-tags">
                      {tags.map((c) => (
                        <span key={c.label}>{c.label}</span>
                      ))}
                    </div>
                    {/* --len: longest word, so the type steps down for DISCORDGATE
                        instead of running off the screen */}
                    <h3
                      className="ps-name"
                      style={{ '--len': Math.max(...p.name.split(' ').map((w) => w.length)) } as React.CSSProperties}
                    >
                      {p.name}
                    </h3>
                    {p.descHtml ? (
                      <p className="ps-desc" dangerouslySetInnerHTML={{ __html: t(p.descKey) }} />
                    ) : (
                      <p className="ps-desc">{t(p.descKey)}</p>
                    )}
                    <div className="ps-actions">
                      {primary?.href && (
                        <Btn
                          href={primary.href}
                          primary
                          rel={primary.href.startsWith('/') ? undefined : 'noreferrer'}
                        >
                          {t('projects.open')}
                        </Btn>
                      )}
                      {links.length > 0 && <Chips items={links} />}
                    </div>
                  </div>
                  {detail && (
                    <aside className="ps-spec">
                      <div className="ps-spec-head">
                        <span>{t('projects.features')}</span>
                        <span>{String(detail.features.length).padStart(2, '0')}</span>
                      </div>
                      <ol className="ps-feats">
                        {detail.features.map((f, n) => (
                          <li key={f}>
                            <span className="ps-feat-n">{String(n + 1).padStart(2, '0')}</span>
                            {f}
                          </li>
                        ))}
                      </ol>
                      <dl className="ps-facts" aria-label={t('projects.facts')}>
                        {detail.facts.map(([k, v]) => (
                          <div key={k}>
                            <dt>{k}</dt>
                            <dd>{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </aside>
                  )}
                </div>
                <span className="mk tl" aria-hidden="true" />
                <span className="mk br" aria-hidden="true" />
              </article>
            );
          })}

          <div className="ps-meta" aria-hidden="true">
            <span className="ps-label">{t('projects.label')}</span>
            <span className="ps-count">01 / {String(total).padStart(2, '0')}</span>
            <span className="ps-progress">
              <span />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
