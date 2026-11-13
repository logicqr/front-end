import { Link } from 'react-router-dom';
import { Mark } from '../marketing/ui';

/**
 * Shared frame for sign-in, sign-up and password reset.
 *
 * There used to be three copies of a rotating image carousel across the two
 * login pages and the register page, each with its own slightly different
 * marketing copy — one of which advertised "paperless contract management" and
 * a "team communication hub", which is a different product entirely.
 *
 * One frame, one set of claims, and the right-hand panel states what the page
 * is for rather than auto-advancing through stock photography.
 */
export default function AuthShell({ title, subtitle, children, aside, footer }) {
  return (
    <div className="auth">
      <div className="auth-form">
        <Link className="auth-logo" to="/" aria-label="LogicQR home">
          <Mark />
          <span>
            Logic<span>QR</span>
          </span>
        </Link>

        <div className="auth-body">
          <h1 className="auth-h">{title}</h1>
          {subtitle ? <p className="auth-sub">{subtitle}</p> : null}
          {children}
        </div>

        {footer ? <div className="auth-foot">{footer}</div> : null}
      </div>

      <aside className="auth-aside" aria-hidden={!aside}>
        {aside}
      </aside>
    </div>
  );
}

/** The default right-hand panel: what the product does, in three lines. */
export function AuthAside({ points, heading, note }) {
  return (
    <div className="auth-aside-in">
      <h2 className="auth-aside-h">{heading}</h2>
      <ul className="auth-points">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {note ? <p className="auth-note">{note}</p> : null}
    </div>
  );
}
