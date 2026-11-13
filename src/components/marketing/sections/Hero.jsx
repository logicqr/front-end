import { useEffect, useState } from 'react';
import { Pill, Eyebrow } from '../ui';
import { useGsap } from '../../../hooks/useGsap';
import { anim, gsap, E } from '../../../lib/motion';
import { FIRST_MONTH, MONTHLY } from '../../../data/site';
import { trackClick } from '../../../lib/tracking';

const ROTATING = ['on Google.', 'on your counter.', 'before they leave.', 'without asking twice.'];

const STATS = [
  { chip: 'Typical', n: '1 in 4', caption: 'customers who scan leave a review, against roughly 1 in 50 who are only asked', color: 'c-sage' },
  { chip: 'Setup', n: '1 hr', caption: 'from signing up to a printed code on your counter collecting feedback', color: 'c-lilac' },
  { chip: 'First month', n: FIRST_MONTH, caption: `then ${MONTHLY} a month — cancel from your dashboard any time`, color: 'c-butter' },
];

/** The headline word that cycles. */
function RotatingWord() {
  const [cur, setCur] = useState(0);
  const [out, setOut] = useState(-1);

  useEffect(() => {
    if (!anim) return undefined;

    let outTimer;
    const id = setInterval(() => {
      setCur((c) => {
        setOut(c);
        clearTimeout(outTimer);
        outTimer = setTimeout(() => setOut(-1), 900);
        return (c + 1) % ROTATING.length;
      });
    }, 2600);

    return () => {
      clearInterval(id);
      clearTimeout(outTimer);
    };
  }, []);

  return (
    <em className="rot" aria-label={ROTATING[0]}>
      {ROTATING.map((word, i) => (
        <span key={word} className={`rw${i === cur ? ' on' : i === out ? ' out' : ''}`} aria-hidden={i !== cur}>
          {word}
        </span>
      ))}
    </em>
  );
}

/**
 * The hero demo: a phone showing the review page, with stars you can actually
 * tap. Tapping 4 or 5 shows the Google hand-off; tapping 1 to 3 shows the
 * private form. It explains the whole product in one gesture, which a
 * screenshot cannot.
 */
function ScanDemo() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const shown = hover || rating;
  const outcome = rating === 0 ? null : rating >= 4 ? 'google' : 'private';

  const pick = (n) => {
    setRating(n);
    trackClick('demo_star_tapped', { rating: n });
  };

  return (
    <div className="scan" aria-label="Interactive preview of the review page">
      <div className="scan-phone ui">
        <div className="scan-top">
          <span>9:41</span>
          <span className="scan-sig" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>

        <div className="scan-body">
          <p className="scan-biz">Kumar&apos;s Coffee House</p>
          <p className="scan-ask">How was your visit?</p>

          <div className="scan-stars" role="radiogroup" aria-label="Your rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                className={`scan-star${n <= shown ? ' on' : ''}`}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onFocus={() => setHover(n)}
                onBlur={() => setHover(0)}
                onClick={() => pick(n)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.6l2.95 6.05 6.65.92-4.8 4.62 1.15 6.6L12 17.7l-5.95 3.09 1.15-6.6-4.8-4.62 6.65-.92L12 2.6Z" />
                </svg>
              </button>
            ))}
          </div>

          {outcome === null ? (
            <p className="scan-hint">Tap a rating to see what happens next</p>
          ) : outcome === 'google' ? (
            <div className="scan-out google">
              <span className="scan-badge">Happy customer</span>
              <b>Opening your Google page</b>
              <small>They land on your review form, already signed in, ready to type.</small>
            </div>
          ) : (
            <div className="scan-out private">
              <span className="scan-badge warn">Needs fixing</span>
              <b>Comes straight to you</b>
              <small>A short private note by email and in your dashboard. Nothing is published.</small>
            </div>
          )}
        </div>
      </div>

      <p className="scan-note">
        {rating === 0
          ? 'This is the page your customers see.'
          : rating >= 4
            ? 'Public review, on the listing that wins you searches.'
            : 'Private feedback, while you can still do something about it.'}
      </p>
    </div>
  );
}

export default function Hero() {
  const ref = useGsap(() => {
    if (!anim) return;

    gsap
      .timeline({ defaults: { ease: E } })
      .from('.hero-h .ln > span', { yPercent: 110, duration: 1.2, stagger: 0.09 })
      .from('.hero-t .eyebrow', { opacity: 0, y: 10, duration: 0.7 }, 0)
      .from('.hero-t .lede, .hero-t .cta, .hero-t > .fine', { opacity: 0, y: 18, duration: 0.9, stagger: 0.07 }, 0.45)
      .from('.scan', { opacity: 0, y: 30, duration: 1.1 }, 0.55)
      .from('.hc', { y: 56, opacity: 0, duration: 1.1, stagger: 0.09, clearProps: 'transform' }, 0.7);
  });

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="wrap">
        <div className="hero-t">
          <Eyebrow>For cafés, clinics, salons, workshops and shops</Eyebrow>

          <h1 className="display hero-h">
            <span className="ln">
              <span>Your best customers</span>
            </span>
            <span className="ln">
              <span>already like you.</span>
            </span>
            <span className="ln">
              <span>
                <RotatingWord />
              </span>
            </span>
          </h1>

          <p className="lede">
            Put a QR code where people pay. They scan, tap a rating, and the happy ones land on your Google review
            page. Everyone else tells you privately — so you hear about the cold coffee instead of reading about it.
          </p>

          <div className="cta" style={{ marginTop: 26 }}>
            <Pill to="/register" variant="lg" event="cta_hero_start" eventMeta={{ placement: 'hero' }}>
              Start for {FIRST_MONTH}
            </Pill>
            <a className="tlink" href="#how">
              See how it works
            </a>
          </div>

          <p className="fine">
            {FIRST_MONTH} first month, then {MONTHLY}/month · No contract · Cancel in one click
          </p>

          <div className="hero-panel">
            <ScanDemo />
          </div>
        </div>
      </div>

      <div className="wrap hcards">
        {STATS.map((s) => (
          <article key={s.chip} className={`hc ${s.color}`}>
            <span className="chip">{s.chip}</span>
            <p className="hc-n">{s.n}</p>
            <p className="hc-c">{s.caption}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
