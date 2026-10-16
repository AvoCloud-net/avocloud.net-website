import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { snapTarget, reachBounds, hasSnapZones } from '@/lib/snap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Nav bar height — a section scrolled flush to the top would sit under it. */
const NAV_OFFSET = -72;

/** How long the page has to be still before it snaps (ms). A trackpad
 *  gesture has pauses in it — a finger resting mid-swipe sends nothing — and
 *  at 240ms the snap kept starting inside them and then fighting the rest of
 *  the swipe. */
const SNAP_IDLE = 200;

/** After a snap lands, the trackpad's momentum tail is still arriving. It is
 *  swallowed while it keeps decaying, so it can't nudge the page off the rest
 *  it just reached (which then re-snapped: the stutter). Each swallowed event
 *  extends the window by this much; a growing delta means a new gesture. */
const SETTLE_MS = 110;

/** A wheel delta against the snap's direction this strong is a deliberate
 *  reversal (a mouse wheel click, a hard swipe back) and takes control back
 *  even if it isn't growing. */
const REVERSE_DELTA = 40;

/** Section offset for in-page jumps. Pages with snap zones are built from
 *  screen-high segments that clear the nav themselves, so they land flush —
 *  landing 72px short would put the page in a transition and the snap would
 *  immediately pull it somewhere else. */
const anchorOffset = () => (hasSnapZones() ? 0 : NAV_OFFSET);

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Background grid tile sizes — must match --grid-fine / --grid-cross in
 *  global.css. The drift offsets are wrapped to these so they stay bounded. */
const FINE_TILE = 40;
const CROSS_TILE = 200;

/** The element the current URL fragment names, if it names a real one.
 *  querySelector throws on a fragment that isn't a valid selector (`#2024`),
 *  which is a perfectly legal thing for a URL to contain. */
function hashTarget(): HTMLElement | null {
  return scrollTarget(window.location.hash);
}

/** A fragment's element, but only if it is a place on the page. A fixed
 *  element (the CSS-only :target lightboxes on /craftattack/) is an overlay:
 *  scrolling "to" it only drifts the page, and intercepting the click with
 *  pushState means :target never changes, so the overlay never opens. Those
 *  links are left to the browser's own hash navigation. */
function scrollTarget(hash: string): HTMLElement | null {
  if (hash.length < 2) return null;
  let el: HTMLElement | null;
  try {
    el = document.querySelector<HTMLElement>(hash);
  } catch {
    return null;
  }
  if (!el || getComputedStyle(el).position === 'fixed') return null;
  return el;
}

/* Lenis inertia scrolling, wired to GSAP ScrollTrigger.

   Lenis drives the native scroll position; on every Lenis frame we call
   ScrollTrigger.update() so every pin / scrub / reveal stays perfectly in
   sync with the smoothed scroll. GSAP's own ticker runs Lenis' rAF (single
   loop, no competing requestAnimationFrame). In-page anchor clicks route
   through lenis.scrollTo. Everything degrades to native scroll under
   prefers-reduced-motion.

   Fragments are handled here rather than by the browser. The head script
   forces scroll 0 before first paint, because both scroll restoration and a
   native hash jump move the window without Lenis emitting a scroll event —
   which leaves ScrollTrigger holding a stale position and every pin below it
   misplaced. That made `/#staff` land on the hero instead of the section. The
   fragment is honoured below instead: after ScrollTrigger has measured the
   pinned sections, which is the first moment a section's final scroll
   position is actually known. */
