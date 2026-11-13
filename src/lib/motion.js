import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * One place to register GSAP plugins and read the motion flags, so no component
 * has to work out whether it is allowed to animate.
 *
 * `?static` in the URL turns every animation off, which is what makes
 * screenshots and visual checks reproducible.
 */

gsap.registerPlugin(ScrollTrigger);

export const reduced =
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isMobile = typeof matchMedia === 'function' && matchMedia('(max-width: 860px)').matches;

export const STATIC =
  typeof location !== 'undefined' && new URLSearchParams(location.search).has('static');

if (STATIC && typeof document !== 'undefined') {
  document.documentElement.classList.add('static');
}

export const anim = !reduced && !STATIC;
export const E = 'power3.out';

export { gsap, ScrollTrigger };
