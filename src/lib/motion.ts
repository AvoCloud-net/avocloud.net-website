/* ============================================================================
   avocloud — motion tokens + GSAP plugin registration
   Single source of truth for every duration, easing and stagger on the site.
   Mirrored (by hand) into:
     - src/styles/global.css        --ease* / --dur*   (CSS transitions)
     - brand/tokens/tokens.json     motion block       (brand source of truth)
     - brand/tokens/avocloud.css    --avo-ease-* etc.  (other properties)
   Change a number here → update those three. See BRANDING.md §5b.

   Import this module once from anywhere that animates; registering the same
   plugin twice is a no-op in GSAP, so there is no ordering hazard.
   ========================================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(
  ScrollTrigger, DrawSVGPlugin, SplitText, ScrambleTextPlugin,
  CustomEase, Observer, Flip, Draggable, InertiaPlugin, useGSAP,
);

/* ---- Easing --------------------------------------------------------------
   `avo-out` is the site's existing cubic-bezier(0.16, 1, 0.3, 1) expressed as
   a CustomEase so JS and CSS reference the same curve by name instead of two
   copies of four magic numbers. Registered under a name so string usage
   (ease: EASE.out) works inside ScrollTrigger config objects too. ---------- */
CustomEase.create('avo-out', 'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('avo-in-out', 'M0,0 C0.65,0 0.35,1 1,1');
CustomEase.create('avo-spring', 'M0,0 C0.34,1.56 0.64,1 1,1');

export const EASE = {
  /** default entrance — decelerating, lands softly. Almost everything. */
  out: 'avo-out',
  /** symmetric — for scrubbed / reversible tweens and cross-fades. */
  inOut: 'avo-in-out',
  /** slight overshoot — pops only: magnetic buttons, chips, badges. */
  spring: 'avo-spring',
  /** linear — mandatory for anything tied to scroll position. */
  none: 'none',
} as const;

/* ---- Duration (seconds) ---------------------------------------------------
   Four steps, not a continuum. If a value doesn't fit one of these, the
   animation is probably doing something the design language doesn't ask for. */
export const DUR = {
  /** hover, border, color, focus — must feel instant. */
  micro: 0.18,
  /** nav state, chips, toggles, small layout shifts. */
  ui: 0.35,
  /** scroll-into-view entrances. */
  enter: 0.7,
  /** the CAD wordmark reveal only. Played at SIGNATURE_TIMESCALE. */
  sig: 2.4,
} as const;

/* The brand signature always plays slowed down — the raw timeline reads as
   rushed. BRANDING.md §5 fixes this at 0.6; don't pass a different value. */
export const SIGNATURE_TIMESCALE = 0.6;

/* ---- Stagger (seconds between siblings) ---------------------------------- */
export const STAG = {
  char: 0.018,
  word: 0.05,
  line: 0.09,
  /** cards, chips, nav links — anything discrete. */
  card: 0.06,
} as const;

/** Cap for index-derived delays so a long list never leaves the last item
 *  sitting invisible for a second and a half. */
export const STAG_MAX = 0.3;

/* ---- Scroll thresholds ---------------------------------------------------
   One place for the ScrollTrigger `start` strings so reveals fire in a
   consistent band rather than each component picking its own percentage.

   Both are wrapped in ScrollTrigger's `clamp()` (v3.12+), which pins the
   computed start/end inside the page's actual scroll range. Without it an
   element near the document bottom can have a start position that is
   mathematically unreachable — its top never crosses 88% of the viewport even
   at max scroll — and the content simply never appears. This used to be worked
   around by loosening the threshold to 90% and hoping; clamp() solves it
   exactly and means one threshold works everywhere on the page. */
export const START = {
  /** normal reveal — element is ~1/8 into the viewport. */
  reveal: 'clamp(top 88%)',
  /** slightly earlier, for large blocks that need a head start. */
  early: 'clamp(top 95%)',
} as const;

/** ScrollTrigger refresh order. Refresh runs in creation order unless told
 *  otherwise, and anything built late (after fonts load, after a measure pass)
 *  lands out of order — by then a pinned section above it has already inserted
 *  its spacer and moved everything below. Lower number = refreshed earlier. */
export const PRIORITY = {
  nav: -10,
  section: 0,
  /** the wordmark measures glyphs before it can build, so it always lands last */
  late: 10,
} as const;

export { gsap, ScrollTrigger, DrawSVGPlugin, SplitText, ScrambleTextPlugin, CustomEase, Observer, Flip, Draggable, InertiaPlugin, useGSAP };
