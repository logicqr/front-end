import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { http } from '../../lib/api';

/**
 * The public review page. This is what a customer sees after scanning the QR
 * code, so it is the most-visited page in the product and the one that has to
 * work on a six-year-old phone on a bad connection.
 *
 * Two changes worth noting:
 *
 *  1. A lapsed subscription used to render a fabricated "404 Page Not Found" to
 *     the business's own walk-in customers. It now says, calmly, that feedback
 *     is paused — and never implies the business does not exist.
 *
 *  2. The flow follows the account's `reviewFlow` setting. On the default
 *     OPEN_INVITE every customer is offered the Google review page *and* a
 *     private box, whatever they rated, because showing Google only to happy
 *     customers is review gating and against Google's policy.
 */

const STAR_LABELS = [
  'Select your rating',
  'Poor — something went wrong',
  'Not great',
  'Okay',
  'Good',
  'Excellent',
];

function Star({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={filled ? 'rv-star on' : 'rv-star'}>
      <path d="M12 2.6l2.95 6.05 6.65.92-4.8 4.62 1.15 6.6L12 17.7l-5.95 3.09 1.15-6.6-4.8-4.62 6.65-.92L12 2.6Z" />
    </svg>
  );
}

function Spinner({ label = 'Working' }) {
  return (
    <span className="rv-spin" role="status" aria-label={label}>
      <span />
    </span>
  );
}

