import { useEffect, useRef } from 'react';
import { SectionHeader, Pill } from '../ui';
import { useGsap } from '../../../hooks/useGsap';
import { anim, gsap, ScrollTrigger } from '../../../lib/motion';

/* ---------------------------------------------------------------- *
 * Illustrations
 * ---------------------------------------------------------------- */

/** A deterministic QR-ish block pattern — decorative, not a scannable code. */
function QrArt({ seed = 7 }) {
  const cells = [];
  const size = 21;
  // A tiny LCG so the pattern is stable across renders rather than flickering.
  let state = seed * 9301 + 49297;
  const rand = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  const isFinder = (x, y) =>
    (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (isFinder(x, y)) continue;
      if (rand() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }

  const finder = (ox, oy) => (
    <g key={`f${ox}${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#fff" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" />
    </g>
  );

  return (
    <svg className="tcard-qr" viewBox={`0 0 ${size} ${size}`} aria-hidden="true" shapeRendering="crispEdges">
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
      {cells}
    </svg>
  );
}

function CounterCard() {
  return (
    <div className="tcard">
      <p className="tcard-k">Scan to review</p>
      <p className="tcard-h">How was your coffee today?</p>
      <QrArt seed={11} />
      <p className="tcard-url">logicqr.com/review/kumars</p>
      <p className="tcard-foot">Takes 10 seconds · No app needed</p>
    </div>
  );
}

function Stars({ filled }) {
  return (
    <span className="split-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={n <= filled ? undefined : 'off'} viewBox="0 0 24 24">
          <path d="M12 2.6l2.95 6.05 6.65.92-4.8 4.62 1.15 6.6L12 17.7l-5.95 3.09 1.15-6.6-4.8-4.62 6.65-.92L12 2.6Z" />
        </svg>
      ))}
    </span>
  );
}

function SplitArt() {
  return (
    <div className="split">
      <div className="split-row google">
        <Stars filled={5} />
        <div>
          <b>Straight to Google</b>
          <small>Your review page opens. One tap, and it is public.</small>
        </div>
      </div>
      <div className="split-row google">
        <Stars filled={4} />
        <div>
          <b>Straight to Google</b>
          <small>Four stars is a good review. It still counts.</small>
        </div>
      </div>
      <div className="split-row private">
        <Stars filled={2} />
        <div>
          <b>Private note to you</b>
          <small>&ldquo;Waited 20 minutes and nobody checked on us.&rdquo;</small>
        </div>
      </div>
    </div>
  );
}

function DashboardMock() {
  return (
    <div className="dmock ui">
      <div className="dmock-h">
        <div>
          <small>This month</small>
          <h4>Kumar&apos;s Coffee House</h4>
        </div>
        <span className="tag">Collecting</span>
      </div>

      <div className="dmock-tiles">
        <div className="dmock-tile">
          <b>184</b>
          <small>scans</small>
        </div>
        <div className="dmock-tile">
          <b>47</b>
          <small>sent to Google</small>
        </div>
        <div className="dmock-tile">
          <b>9</b>
          <small>private notes</small>
        </div>
      </div>

      <ul className="dmock-list">
        <li>
          <span className="dmock-rate">2★</span>
          <p>Filter coffee was lukewarm by the time it arrived</p>
          <time>2h</time>
        </li>
        <li>
          <span className="dmock-rate">3★</span>
          <p>Only one person on the counter at lunch</p>
          <time>Yesterday</time>
        </li>
        <li>
          <span className="dmock-rate ok">5★</span>
          <p>Went to Google — &ldquo;Best filter coffee in Velachery&rdquo;</p>
          <time>Yesterday</time>
        </li>
        <li>
          <span className="dmock-rate">1★</span>
          <p>Card machine was down and no sign anywhere</p>
          <time>3d</time>
        </li>
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Manifesto — words fill in as you scroll past
 * ---------------------------------------------------------------- */

const MANIFESTO =
  'Nobody wakes up planning to review a coffee shop. The people who loved you walk out and forget. The one person who had a bad morning goes home and types for ten minutes. That is how a good business ends up with a 3.8.';

export function Manifesto() {
  const ref = useRef(null);

  useEffect(() => {
    if (!anim || !ref.current) return undefined;

    const words = ref.current.querySelectorAll('.w');
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 78%',
      end: 'bottom 55%',
      scrub: true,
      onUpdate: (self) => {
        const upTo = Math.floor(self.progress * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i <= upTo));
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section className="manifesto">
      <div className="wrap mani-g">
        <div className="mani-h">
          <p className="kicker">The problem</p>
          <h2 className="display sm">Reviews are not a popularity contest. They are a memory contest.</h2>
        </div>

        <p className="scrub" ref={ref}>
          {MANIFESTO.split(' ').map((word, i) => (
            <span className="w" key={`${word}-${i}`}>
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * Feature bands
 * ---------------------------------------------------------------- */

const BANDS = [
  {
    n: '01',
    cls: 'f-sage',
    title: 'Put the code where they pay',
    body: (
      <>
        You get a print-ready table card, counter stand and sticker artwork the moment you sign up — plus a short link
        for receipts, WhatsApp and your email signature. <b>The best spot is wherever they are already waiting</b>: the
        bill tray, the counter, the back of the chair.
      </>
    ),
    art: <CounterCard />,
  },
  {
    n: '02',
    cls: 'f-butter',
    title: 'They scan and tap one rating',
    body: (
      <>
        The camera opens your page — no app, no login, no form to fill in first. One tap on a star is the entire ask,
        which is why people actually finish it. <b>Ten seconds, start to end.</b>
      </>
    ),
    art: <SplitArt />,
  },
  {
    n: '03',
    cls: 'f-lilac',
    title: 'Happy ones go public, the rest come to you',
    body: (
      <>
        Four and five stars land on your Google review page while they still have their phone out. One to three opens a
        short private note instead. <b>You find out about the lukewarm coffee by email, not by reading it on Google.</b>
      </>
    ),
    art: <DashboardMock />,
  },
];

export function HowItWorks() {
  const ref = useGsap(() => {
    if (!anim) return;

    gsap.utils.toArray('.feat').forEach((band) => {
      gsap.from(band.querySelectorAll('.feat-t > *, .feat-v > *'), {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: band, start: 'top 72%' },
      });
    });
  });

  return (
    <section className="how" id="how" ref={ref}>
      <div className="wrap">
        <SectionHeader kicker="How it works" title={<>Three steps. No staff training.</>}>
          Your team does not have to remember to ask, chase anyone, or explain what to do. The code does the asking,
          every single time, to every single customer.
        </SectionHeader>
      </div>

      {BANDS.map((band) => (
        <article className={`feat ${band.cls}`} key={band.n}>
          <div className="feat-t">
            <span className="num">{band.n}</span>
            <h3>{band.title}</h3>
            <p>{band.body}</p>
          </div>
          <div className="feat-v">{band.art}</div>
        </article>
      ))}

      <div className="wrap" style={{ marginTop: 36 }}>
        <div className="cta">
          <Pill to="/register" event="cta_how_start">
            Get my QR code
          </Pill>
          <a className="tlink" href="/docs">
            Read the setup guide
          </a>
        </div>
      </div>
    </section>
  );
}
