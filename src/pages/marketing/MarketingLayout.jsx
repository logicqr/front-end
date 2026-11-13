import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from '../../components/marketing/Nav';
import Footer from '../../components/marketing/Footer';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { trackPageView } from '../../lib/tracking';
import { ScrollTrigger } from '../../lib/motion';

/**
 * Shell for every marketing page. Owns the nav, the footer, smooth scrolling,
 * page-view tracking and scroll restoration.
 *
 * The `mkt` class is what scopes the plain-CSS design system — the product
 * dashboard sits outside it and keeps its Tailwind styling.
 */
export default function MarketingLayout() {
  const location = useLocation();
  useSmoothScroll();

  // One page-view beacon per route change, which is what feeds the admin
  // attribution report.
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, location.search]);

  // Start at the top on navigation, unless the URL points at an anchor.
  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [location.pathname]);

  // Pinned and scrubbed sections measure the page; re-measure once the webfonts
  // have loaded and whenever the content resizes, or every trigger is off.
  useEffect(() => {
    let timer;
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 160);
    });
    const main = document.getElementById('main');
    if (main) observer.observe(main);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <div className="mkt">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
