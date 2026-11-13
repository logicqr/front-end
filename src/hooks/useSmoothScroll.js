import { useEffect } from 'react';
import Lenis from 'lenis';
import { anim, gsap, ScrollTrigger } from '../lib/motion';

/**
 * Lenis smooth scrolling on the marketing pages, driven by GSAP's ticker so
 * ScrollTrigger stays in sync with it. Also makes in-page `#hash` links glide
 * instead of jumping.
 *
 * Skipped entirely when the visitor has asked for reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    let lenis = null;
    const raf = (t) => lenis.raf(t * 1000);

    if (anim) {
      lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9, touchMultiplier: 1.1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.3, offset: -80 });
      else target.scrollIntoView({ behavior: 'smooth' });
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      if (lenis) {
        gsap.ticker.remove(raf);
        lenis.destroy();
      }
    };
  }, []);
}
