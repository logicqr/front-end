import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/motion';

/**
 * Runs GSAP code scoped to one component and reverts it on unmount.
 *
 *   const ref = useGsap(() => { gsap.from('.card', { y: 40 }); });
 *   return <section ref={ref}>…</section>;
 *
 * Selector strings inside the callback only match elements under `ref`, and
 * every tween and ScrollTrigger created is reverted on cleanup — which is also
 * what makes it safe under StrictMode's double-invoked effects.
 */
export function useGsap(setup, deps = []) {
  const scope = useRef(null);

  useLayoutEffect(() => {
    let cleanup;
    const ctx = gsap.context(() => {
      cleanup = setup(scope.current);
    }, scope);

    return () => {
      cleanup?.();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