export default function ReviewForm() {
  const { id: userId } = useParams();

  const [page, setPage] = useState({ state: 'loading' });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState('rate');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const commentRef = useRef(null);

  useEffect(() => {
    let live = true;

    http
      .get(`/review/${userId}`)
      .then((data) => {
        if (!live) return;
        setPage({
          state: data.accepting ? 'ready' : 'paused',
          businessName: data.businessName,
          reviewFlow: data.reviewFlow || 'OPEN_INVITE',
          googleReviewUrl: data.googleReviewUrl,
        });
      })
      .catch((err) => {
        if (!live) return;
        setPage({ state: err.status === 404 ? 'unknown' : 'error', message: err.message });
      });

    return () => {
      live = false;
    };
  }, [userId]);

  // Move focus to the comment box when the detail step opens, so a keyboard or
  // screen-reader user is not left at the top of the page.
  useEffect(() => {
    if (step === 'detail') commentRef.current?.focus();
  }, [step]);

  const pickRating = (n) => {
    setRating(n);
    setError('');

    // Four and five stars go straight to Google in every flow. The flows only
    // differ for low ratings, which open the private box.
    if (n >= 4) {
      submit(n, { skipDetail: true });
      return;
    }
    setStep('detail');
  };

  async function submit(ratingValue = rating, { skipDetail = false } = {}) {
    setBusy(true);
    setError('');

    try {
      const data = await http.post(`/review/${userId}`, {
        rating: ratingValue,
        name: skipDetail ? null : name.trim() || null,
        comment: skipDetail ? null : comment.trim() || null,
      });

      if (data.accepting === false) {
        setPage((p) => ({ ...p, state: 'paused' }));
        return;
      }

      // REDIRECT means hand off immediately. OFFER means thank them and show
      // the Google button so they can choose.
      if (data.action === 'REDIRECT' && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      setResult(data);
      setStep('done');
    } catch (err) {
      setError(err.message || 'We could not save that. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const shown = hover || rating;

  /* ---------------------------------------------------------------- states */

  if (page.state === 'loading') {
    return (
      <div className="rv">
        <div className="rv-card rv-skeleton" aria-busy="true">
          <div className="rv-sk rv-sk-title" />
          <div className="rv-sk-stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <div className="rv-sk rv-sk-star" key={i} />
            ))}
          </div>
          <div className="rv-sk rv-sk-line" />
        </div>
      </div>
    );
  }

  if (page.state === 'unknown') {
    return (
      <div className="rv">
        <Helmet>
          <title>Review link not found</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="rv-card rv-center">
          <h1 className="rv-h">This link is not valid</h1>
          <p className="rv-p">
            The code may have been reprinted since, or the address may have a typo in it. If you were trying to leave
            feedback for a business, searching for them on Google works too.
          </p>
        </div>
      </div>
    );
  }

  if (page.state === 'error') {
    return (
      <div className="rv">
        <div className="rv-card rv-center">
          <h1 className="rv-h">We could not load this page</h1>
          <p className="rv-p">{page.message || 'Something went wrong at our end.'}</p>
          <button type="button" className="rv-btn" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (page.state === 'paused') {
    // Deliberately not a 404. These are the business's own customers.
    return (
      <div className="rv">
        <Helmet>
          <title>{page.businessName ? `${page.businessName} — feedback paused` : 'Feedback paused'}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="rv-card rv-center">
          <span className="rv-pausemark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 7h2v10H9V7Zm4 0h2v10h-2V7Z" />
            </svg>
          </span>
          <h1 className="rv-h">
            {page.businessName ? `${page.businessName} is not collecting feedback right now` : 'Feedback is paused'}
          </h1>
          <p className="rv-p">
            Nothing is wrong — the feedback form is just switched off at the moment. If you wanted to say something,
            telling them in person works, and their Google listing is always open.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- done */

  if (step === 'done') {
    const canStillPost = Boolean(result?.redirectUrl);

    return (
      <div className="rv">
        <Helmet>
          <title>Thank you</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        <div className="rv-card rv-center">
          <span className="rv-tick" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>

          <h1 className="rv-h">Thank you</h1>

          <p className="rv-p">
            {result?.stored
              ? `That has gone straight to ${page.businessName || 'the owner'} — not published anywhere. They read these themselves.`
              : 'We appreciate you taking the time.'}
          </p>

          {canStillPost ? (
            <>
              <p className="rv-p rv-dim">
                If you would also like to say it publicly, this opens{' '}
                {page.businessName ? `${page.businessName}'s` : 'their'} Google page.
              </p>
              <a className="rv-btn rv-btn-google" href={result.redirectUrl}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="rv-g">
                  <path
                    fill="#4285F4"
                    d="M22.5 12.2c0-.8-.07-1.4-.2-2H12v3.9h5.9c-.12 1-.76 2.5-2.2 3.5l-.02.13 3.2 2.47.22.02c2-1.9 3.4-4.6 3.4-8Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.9 0 5.3-.95 7.1-2.6l-3.4-2.6c-.9.63-2.1 1.07-3.7 1.07a6 6 0 0 1-5.7-4.1l-.12.01-3.3 2.56-.04.12A11 11 0 0 0 12 23Z"
                  />
                  <path fill="#FBBC05" d="M6.3 14.8A6.6 6.6 0 0 1 5.9 12c0-1 .18-1.9.38-2.8l-.01-.18-3.35-2.6-.1.05A11 11 0 0 0 1.5 12c0 1.8.43 3.4 1.2 4.9l3.6-2.1Z" />
                  <path
                    fill="#EA4335"
                    d="M12 5.9c2 0 3.4.9 4.2 1.6l3-3A10.5 10.5 0 0 0 12 1 11 11 0 0 0 2.7 6.5l3.58 2.8A6 6 0 0 1 12 5.9Z"
                  />
                </svg>
                Post on Google
              </a>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- form */

  return (
    <div className="rv">
      <Helmet>
        <title>{page.businessName ? `Review ${page.businessName}` : 'Leave a review'}</title>
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#F3F2EE" />
      </Helmet>

      <div className="rv-card">
        {step === 'rate' ? (
          <>
            <p className="rv-k">How was it?</p>
            <h1 className="rv-h">{page.businessName}</h1>
            <p className="rv-p rv-dim">Takes about ten seconds.</p>

            <div className="rv-stars" role="radiogroup" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? 's' : ''} — ${STAR_LABELS[n]}`}
                  className="rv-starbtn"
                  disabled={busy}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onFocus={() => setHover(n)}
                  onBlur={() => setHover(0)}
                  onClick={() => pickRating(n)}
                >
                  <Star filled={n <= shown} />
                </button>
              ))}
            </div>

            <p className="rv-ratinglabel" aria-live="polite">
              {busy ? 'One moment…' : STAR_LABELS[shown] || STAR_LABELS[0]}
            </p>

            {error ? (
              <p className="rv-err" role="alert">
                {error}
              </p>
            ) : null}
          </>
        ) : null}

        {step === 'detail' ? (
          <>
            <p className="rv-k">{rating} out of 5</p>
            <h1 className="rv-h">
              {rating >= 4 ? 'Anything you would highlight?' : 'What went wrong?'}
            </h1>
            <p className="rv-p rv-dim">
              {rating >= 4
                ? 'Mentioning what you had helps them more than you would think.'
                : `This goes privately to ${page.businessName || 'the owner'}. It is not published.`}
            </p>

            <label className="rv-label" htmlFor="rv-comment">
              Your feedback
            </label>
            <textarea
              id="rv-comment"
              ref={commentRef}
              className="rv-input rv-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder={
                rating >= 4 ? 'The filter coffee was excellent…' : 'We waited about twenty minutes and…'
              }
            />

            <label className="rv-label" htmlFor="rv-name">
              Your name <span className="rv-opt">optional</span>
            </label>
            <input
              id="rv-name"
              className="rv-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              autoComplete="name"
            />

            {error ? (
              <p className="rv-err" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              className="rv-btn"
              disabled={busy || !comment.trim()}
              onClick={() => submit()}
            >
              {busy ? <Spinner label="Sending" /> : null}
              {busy ? 'Sending' : 'Send feedback'}
            </button>

            {/* On the compliant flows the public option is available here too. */}
            {page.reviewFlow !== 'ROUTED' && page.googleReviewUrl ? (
              <a className="rv-alt" href={page.googleReviewUrl}>
                Or post this on Google instead
              </a>
            ) : null}

            <button
              type="button"
              className="rv-back"
              onClick={() => {
                setStep('rate');
                setError('');
              }}
            >
              Change my rating
            </button>
          </>
        ) : null}
      </div>

      <p className="rv-foot">
        Feedback for {page.businessName} · powered by{' '}
        <a href="https://www.logicqr.com" target="_blank" rel="noreferrer">
          LogicQR
        </a>
      </p>
    </div>
  );
}
