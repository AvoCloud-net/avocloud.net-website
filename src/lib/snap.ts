/* ============================================================================
   Scroll snap — where the page is allowed to come to rest.

   Every segment of the homepage fills the screen, and when the visitor stops
   scrolling part-way between two of them, useSmoothScroll glides the page to
   the right one. "Right" is decided here.

   Segments describe themselves as REST ZONES — [from, to] in document scroll
   pixels — rather than single points:

     · a plain screen-high section   → one point   [top, top]
     · a section taller than a screen → a range    [top, bottom - viewport],
       read freely, snapped only once you leave it
     · a pinned set piece (product stack, finale) → one zone per moment that
       is fully composed: each card fully in, each sentence sharp

   Anything between two zones is a transition, and stopping in a transition is
   what triggers the snap. Zones are computed on demand (from ScrollTrigger
   start/end values, which are already corrected for pin spacers), so nothing
   here goes stale after a resize or a font swap.
   ========================================================================== */

export type Zone = [number, number];
type Source = () => Zone[];

const sources = new Set<Source>();

/** Register a zone provider; returns the unregister function. */
export function registerSnap(source: Source): () => void {
  sources.add(source);
  return () => {
    sources.delete(source);
  };
}

export function hasSnapZones(): boolean {
  return sources.size > 0;
}

function zones(): Zone[] {
  const all = [...sources]
    .flatMap((s) => s())
    .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b))
    .map(([a, b]) => [Math.min(a, b), Math.max(a, b)] as Zone)
    .sort((x, y) => x[0] - y[0]);
  // merge overlapping / touching zones
  const out: Zone[] = [];
  for (const z of all) {
    const last = out[out.length - 1];
    if (last && z[0] <= last[1] + 1) last[1] = Math.max(last[1], z[1]);
    else out.push([z[0], z[1]]);
  }
  return out;
}

/**
 * How far one gesture may carry the page: from the start of the screen before
 * the one it began on to the end of the screen after it. A hard flick on a
 * trackpad or wheel otherwise shoots straight through short segments — About
 * to Mission to the product stack in one go — and the visitor never sees the
 * one in between.
 */
export function reachBounds(y: number, limit: number): [number, number] | null {
  const list = zones();
  if (!list.length) return null;
  let i = -1; // index of the zone at or below y
  list.forEach((z, k) => {
    if (z[0] <= y + 1) i = k;
  });
  const inside = i >= 0 && y <= list[i][1] + 1;
  const lo = (inside ? list[i - 1] ?? list[i] : list[i] ?? list[0])[0];
  const hiZone = inside ? list[i + 1] ?? list[i] : list[i + 1] ?? list[list.length - 1];
  return [Math.max(0, lo), Math.min(limit, hiZone[1])];
}

/** How far into a transition (0–1) a stop has to be before the snap follows
 *  the scroll direction instead of falling back. Low on purpose: a short
 *  deliberate nudge toward the next screen should take you there. */
const COMMIT = 0.2;

/**
 * Where to settle from `y`, or null to stay put.
 * `dir` is the direction of the last scroll movement (1 down, -1 up).
 */
export function snapTarget(y: number, dir: number, viewport: number, limit: number): number | null {
  const list = zones();
  if (!list.length) return null;

  let prev: Zone | undefined;
  let next: Zone | undefined;
  for (const z of list) {
    if (y >= z[0] - 1 && y <= z[1] + 1) return null; // already at rest
    if (z[1] < y) prev = z;
    else if (!next && z[0] > y) next = z;
  }

  let target: number;
  if (!prev) target = next![0];
  else if (!next) target = prev[1];
  else {
    const a = prev[1];
    const b = next[0];
    // A gap this long isn't a transition between two screens — it is content
    // nobody registered. Leave the visitor where they are.
    if (b - a > viewport * 2.5) return null;
    const f = (y - a) / (b - a);
    target = dir >= 0 ? (f > COMMIT ? b : a) : f < 1 - COMMIT ? a : b;
  }
  return Math.max(0, Math.min(limit, target));
}
