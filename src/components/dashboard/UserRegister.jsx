import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthShell, { AuthAside } from '../auth/AuthShell';
import { http, RAZORPAY_KEY } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { attributionPayload, trackClick } from '../../lib/tracking';
import { PRICING, derivePricing, money, INCLUDED } from '../../data/site';

/**
 * Signup and checkout.
 *
 * The flow, and why it is shaped this way:
 *
 *   1. collect details
 *   2. POST /checkout/subscription — parks the signup, creates the Razorpay
 *      subscription, returns its id
 *   3. Razorpay checkout authorises the mandate and charges the intro month
 *   4. POST /checkout/confirm — the server verifies the signature, creates the
 *      account, and returns a session
 *
 * Step 4 is the important one. The old version showed its success popup from
 * Razorpay's browser callback, which fires on payment rather than on the
 * account existing — so any webhook failure meant money taken, no account, and
 * a customer who had been told it worked. Success here is only claimed once the
 * server confirms the account. If the confirm call cannot complete, the page
 * polls `/checkout/status` instead of guessing.
 */

const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

/** Loads the checkout script on demand rather than on every page of the site. */
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const BUSINESS_TYPES = [
  'Café or coffee shop',
  'Restaurant',
  'Takeaway or cloud kitchen',
  'Bakery or sweet shop',
  'Salon, spa or barber',
  'Dental clinic',
  'Medical clinic or diagnostics',
  'Gym or fitness studio',
  'Car or bike workshop',
  'Retail shop',
  'Hotel or guest house',
  'Tuition or coaching centre',
  'Other service business',
];

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  businessName: '',
  businessType: '',
  placeId: '',
  password: '',
  confirmPassword: '',
  referralCode: '',
};

