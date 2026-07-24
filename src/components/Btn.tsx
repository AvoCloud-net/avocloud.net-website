import type { ReactNode } from 'react';
import { Magnetic } from './motion';

/* ---------------------------------------------------------------------------
   Btn — the site's button.

   Three things happen on hover, all of them the same gesture the rest of the
   site uses (a line passes over something):

     · coral wipes in from the left           (CSS, ::before)
     · the label rolls up and a copy rolls in behind it
     · the icon steps forward

   The label roll is two stacked copies inside an overflow-clipped box, moved
   with `translateY` — pure CSS, so it costs no JS, works before hydration and
   disappears correctly under `prefers-reduced-motion` with the rest of the
   transitions. The second copy is `aria-hidden`, so the accessible name stays
   a single label rather than being read twice.
--------------------------------------------------------------------------- */
type Props = {
  children: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  /** coral fill — one per view, the primary action */
  primary?: boolean;
  target?: string;
  rel?: string;
  title?: string;
  'aria-label'?: string;
};

export function Btn({ children, icon, primary, ...rest }: Props) {
  return (
    <Magnetic className={`btn${primary ? ' primary' : ''}`} strength={0.28} {...rest}>
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-label">
        <span className="btn-label-in">{children}</span>
        <span className="btn-label-out" aria-hidden="true">
          {children}
        </span>
      </span>
    </Magnetic>
  );
}
