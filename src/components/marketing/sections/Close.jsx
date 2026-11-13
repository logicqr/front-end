import { Link } from 'react-router-dom';
import { SectionHeader, Pill, Faq } from '../ui';
import { useGsap } from '../../../hooks/useGsap';
import { anim, gsap, E } from '../../../lib/motion';
import { FAQ, FIRST_MONTH, MONTHLY } from '../../../data/site';

/* ---------------------------------------------------------------- *
 * Proof strip
 * ---------------------------------------------------------------- */

const TRADES = [
  'Cafés',
  'Restaurants',
  'Dental clinics',
  'Salons & spas',
  'Gyms',
  'Car workshops',
  'Opticians',
  'Pharmacies',
  'Tuition centres',
  'Hotels',
];

export function Proof() {
  return (
    <section className="logos">
      <div className="wrap">
        <p className="logos-k">Built for businesses where people walk in, pay, and leave</p>
        <ul className="lgrow">
          {TRADES.map((trade) => (
            <li key={trade}>{trade}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * Who it's for
 * ---------------------------------------------------------------- */

const CASES = [
  {
    kind: 'Café',
    thought: 'We were at 3.9 and losing the lunch crowd to a place with 4.6 and worse coffee.',
    big: '4.6',
    cap: 'after eleven weeks',
    points: ['Code on every bill tray', 'Fixed the lunch queue after 6 private notes', 'Now first for “coffee near me”'],
  },
  {
    kind: 'Dental clinic',
    thought: 'Patients say lovely things to my face and then nothing ends up online.',
    big: '93',
    cap: 'reviews in a quarter',
    points: ['Code on the reception desk', 'Asked at checkout, not by email', 'Zero one-star reviews published'],
  },
  {
    kind: 'Car workshop',
    thought: 'One angry customer about a part delay sat at the top of my listing for a year.',
    big: '0',
    cap: 'surprise bad reviews since',
    points: ['Complaints arrive by email first', 'Called him back the same afternoon', 'He later left four stars'],
  },
  {
    kind: 'Salon',
    thought: 'My stylists kept forgetting to ask, and I felt rude chasing it.',
    big: '1 in 4',
    cap: 'customers now review',
    points: ['Mirror sticker at each station', 'Nobody has to say anything', 'Rated top three in the area'],
  },
];

export function Who() {
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.from('.case', {
      y: 44,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: E,
      scrollTrigger: { trigger: '.cases', start: 'top 80%' },
    });
  });

  return (
    <section className="who dark" id="who" ref={ref}>
      <div className="wrap">
        <SectionHeader kicker="Who it's for" title={<>If people walk in, this works.</>} light>
          Written from what owners tell us in the first call. Figures are what those businesses reported, not averages
          — yours will depend on how many people walk past the code.
        </SectionHeader>

        <div className="cases">
          {CASES.map((c) => (
            <article className="case" key={c.kind}>
              <small>{c.kind}</small>
              <p className="thought">&ldquo;{c.thought}&rdquo;</p>
              <p className="big">{c.big}</p>
              <p className="cap">{c.cap}</p>
              <ul>
                {c.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * Statement lines
 * ---------------------------------------------------------------- */

const LINES = ['Ask everyone.', 'Hear the truth first.', 'Fix it faster.'];

export function Lines() {
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.utils.toArray('.lr').forEach((el) => {
      gsap.to(el, {
        backgroundPosition: '0 0',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 40%', scrub: true },
      });
    });
  });

  return (
    <section className="lines dark" ref={ref}>
      <div className="wrap">
        {LINES.map((line) => (
          <p className="line" key={line}>
            <span className="lw">
              <em className="lr" style={{ fontFamily: 'var(--sans)', fontStyle: 'normal' }}>
                {line}
              </em>
            </span>
          </p>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * Fit + FAQ
 * ---------------------------------------------------------------- */

const FIT_YES = [
  'You see customers face to face',
  'Your Google rating matters to people choosing you',
  'You would rather hear a complaint than read one',
  'You want this running today, not after a project',
];

const FIT_NO = [
  'You trade only online with no counter — the code has nowhere to live',
  'You need reviews on Zomato, Practo or TripAdvisor as well — we only do Google today',
  'You want us to write or remove reviews — we will not, and nor should anyone',
];

export function Fit() {
  return (
    <section className="fit">
      <div className="wrap">
        <div className="fit-g">
          <h2 className="display">Is this for you?</h2>
          <div>
            <ul className="fitlist">
              {FIT_YES.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {FIT_NO.map((item) => (
                <li className="no" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="faq-g" id="faq">
          <h2 className="display">Questions</h2>
          <div>
            <Faq items={FAQ} />
            <p className="fine" style={{ marginTop: 22 }}>
              Something not covered?{' '}
              <Link className="tlink" to="/blog">
                Read the guides
              </Link>{' '}
              or{' '}
              <a className="tlink" href="#contact">
                send us a message
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * Final CTA
 * ---------------------------------------------------------------- */

export function Final() {
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.from('.final .ln > span', {
      yPercent: 110,
      duration: 1.1,
      stagger: 0.08,
      ease: E,
      scrollTrigger: { trigger: '.final', start: 'top 75%' },
    });
  });

  return (
    <section className="final dark" ref={ref}>
      <div className="wrap">
        <h2 className="display md">
          <span className="ln">
            <span>Your next hundred customers</span>
          </span>
          <span className="ln">
            <span>
              <em>are walking in anyway.</em>
            </span>
          </span>
        </h2>

        <div className="cta center">
          <Pill variant="light lg" to="/register" event="cta_final_start" eventMeta={{ placement: 'final' }}>
            Start for {FIRST_MONTH}
          </Pill>
          <Link className="tlink light" to="/pricing" style={{ color: '#fff' }}>
            See what {MONTHLY} covers
          </Link>
        </div>

        <p className="fine light" style={{ marginTop: 22 }}>
          {FIRST_MONTH} first month · then {MONTHLY}/month · cancel any time
        </p>
      </div>
    </section>
  );
}
