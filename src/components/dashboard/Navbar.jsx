import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LuLayoutDashboard, LuLogOut } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import { BiHelpCircle } from 'react-icons/bi';
import { LiaRupeeSignSolid } from 'react-icons/lia';
import { useAuth } from '../../lib/auth';
import { Mark } from '../marketing/ui';

/**
 * Top bar for the signed-in customer.
 *
 * Name and id come from the auth provider rather than sessionStorage, where
 * "name" was only written later by the dashboard, so the bar used to render
 * blank on the first paint after signing in.
 *
 * Changes from the previous bar: the mobile panel is a real dialog with a
 * scrim and Escape-to-close; sign-out is a button, not a clickable div; the
 * avatar is the person's initials instead of a stock image loaded from a
 * third-party CDN; and every control has a label.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id: userId, displayName: userName, signOut } = useAuth();

  const items = [
    { name: 'Dashboard', path: `/dashboard/${userId}`, icon: LuLayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: LiaRupeeSignSolid },
    { name: 'Account', path: '/settings', icon: CgProfile },
    { name: 'Help', path: '/help-centre', icon: BiHelpCircle },
  ];

  const initials = (userName || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Close the panel on navigation, and let Escape close it or the dialog.
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setConfirming(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open || confirming ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, confirming]);

  const confirmSignOut = async () => {
    setConfirming(false);
    /**
     * `signOut` revokes the refresh token on the server and clears localStorage
     * too. Clearing only sessionStorage used to leave the previous customer's
     * name, email and phone on the machine for the next person at a shared
     * browser.
     */
    await signOut();
    navigate('/login', { replace: true });
  };

  const linkCls = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14.5px] font-medium transition ${
      isActive ? 'bg-ink text-white' : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
    }`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to={`/dashboard/${userId}`} className="logo shrink-0" aria-label="LogicQR dashboard">
            <Mark />
            <span className="wm">
              Logic<span>QR</span>
            </span>
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {items.map(({ name, path, icon: Icon }) => (
              <NavLink key={name} to={path} className={linkCls}>
                <Icon className="text-lg" aria-hidden="true" />
                {name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 ring-1 ring-ink/10">
              <span
                className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-semibold text-white"
                aria-hidden="true"
              >
                {initials}
              </span>
              <span className="max-w-[10rem] truncate text-sm font-medium text-ink">{userName || 'Account'}</span>
            </span>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label="Sign out"
              title="Sign out"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-signal-warn-soft hover:text-[#8f2f0c]"
            >
              <LuLogOut className="text-xl" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-ink/15 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="customer-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="flex h-4 w-5 flex-col items-center justify-center gap-[5px]" aria-hidden="true">
              <span
                className={`block h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                  open ? 'translate-y-[3.25px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                  open ? '-translate-y-[3.25px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile panel */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <nav
          id="customer-menu"
          aria-label="Main"
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-ink px-4 pb-6 pt-20 text-white transition-transform duration-300 ease-ease ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <ul className="space-y-1">
            {items.map(({ name, path, icon: Icon }) => (
              <li key={name}>
                <NavLink
                  to={path}
                  tabIndex={open ? 0 : -1}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-[16px] font-medium transition ${
                      isActive ? 'bg-white text-ink' : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="text-xl" aria-hidden="true" />
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-auto border-t border-white/10 pt-4">
            <div className="mb-2 flex items-center gap-3 px-2">
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs font-semibold"
                aria-hidden="true"
              >
                {initials}
              </span>
              <span className="min-w-0 truncate text-sm font-medium">{userName || 'Account'}</span>
            </div>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setOpen(false);
                setConfirming(true);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[16px] font-medium text-white/75 transition hover:bg-signal-warn/20 hover:text-white"
            >
              <LuLogOut className="text-xl" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </nav>
      </div>

      {/* Sign-out confirmation */}
      {confirming ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-title"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-card">
            <h2 id="signout-title" className="text-lg font-semibold tracking-tight text-ink">
              Sign out?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Your QR code keeps working and feedback keeps arriving while you are signed out.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-ink/15 transition hover:bg-paper"
              >
                Stay signed in
              </button>
              <button
                type="button"
                onClick={confirmSignOut}
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
