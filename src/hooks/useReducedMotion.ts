import { useEffect, useState } from 'react';

/* Tracks prefers-reduced-motion. SSR-safe (starts false = motion allowed, which
   matches the server render), updates on mount and when the setting changes. */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduce;
}