export function useSmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      // No smoothing, but ScrollTrigger must still work for reveals.
      ScrollTrigger.refresh();
      const target = hashTarget();
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
      return;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      // see the snap section below — called before Lenis acts on any input
      virtualScroll: (data) => filterWheel(data),
    });

    // Read before anything can change it, then start from the top regardless:
    // the deep link is replayed through Lenis once the layout is final.
    const deepLink = hashTarget();
    lenis.scrollTo(0, { immediate: true });

    const root = document.documentElement;
    lenis.on('scroll', (l: Lenis) => {
      ScrollTrigger.update();
      // Two independent background layers (fine grid + sparse crosshairs),
      // never meant to align, so different drift rates read as parallax
      // depth instead of a broken/misaligned single grid.
      //
      // Wrapped modulo the tile size (see body::before / body::after in
      // global.css, which now consume these as a translate3d rather than a
      // background-position). The backgrounds repeat, so an offset of -37px
      // and one of -3237px draw exactly the same pixels — but the small one
      // keeps the composited layer next to the viewport instead of pushing it
      // thousands of pixels away, and keeps the number short.
      root.style.setProperty('--grid-shift-fine-y', `${((l.scroll * -0.02) % FINE_TILE).toFixed(2)}px`);
      root.style.setProperty('--grid-shift-cross-y', `${((l.scroll * -0.12) % CROSS_TILE).toFixed(2)}px`);
      if (!snapping) {
        if (l.direction) dir = l.direction;
        armSnap();
      }
    });

    /* ---- Snap -------------------------------------------------------------
       When the page comes to rest between two segments, glide to the right
       one (see lib/snap.ts for which). Only on pages that registered zones —
       the homepage — so subpages scroll exactly as before.

       Built around how a trackpad actually behaves, which is where it used to
       feel abrupt: a swipe arrives as a stream of small wheel events, with
       pauses while a finger rests, and then a long decaying momentum tail
       after the finger lifts. Three rules:

         · wait for a real stop (SNAP_IDLE) before taking over
         · while the glide runs, and for a moment after it lands, wheel input
           that is still DECAYING is absorbed — it is the tail of the gesture
           that ended, in whichever direction it points (a snap back runs
           against the swipe's momentum; letting that through pushed the page
           off its rest and it re-snapped: the stutter). Input that GROWS
           again is a new gesture and takes over at once, as does a strong
           push against the glide (REVERSE_DELTA)

       Wheel only: touch scrolling is native (Lenis doesn't smooth it), and a
       finger on the glass cancels a glide outright. */
    let dir = 1;
    let snapping = false;
    let snapDir = 0;
    let touching = false;
    let settleUntil = 0;
    let lastWheel = 0;
    let lastMag = 0;
    let bounds: [number, number] | null = null;
    let tail = 0; // magnitude of the gesture's last wheel delta — the decay reference

    let idle: ReturnType<typeof setTimeout> | undefined;

    const cancelSnap = () => {
      if (!snapping) return;
      snapping = false;
      // stop the glide where it is (reset() inside also clears any lock)
      lenis.scrollTo(lenis.animatedScroll, { immediate: true, force: true });
    };

    function filterWheel({ deltaY, event }: { deltaY: number; event: Event }): boolean {
      if (!(event instanceof WheelEvent)) return true;
      const mag = Math.abs(deltaY);
      const now = performance.now();
      const guarding = snapping || now < settleUntil;
      if (guarding) {
        const decaying = mag <= tail * 1.1 + 1;
        const pushBack = Math.sign(deltaY) !== snapDir && mag >= REVERSE_DELTA;
        if (decaying && !pushBack) {
          tail = mag;
          if (!snapping) settleUntil = now + SETTLE_MS;
          event.preventDefault(); // Lenis returns before its own preventDefault
          return false;
        }
        // a new gesture: hand control straight back
        cancelSnap();
        settleUntil = 0;
      }
      tail = mag;

      // One gesture, one screen: a new gesture (after a pause) fixes how far
      // it may travel; wheel input past that is clamped to it.
      // A swipe back up in strength also starts a new gesture: otherwise a
      // swallowed momentum tail kept the page pinned at the bound for as long
      // as it lasted (a second or more), and it felt like the page had ended.
      const fresh = now - lastWheel > 120 || (mag > 8 && mag > lastMag * 1.25);
      if (fresh) bounds = hasSnapZones() ? reachBounds(lenis.scroll, lenis.limit) : null;
      lastWheel = now;
      lastMag = mag;
      if (bounds) {
        const want = lenis.targetScroll + deltaY;
        const clamped = Math.min(bounds[1], Math.max(bounds[0], want));
        if (clamped !== want) {
          event.preventDefault();
          lenis.scrollTo(clamped, { programmatic: false, lerp: 0.09 });
          return false;
        }
      }
      return true;
    }

    const trySnap = () => {
      if (touching || snapping || !hasSnapZones()) return;
      const y = lenis.scroll;
      const vh = window.innerHeight;
      const target = snapTarget(y, dir, vh, lenis.limit);
      if (target === null || Math.abs(target - y) < 1) return;
      snapping = true;
      snapDir = Math.sign(target - y);
      // `tail` keeps the last delta of the gesture that just ended, so its
      // momentum (if any is still coming) reads as decaying from there
      // Paced by the scene change it completes, not by the pixels left: the
      // transitions live in the last screen of travel, and finishing a whole
      // focus pull in ~0.4s was the "abrupt" part.
      const duration = Math.min(1.05, 0.4 + (Math.abs(target - y) / vh) * 0.6);
      lenis.scrollTo(target, {
        duration,
        easing: easeInOutCubic,
        onComplete: () => {
          snapping = false;
          settleUntil = performance.now() + SETTLE_MS * 3;
        },
      });
    };
    function armSnap() {
      clearTimeout(idle);
      idle = setTimeout(trySnap, SNAP_IDLE);
    }
    const onKey = () => {
      cancelSnap();
      settleUntil = 0;
      armSnap();
    };
    const onTouchStart = () => {
      touching = true;
      cancelSnap();
      clearTimeout(idle);
    };
    const onTouchEnd = () => {
      touching = false;
      armSnap();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts change layout widths (Syne) — refresh once settled.
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    // Jump, don't glide: the visitor asked for this position in the URL, so
    // animating 9000px past every section on the way is a cost with no payoff.
    if (deepLink) {
      ScrollTrigger.refresh();
      lenis.scrollTo(deepLink, { offset: anchorOffset(), immediate: true });
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute('href') || '';
      const el = scrollTarget(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: anchorOffset() });
        // A fragment link is a focus move as well as a scroll — that is what
        // makes the skip link work for a screen reader. preventDefault() above
        // cancels the browser's own, so it is redone here. Only lands on
        // elements that can take focus (main carries tabindex=-1); on a plain
        // <section> it is a no-op, which is the wanted behaviour.
        (el as HTMLElement).focus?.({ preventScroll: true });
        // Keep the URL in step, so a section link is shareable and Back walks
        // the sections. pushState rather than assigning location.hash — the
        // latter makes the browser perform its own native jump, which is the
        // desync this whole path exists to avoid.
        if (hash !== window.location.hash) history.pushState(null, '', hash);
      }
    };
    document.addEventListener('click', onClick);

    // Back/forward between those pushed fragments.
    const onHashChange = () => {
      const target = hashTarget();
      if (target) lenis.scrollTo(target, { offset: anchorOffset() });
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      clearTimeout(idle);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      gsap.ticker.remove(tick);
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHashChange);
      lenis.destroy();
    };
  }, [reduce]);
}
