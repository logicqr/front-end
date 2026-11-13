import { Link } from 'react-router-dom';
import { Logo } from './ui';
import { SITE } from '../../data/site';

export default function Footer() {
  return (
    <footer className="foot wrap">
      <Logo />

      <nav aria-label="Footer">
        <Link to="/features">How it works</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/blog">Guides</Link>
        <Link to="/docs">Setup</Link>
        <Link to="/terms-condition">Terms</Link>
        <Link to="/login">Sign in</Link>
      </nav>

      <small>
        © {new Date().getFullYear()} {SITE.name} · {SITE.address.city}, {SITE.address.region} ·{' '}
        {/* Shown as selectable text as well as a link: mailto: does not reliably
            open for every visitor, and a dead-looking link is worse than an address. */}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <br />
        Google and the Google logo are trademarks of Google LLC. {SITE.name} is not affiliated with, endorsed by or
        sponsored by Google.
      </small>
    </footer>
  );
}
