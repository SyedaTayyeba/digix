import { useEffect, useRef, useState } from 'react';

/**
 * Fades + slides an element up once it scrolls into view.
 *
 * Why a hook instead of a wrapper component: every reveal block in this
 * design needs its own transition-delay (staggered lists, badges, etc.),
 * so it's simpler to hand back a ref + boolean and let each component
 * decide how to apply them, rather than forcing one <Reveal> layout shape
 * on every caller.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion users by just showing content immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Once revealed, stop watching — this is a one-time entrance,
          // not a scroll-linked toggle.
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
