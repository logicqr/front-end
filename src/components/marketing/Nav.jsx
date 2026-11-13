import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo, Pill } from './ui';
import { FIRST_MONTH } from '../../data/site';

const LINKS = [
  ['/features', 'How it works'],
  ['/pricing', 'Pricing'],
  ['/blog', 'Guides'],
  ['/docs', 'Setup'],
];

/**
 * Marketing top bar. Goes solid after a little scroll, hides on the way down,
 * shows reading progress, and opens a full-screen menu on phones.
 *
 * It also publishes its height as `--nav-offset` so sticky things below it
 * (the article table of contents, for one) can track it.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const bar = useRef(null);
  const header = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);

      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current && y > 140);
        lastY.current = y;
      }

      if (bar.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const h = hidden && !open ? 0 : header.current?.offsetHeight || 64;
    document.documentElement.style.setProperty('--nav-offset', `${h}px`);
  }, [hidden, open]);

  // Close the menu on navigation, and stop the page behind it scrolling.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const cls = ['nav', solid && 'solid', hidden && !open && 'hide', open && 'open'].filter(Boolean).join(' ');

  return (
    <header className={cls} ref={header}>
      <Logo />

      <nav aria-label="Main">
        <ul className="links">
          {LINKS.map(([to, label]) => (
            <li key={to}>
              <Link to={to} className={location.pathname.startsWith(to) ? 'on' : undefined}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-r">
        <Link className="login tlink" to="/login">
          Sign in
        </Link>
        <Pill to="/register" variant="sm" event="cta_nav_start">
          Start for {FIRST_MONTH}
        </Pill>
        <button
          className="burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mkt-menu"
          type="button"
          onClick={() => setOpen((o) => !o)}
        >
          <i />
          <i />
        </button>
      </div>

      <div className="menu" id="mkt-menu">
        {LINKS.map(([to, label]) => (
          <Link key={to} to={to}>
            {label}
          </Link>
        ))}
        <Link to="/login">Sign in</Link>
        <div style={{ marginTop: 24 }}>
          <Pill to="/register" event="cta_menu_start">
            Start for {FIRST_MONTH}
          </Pill>
        </div>
      </div>

      <span className="progress" ref={bar} aria-hidden="true" />
    </header>
  );
}
