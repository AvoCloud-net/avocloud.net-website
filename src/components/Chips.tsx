import type { Chip } from "@/data/content";

/* Small helper: render a chip list (static + link chips). */
export function Chips({ items }: { items: Chip[] }) {
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