export default function UserRegister() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { adoptSession } = useAuth();

  const [cycle, setCycle] = useState(params.get('cycle') === 'annual' ? 'annual' : 'monthly');
  const [p, setP] = useState(() => derivePricing());
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState('form'); // form | paying | verifying | waiting | done
  const [account, setAccount] = useState(null);
  const subscriptionIdRef = useRef(null);
  const pollRef = useRef(null);

  /* ---------------------------------------------------- live pricing */
  useEffect(() => {
    let live = true;
    http
      .get('/pricing')
      .then((server) => {
        if (!live) return;
        setP(
          derivePricing({
            ...PRICING,
            firstMonthPaise: server.firstMonthPaise,
            monthlyPaise: server.monthlyPaise,
            annualPaise: server.annualPaise,
            trialDays: server.trialDays,
            annualAvailable: server.annualAvailable,
          })
        );
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => () => clearInterval(pollRef.current), []);

  const set = (field) => (e) => {
    const value = field === 'email' ? e.target.value.toLowerCase() : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    setError('');
  };

  /* ---------------------------------------------------- validation */

  const validateStep = () => {
    const errs = {};

    if (step === 1) {
      if (form.fullName.trim().length < 2) errs.fullName = 'Enter your full name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
      if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number.';
    }

    if (step === 2) {
      if (form.businessName.trim().length < 2) errs.businessName = 'Enter your business name.';
      if (!form.businessType) errs.businessType = 'Pick the closest one.';
      if (form.placeId.trim().length < 5) {
        errs.placeId = 'We need your Google Place ID so reviews reach the right listing.';
      }
    }

    if (step === 3) {
      if (form.password.length < 8) errs.password = 'Use at least 8 characters.';
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Those two do not match.';
      if (!form.referralCode.trim()) errs.referralCode = 'Enter a referral code, or how you found us.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = async () => {
    if (!validateStep()) return;

    // Catch a duplicate email before they reach the payment screen.
    if (step === 1) {
      setBusy(true);
      try {
        await http.post('/usercheck', { email: form.email });
      } catch (err) {
        setBusy(false);
        setError(err.message);
        return;
      }
      setBusy(false);
    }

    if (step === 3) {
      setBusy(true);
      try {
        const res = await http.post('/referral-check', { referralCode: form.referralCode.trim() });
        if (!res.valid) {
          setFieldErrors({ referralCode: 'That code is not valid. Try "google" if you found us by searching.' });
          setBusy(false);
          return;
        }
      } catch (err) {
        setError(err.message);
        setBusy(false);
        return;
      }
      setBusy(false);
    }

    trackClick('signup_step_completed', { step, cycle });
    setStep((s) => s + 1);
  };

  /* ---------------------------------------------------- polling fallback */

  const startPolling = useCallback((subscriptionId) => {
    setPhase('waiting');
    let attempts = 0;

    pollRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const res = await http.get(`/checkout/status/${subscriptionId}`);
        if (res.state === 'READY') {
          clearInterval(pollRef.current);
          setAccount(res.user);
          setPhase('done');
          trackClick('signup_completed_via_poll', { cycle });
        } else if (res.state === 'STALLED' || attempts > 20) {
          clearInterval(pollRef.current);
          setPhase('stalled');
        }
      } catch {
        if (attempts > 20) {
          clearInterval(pollRef.current);
          setPhase('stalled');
        }
      }
    }, 3000);
  }, [cycle]);

  /* ---------------------------------------------------- checkout */

  const pay = async () => {
    setError('');
    setBusy(true);
    trackClick('signup_checkout_opened', { cycle });

    try {
      const ready = await loadRazorpay();
      if (!ready) throw new Error('Could not load the payment window. Check your connection and try again.');

      const start = await http.post('/checkout/subscription', {
        fullName: form.fullName.trim(),
        email: form.email,
        phone: form.phone,
        businessName: form.businessName.trim(),
        businessType: form.businessType,
        placeId: form.placeId.trim(),
        password: form.password,
        referralCode: form.referralCode.trim(),
        cycle,
        attribution: attributionPayload(),
      });

      subscriptionIdRef.current = start.subscriptionId;
      setPhase('paying');

      const rzp = new window.Razorpay({
        key: start.keyId || RAZORPAY_KEY,
        subscription_id: start.subscriptionId,
        name: 'LogicQR',
        description: `${money(p.firstMonthPaise)} first month, then ${
          cycle === 'annual' ? `${money(p.annualPaise)}/year` : `${money(p.monthlyPaise)}/month`
        }`,
        prefill: start.prefill,
        theme: { color: '#13B8CF' },

        handler: async (response) => {
          setPhase('verifying');
          try {
            const confirmed = await http.post('/checkout/confirm', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Signed in as part of the confirm, so no second trip through login.
            await adoptSession({ token: confirmed.token, user: confirmed.user });
            setAccount(confirmed.user);
            setPhase('done');
            trackClick('signup_completed', { cycle });
          } catch (err) {
            // Payment went through but we could not finish here. The webhook is
            // the other path to the same place, so wait for it rather than
            // telling them it worked or that it failed.
            trackClick('signup_confirm_failed', { cycle, code: err.code || 'unknown' });
            setError(err.message);
            startPolling(subscriptionIdRef.current);
          }
        },

        modal: {
          // Closing the window used to leave a stranded signup whose email
          // could never be used again.
          ondismiss: () => {
            setPhase('form');
            setBusy(false);
            trackClick('signup_checkout_dismissed', { cycle });
            setError('Payment window closed — nothing has been charged. You can pick up where you left off.');
          },
        },
      });

      rzp.on('payment.failed', (resp) => {
        setPhase('form');
        setBusy(false);
        setError(resp?.error?.description || 'That payment did not go through. Nothing has been charged.');
        trackClick('signup_payment_failed', { cycle });
      });

      rzp.open();
    } catch (err) {
      setPhase('form');
      setError(err.message || 'Something went wrong starting the payment.');
    } finally {
      setBusy(false);
    }
  };

  /* ---------------------------------------------------- outcome screens */

  if (phase === 'done' && account) {
    return (
      <>
        <Helmet>
          <title>You&apos;re all set — LogicQR</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <AuthShell
          title="You're all set"
          subtitle={`${account.businessName} is ready to start collecting reviews.`}
          aside={
            <AuthAside
              heading="Next: print the code."
              points={[
                'Download the table card from your dashboard',
                'Put it where customers pay',
                'Feedback starts arriving the same day',
              ]}
            />
          }
        >
          <p className="notice good" role="status">
            Payment received. We have emailed your receipt to {account.email}.
          </p>

          <ul className="signup-recap">
            <li>
              <span>Paid today</span>
              <b>{money(p.firstMonthPaise)}</b>
            </li>
            <li>
              <span>Then</span>
              <b>
                {cycle === 'annual'
                  ? `${money(p.annualPaise)}/year`
                  : `${money(p.monthlyPaise)}/month`}
              </b>
            </li>
            <li>
              <span>Your review link</span>
              <b className="signup-mono">/review/{account.user_id}</b>
            </li>
          </ul>

          <button
            type="button"
            className="auth-submit"
            onClick={() => navigate(`/dashboard/${account.user_id}`, { replace: true })}
          >
            Open my dashboard
          </button>
        </AuthShell>
      </>
    );
  }

  if (phase === 'verifying' || phase === 'waiting') {
    return (
      <AuthShell
        title={phase === 'verifying' ? 'Confirming your payment' : 'Setting up your account'}
        subtitle="This takes a few seconds. Please do not close this page."
        aside={<AuthAside heading="Almost there." points={['Payment confirmed', 'Building your dashboard', 'Generating your QR code']} />}
      >
        <div className="signup-wait" role="status" aria-live="polite">
          <span className="signup-spin" />
          <p>
            {phase === 'verifying'
              ? 'Checking the payment with our server.'
              : 'Your payment went through. We are finishing your account now.'}
          </p>
        </div>
      </AuthShell>
    );
  }

  if (phase === 'stalled') {
    return (
      <AuthShell
        title="Your payment went through"
        subtitle="We could not finish building your account automatically."
        aside={<AuthAside heading="We will sort this out." points={['Your payment is safe', 'Nothing is lost', 'Usually fixed within the hour']} />}
      >
        <p className="notice bad">
          Your payment was taken but the account setup did not complete. This is on us, not you — nothing has been
          lost, and no further charge will be made.
        </p>
        <p className="auth-sub" style={{ marginTop: 16 }}>
          Email <strong>thelogicqr@gmail.com</strong> quoting the email address you used ({form.email}) and we will
          have it working shortly. If you would rather not wait, reply-all to your payment receipt and we will see it
          either way.
        </p>
        <Link className="auth-submit" to="/" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          Back to the site
        </Link>
      </AuthShell>
    );
  }

  /* ---------------------------------------------------- form */

  const annual = cycle === 'annual';
  const standing = annual ? `${money(p.annualPerMonthPaise)}/month, billed yearly` : `${money(p.monthlyPaise)}/month`;

  const aside = (
    <AuthAside
      heading={`${money(p.firstMonthPaise)} for your first month.`}
      points={INCLUDED.slice(0, 4)}
      note={`Then ${standing}. Cancel from your dashboard any time — your page stays live until the end of the period you have paid for.`}
    />
  );

  return (
    <>
      <Helmet>
        <title>Start for {money(p.firstMonthPaise)} — LogicQR</title>
        <meta
          name="description"
          content={`Set up your LogicQR review page. ${money(p.firstMonthPaise)} for the first month, then ${standing}.`}
        />
      </Helmet>

      <AuthShell
        title={step === 4 ? 'Confirm and pay' : 'Start collecting reviews'}
        subtitle={
          step === 4
            ? 'One payment now, then it runs by itself.'
            : `Step ${step} of 3 · ${money(p.firstMonthPaise)} for your first month`
        }
        aside={aside}
        footer={
          <>
            Already have an account?{' '}
            <Link className="auth-link" to="/login">
              Sign in
            </Link>
          </>
        }
      >
        <div className="signup-steps" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <span key={n} className={n <= step ? 'on' : undefined} />
          ))}
        </div>

        {error ? (
          <p className="notice bad" role="alert">
            {error}
          </p>
        ) : null}

        {/* ---------------- step 1: you ---------------- */}
        {step === 1 ? (
          <>
            <div className="field">
              <label htmlFor="su-name">Your name</label>
              <input
                id="su-name"
                className="inp"
                value={form.fullName}
                onChange={set('fullName')}
                autoComplete="name"
                aria-invalid={fieldErrors.fullName ? 'true' : undefined}
                required
              />
              {fieldErrors.fullName ? <p className="err">{fieldErrors.fullName}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="su-email">Email</label>
              <input
                id="su-email"
                className="inp"
                type="email"
                inputMode="email"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                aria-invalid={fieldErrors.email ? 'true' : undefined}
                required
              />
              {fieldErrors.email ? <p className="err">{fieldErrors.email}</p> : null}
              <p className="hint">Receipts and feedback alerts go here.</p>
            </div>

            <div className="field">
              <label htmlFor="su-phone">Mobile</label>
              <input
                id="su-phone"
                className="inp"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={form.phone}
                onChange={set('phone')}
                autoComplete="tel-national"
                aria-invalid={fieldErrors.phone ? 'true' : undefined}
                required
              />
              {fieldErrors.phone ? <p className="err">{fieldErrors.phone}</p> : null}
            </div>
          </>
        ) : null}

        {/* ---------------- step 2: business ---------------- */}
        {step === 2 ? (
          <>
            <div className="field">
              <label htmlFor="su-biz">Business name</label>
              <input
                id="su-biz"
                className="inp"
                value={form.businessName}
                onChange={set('businessName')}
                aria-invalid={fieldErrors.businessName ? 'true' : undefined}
                required
              />
              {fieldErrors.businessName ? <p className="err">{fieldErrors.businessName}</p> : null}
              <p className="hint">Exactly as it appears on your Google listing.</p>
            </div>

            <div className="field">
              <label htmlFor="su-type">What kind of business?</label>
              <select
                id="su-type"
                className="inp"
                value={form.businessType}
                onChange={set('businessType')}
                aria-invalid={fieldErrors.businessType ? 'true' : undefined}
                required
              >
                <option value="">Choose one…</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {fieldErrors.businessType ? <p className="err">{fieldErrors.businessType}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="su-place">Google Place ID</label>
              <input
                id="su-place"
                className="inp signup-mono"
                value={form.placeId}
                onChange={set('placeId')}
                placeholder="ChIJ…"
                aria-invalid={fieldErrors.placeId ? 'true' : undefined}
                required
              />
              {fieldErrors.placeId ? <p className="err">{fieldErrors.placeId}</p> : null}
              <p className="hint">
                This is what points reviews at your listing.{' '}
                <a
                  className="auth-link"
                  href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                  target="_blank"
                  rel="noreferrer"
                >
                  Find yours with Google&apos;s tool
                </a>{' '}
                — search your business name and copy the ID it returns. Stuck? Leave it as{' '}
                <code>pending</code> and email us; we will set it for you.
              </p>
            </div>
          </>
        ) : null}

        {/* ---------------- step 3: account ---------------- */}
        {step === 3 ? (
          <>
            <div className="field">
              <label htmlFor="su-pass">Choose a password</label>
              <input
                id="su-pass"
                className="inp"
                type="password"
                value={form.password}
                onChange={set('password')}
                autoComplete="new-password"
                aria-invalid={fieldErrors.password ? 'true' : undefined}
                required
              />
              {fieldErrors.password ? <p className="err">{fieldErrors.password}</p> : null}
              <p className="hint">At least 8 characters.</p>
            </div>

            <div className="field">
              <label htmlFor="su-pass2">Confirm it</label>
              <input
                id="su-pass2"
                className="inp"
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                autoComplete="new-password"
                aria-invalid={fieldErrors.confirmPassword ? 'true' : undefined}
                required
              />
              {fieldErrors.confirmPassword ? <p className="err">{fieldErrors.confirmPassword}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="su-ref">Referral code</label>
              <input
                id="su-ref"
                className="inp"
                value={form.referralCode}
                onChange={set('referralCode')}
                placeholder="WZ26NOV11-4821, or google"
                aria-invalid={fieldErrors.referralCode ? 'true' : undefined}
                required
              />
              {fieldErrors.referralCode ? <p className="err">{fieldErrors.referralCode}</p> : null}
              <p className="hint">
                From whoever introduced you. No code? Enter <code>google</code>, <code>instagram</code> or{' '}
                <code>facebook</code> — whichever is how you found us.
              </p>
            </div>
          </>
        ) : null}

        {/* ---------------- step 4: pay ---------------- */}
        {step === 4 ? (
          <>
            {p.annualAvailable !== false ? (
              <div className="signup-cycle" role="group" aria-label="Billing after the first month">
                <button
                  type="button"
                  aria-pressed={!annual}
                  className={!annual ? 'on' : undefined}
                  onClick={() => {
                    setCycle('monthly');
                    trackClick('signup_cycle_selected', { cycle: 'monthly' });
                  }}
                >
                  <b>{money(p.monthlyPaise)}/month</b>
                  <small>Standard. Cancel any time.</small>
                </button>
                <button
                  type="button"
                  aria-pressed={annual}
                  className={annual ? 'on' : undefined}
                  onClick={() => {
                    setCycle('annual');
                    trackClick('signup_cycle_selected', { cycle: 'annual' });
                  }}
                >
                  <b>{money(p.annualPerMonthPaise)}/month</b>
                  <small>Billed yearly — save {p.annualSavingPercent}%</small>
                </button>
              </div>
            ) : null}

            <ul className="signup-recap">
              <li>
                <span>Today</span>
                <b>{money(p.firstMonthPaise)}</b>
              </li>
              <li>
                <span>From {p.trialDays} days&apos; time</span>
                <b>{annual ? `${money(p.annualPaise)}/year` : `${money(p.monthlyPaise)}/month`}</b>
              </li>
              <li>
                <span>{annual ? 'First 13 months' : 'First 12 months'}</span>
                <b>{money(annual ? p.firstYearAnnualPaise : p.firstYearMonthlyPaise)}</b>
              </li>
            </ul>

            <p className="hint" style={{ marginTop: 14 }}>
              You are setting up an automatic payment, so you will not have to do this again each month. Cancel from
              your dashboard whenever you like — your page keeps working until the end of the period you have paid for.
              By continuing you agree to our{' '}
              <Link className="auth-link" to="/terms-condition">
                terms
              </Link>
              .
            </p>

            <button type="button" className="auth-submit" disabled={busy || phase === 'paying'} onClick={pay}>
              {busy || phase === 'paying' ? 'Opening payment…' : `Pay ${money(p.firstMonthPaise)} and finish`}
            </button>
          </>
        ) : null}

        {/* ---------------- navigation ---------------- */}
        <div className="signup-nav">
          {step > 1 ? (
            <button
              type="button"
              className="signup-back"
              onClick={() => {
                setStep((s) => s - 1);
                setError('');
              }}
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 4 ? (
            <button type="button" className="auth-submit signup-next" disabled={busy} onClick={next}>
              {busy ? 'Checking…' : 'Continue'}
            </button>
          ) : null}
        </div>
      </AuthShell>
    </>
  );
}
