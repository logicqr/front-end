import { Link } from 'react-router-dom';
import { trackClick } from '../../lib/tracking';

/**
 * The small set of primitives the marketing pages are built from. Carried over
 * from the reference system so both properties read as one family.
 */

/** The LogicQR mark: a QR corner-finder square with the signal dot. */
export function Mark({ className = 'qmark' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {/* Corner finder, as on a real QR code */}
      <path
        className="q1"
        d="M2 2h9v9H2V2Zm2.2 2.2v4.6h4.6V4.2H4.2Zm-2.2 11h9v9H2v-9Zm2.2 2.2v4.6h4.6v-4.6H4.2ZM15 2h9v9h-9V2Zm2.2 2.2v4.6h4.6V4.2h-4.6Z"
      />
      {/* Data cells + the accent dot that marks a scan */}
      <path className="q2" d="M15 15h3.4v3.4H15V15Zm5.6 0H24v3.4h-3.4V15ZM15 20.6h3.4V24H15v-3.4Zm5.6 0H24V24h-3.4v-3.4Z" />
    </svg>
  );
}

export function Logo({ to = '/' }) {
  return (
    <Link className="logo" to={to} aria-label="LogicQR home">
      <Mark />
      <span className="wm">
        Logic<span>QR</span>
      </span>
    </Link>
  );
}

/**
 * The rounded call-to-action with the arrow.
 *
 *   <Pill to="/register" event="cta_hero_start">Start for ₹49</Pill>
 *   <Pill href="#how" variant="ghost" icon="↓">See how it works</Pill>
 *
 * `event` records the press for the admin attribution report. Every CTA on the
 * site passes one, which is what makes "how many clicks did we get" answerable.
 */
export function Pill({
  children,
  to,
  href,
  onClick,
  variant = '',
  icon = '→',
  event,
  eventMeta,
  type = 'button',
  disabled,
  className = '',
  ...rest
}) {
  const cls = ['pill', variant, className].filter(Boolean).join(' ');

  const handle = (e) => {
    if (event) trackClick(event, eventMeta);
    onClick?.(e);
  };

  const inner = (
    <>
      <span>{children}</span>
      <i aria-hidden="true">{icon}</i>
    </>
  );

  if (to) {
    return (
      <Link className={cls} to={to} onClick={handle} {...rest}>
        {inner}
      </Link>
    );
  }
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a
        className={cls}
        href={href}
        onClick={handle}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={handle} disabled={disabled} {...rest}>
      {inner}
    </button>
  );
}

/** Kicker + big heading on the left, a short paragraph on the right. */
export function SectionHeader({ kicker, title, children, light = false, id }) {
  return (
    <div className="sec-h" id={id}>
      <div>
        {kicker ? <p className={light ? 'kicker light' : 'kicker'}>{kicker}</p> : null}
        <h2 className="display md">{title}</h2>
      </div>
      {children ? <p className={light ? 'sec-p light' : 'sec-p'}>{children}</p> : null}
    </div>
  );
}

export function Eyebrow({ children }) {
  return (
    <p className="eyebrow">
      <span className="dot" />
      {children}
    </p>
  );
}

/** A `<details>` FAQ list. Native disclosure, so it works without JS and is keyboard-accessible. */
export function Faq({ items, idPrefix = 'faq' }) {
  return (
    <div className="faq">
      {items.map((item, i) => (
        <details key={item.q} id={`${idPrefix}-${i}`}>
          <summary
            onClick={() => trackClick('faq_opened', { question: item.q.slice(0, 80) })}
          >
            {item.q}
          </summary>
          <div>
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
