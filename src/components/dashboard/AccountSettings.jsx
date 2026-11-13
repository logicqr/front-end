import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { http, RAZORPAY_KEY } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { money, derivePricing, PRICING } from '../../data/site';

/**
 * Customer account settings: profile, subscription, how reviews are routed, and
 * password.
 *
 * This page is where every promise on the marketing site lands — "cancel in one
 * click", "switch to yearly", "restart any time" all point here, so none of them
 * can be decorative.
 *
 * It replaces a 776-line file that carried a live Razorpay key and the old ₹749
 * one-off renewal, and whose "current password" field was collected and never
 * sent anywhere.
 */

const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

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

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const STATUS = {
  ACTIVE: { label: 'Active', tone: 'bg-signal-live-soft text-signal-live' },
  AUTHENTICATED: { label: 'Starting', tone: 'bg-brand-100 text-brand-800' },
  PENDING: { label: 'Payment retrying', tone: 'bg-pastel-butter text-ink' },
  HALTED: { label: 'Paused', tone: 'bg-signal-warn-soft text-[#8f2f0c]' },
  CANCELLED: { label: 'Cancelled', tone: 'bg-paper text-ink-mute' },
  COMPLETED: { label: 'Ended', tone: 'bg-paper text-ink-mute' },
  EXPIRED: { label: 'Expired', tone: 'bg-paper text-ink-mute' },
};

function Card({ title, note, children }) {
  return (
    <section className="rounded-2xl bg-white ring-1 ring-ink/10">
      <header className="border-b border-ink/10 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
        {note ? <p className="mt-0.5 text-sm text-ink-mute">{note}</p> : null}
      </header>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-ink/5 py-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-sm text-ink-mute">{label}</dt>
      <dd className="text-sm font-medium text-ink sm:text-right">{children}</dd>
    </div>
  );
}

function Notice({ tone = 'info', children }) {
  const cls = {
    info: 'bg-brand-50 text-brand-800',
    good: 'bg-signal-live-soft text-[#15663a]',
    bad: 'bg-signal-warn-soft text-[#8f2f0c]',
  }[tone];
  return (
    <p className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${cls}`} role={tone === 'bad' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, signOut, reload } = useAuth();

  const [sub, setSub] = useState(null);
  const [flow, setFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [msg, setMsg] = useState(null); // { tone, text }
  const [busy, setBusy] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  const p = derivePricing(
    sub?.pricing
      ? {
          ...PRICING,
          firstMonthPaise: sub.pricing.firstMonthPaise,
          monthlyPaise: sub.pricing.monthlyPaise,
          annualPaise: sub.pricing.annualPaise,
          trialDays: sub.pricing.trialDays,
        }
      : PRICING
  );

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const [s, f] = await Promise.all([http.get('/my/subscription'), http.get('/my/review-flow')]);
      setSub(s);
      setFlow(f);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const say = (tone, text) => setMsg({ tone, text });

  /* ---------------------------------------------------- subscription */

  const cancel = async () => {
    setBusy('cancel');
    setMsg(null);
    try {
      const res = await http.post('/my/subscription/cancel');
      say('good', res.message || 'Cancelled. No further charges.');
      setConfirmCancel(false);
      await load();
    } catch (err) {
      say('bad', err.message);
    } finally {
      setBusy('');
    }
  };

  /** Opens Razorpay for a subscription the server created, then confirms it. */
  const authorise = async ({ start, description, confirmPath, success }) => {
    const ready = await loadRazorpay();
    if (!ready) throw new Error('Could not open the payment window. Check your connection and try again.');

    await new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: start.keyId || RAZORPAY_KEY,
        subscription_id: start.subscriptionId,
        name: 'LogicQR',
        description,
        prefill: start.prefill,
        theme: { color: '#13B8CF' },
        handler: async (r) => {
          try {
            // Success is claimed only once the server has verified it — never
            // on the gateway callback alone.
            const done = await http.post(confirmPath, {
              razorpay_payment_id: r.razorpay_payment_id,
              razorpay_subscription_id: r.razorpay_subscription_id,
              razorpay_signature: r.razorpay_signature,
            });
            say('good', done.message || success);
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: { ondismiss: () => reject(Object.assign(new Error('dismissed'), { dismissed: true })) },
      });
      rzp.open();
    });
  };

  const switchToAnnual = async () => {
    setBusy('annual');
    setMsg(null);
    try {
      const start = await http.post('/my/subscription/switch-to-annual');
      if (start.alreadyAnnual) {
        say('info', start.message);
        return;
      }
      await authorise({
        start,
        description: `Yearly plan — ${money(p.annualPaise)}, starting ${fmtDate(start.startsOn)}`,
        confirmPath: '/my/subscription/switch-to-annual/confirm',
        success: 'You are on yearly billing.',
      });
      await load();
    } catch (err) {
      if (!err.dismissed) say('bad', err.message);
    } finally {
      setBusy('');
    }
  };

  const restart = async (cycle) => {
    setBusy(`restart-${cycle}`);
    setMsg(null);
    try {
      const start = await http.post('/my/subscription/restart', { cycle });
      await authorise({
        start,
        description: cycle === 'annual' ? `Yearly plan — ${money(p.annualPaise)}` : `Monthly plan — ${money(p.monthlyPaise)}`,
        confirmPath: '/my/subscription/restart/confirm',
        success: 'Your review page is live again.',
      });
      await Promise.all([load(), reload()]);
    } catch (err) {
      if (!err.dismissed) say('bad', err.message);
    } finally {
      setBusy('');
    }
  };

  /* ---------------------------------------------------- review flow */

  const changeFlow = async (value) => {
    if (value === flow?.reviewFlow) return;
    setBusy('flow');
    setMsg(null);
    try {
      await http.put('/my/review-flow', { reviewFlow: value });
      setFlow((f) => ({ ...f, reviewFlow: value }));
      say('good', 'Saved. The change applies to the next customer who scans.');
    } catch (err) {
      say('bad', err.message);
    } finally {
      setBusy('');
    }
  };

  /* ---------------------------------------------------- password */

  const changePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setMsg(null);

    if (pw.next.length < 8) return setPwError('Use at least 8 characters.');
    if (pw.next !== pw.confirm) return setPwError('Those two passwords do not match.');

    setBusy('password');
    try {
      const res = await http.post('/my/password', { currentPassword: pw.current, newPassword: pw.next });
      say('good', res.message || 'Password updated.');
      // Every session ends on a password change, including this one.
      setTimeout(async () => {
        await signOut();
        navigate('/login', { replace: true });
      }, 1600);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setBusy('');
    }
  };

  /* ---------------------------------------------------- render */

  if (loading) {
    return (
      <div className="min-h-screen bg-paper pt-24" role="status">
        <div className="mx-auto max-w-2xl space-y-3 px-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/70 ring-1 ring-ink/5" />
          ))}
        </div>
      </div>
    );
  }

  const s = sub?.subscription;
  const status = STATUS[s?.status] || STATUS.CANCELLED;
  const isLive = sub?.isActive;
  const cancelled = s && ['CANCELLED', 'COMPLETED', 'EXPIRED'].includes(s.status);
  const monthly = s?.cycle === 'MONTHLY';

  return (
    <div className="min-h-screen bg-paper pb-24 pt-24">
      <Helmet>
        <title>Account settings — LogicQR</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto max-w-2xl space-y-4 px-4">
        <div>
          <h1 className="text-3xl font-medium tracking-display text-ink">Account settings</h1>
          <p className="mt-1 text-sm text-ink-mute">{user?.businessName}</p>
        </div>

        {loadError ? <Notice tone="bad">{loadError}</Notice> : null}
        {msg ? <Notice tone={msg.tone}>{msg.text}</Notice> : null}

        {/* ------------------------------ subscription ------------------------------ */}
        <Card title="Subscription" note="What you pay and when.">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.tone}`}>{status.label}</span>
            {isLive ? (
              <span className="text-sm text-ink-mute">Your review page is live.</span>
            ) : (
              <span className="text-sm text-ink-mute">Your review page is paused.</span>
            )}
          </div>

          <dl>
            <Row label="Plan">
              {s
                ? monthly
                  ? `${money(p.monthlyPaise)} a month`
                  : `${money(p.annualPaise)} a year (${money(p.annualPerMonthPaise)}/month)`
                : '—'}
            </Row>
            <Row label="Started">{fmtDate(sub?.startedOn)}</Row>
            <Row label={cancelled ? 'Live until' : 'Paid until'}>{fmtDate(sub?.activeUntil)}</Row>
            {!cancelled && s?.chargeAt ? <Row label="Next charge">{fmtDate(s.chargeAt)}</Row> : null}
            <Row label="Payments made">{s?.paidCount ?? 0}</Row>
          </dl>

          {/* Pending: reassure, do not alarm. */}
          {s?.status === 'PENDING' ? (
            <div className="mt-4">
              <Notice tone="info">
                The last payment did not go through. Your page is still working and we are retrying over the next few
                days. If your card has expired, updating it avoids any interruption — email us and we will send you a
                link.
              </Notice>
            </div>
          ) : null}

          {/* Yearly offer, to monthly customers. */}
          {sub?.canSwitchToAnnual ? (
            <div className="mt-5 rounded-xl bg-brand-50 p-4">
              <p className="font-medium text-ink">Pay yearly and save {money(p.annualSavingPerYearPaise)}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {money(p.annualPerMonthPaise)} a month instead of {money(p.monthlyPaise)}, billed once a year as{' '}
                {money(p.annualPaise)}. It starts when the period you have already paid for ends, so nothing is
                charged twice.
              </p>
              <button
                type="button"
                onClick={switchToAnnual}
                disabled={Boolean(busy)}
                className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:opacity-50"
              >
                {busy === 'annual' ? 'Opening payment…' : 'Switch to yearly'}
              </button>
            </div>
          ) : null}

          {/* Restart a lapsed or cancelled account. */}
          {!isLive || cancelled ? (
            <div className="mt-5 rounded-xl bg-paper p-4">
              <p className="font-medium text-ink">Bring your page back</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                Your reviews, QR code and link are all still here. Restarting takes a minute and there is no
                introductory month the second time — you start on the standard rate.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => restart('monthly')}
                  disabled={Boolean(busy)}
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:opacity-50"
                >
                  {busy === 'restart-monthly' ? 'Opening payment…' : `${money(p.monthlyPaise)} a month`}
                </button>
                <button
                  type="button"
                  onClick={() => restart('annual')}
                  disabled={Boolean(busy)}
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-ink/15 transition hover:bg-white disabled:opacity-50"
                >
                  {busy === 'restart-annual' ? 'Opening payment…' : `${money(p.annualPaise)} a year`}
                </button>
              </div>
            </div>
          ) : null}

          {/* Cancel */}
          {s && !cancelled ? (
            <div className="mt-6 border-t border-ink/10 pt-5">
              {!confirmCancel ? (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="text-sm text-ink-mute underline underline-offset-4 hover:text-ink"
                >
                  Cancel subscription
                </button>
              ) : (
                <div className="rounded-xl bg-signal-warn-soft p-4">
                  <p className="font-medium text-[#8f2f0c]">Cancel your subscription?</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#8f2f0c]">
                    You will not be charged again. Your review page stays live until {fmtDate(sub?.activeUntil)}, the
                    end of the period you have paid for, and your feedback stays in your dashboard.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={cancel}
                      disabled={Boolean(busy)}
                      className="rounded-full bg-[#8f2f0c] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      {busy === 'cancel' ? 'Cancelling…' : 'Yes, cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(false)}
                      className="rounded-full px-5 py-2.5 text-sm font-medium text-[#8f2f0c] ring-1 ring-[#8f2f0c]/30 transition hover:bg-white/60"
                    >
                      Keep it
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </Card>

        {/* ------------------------------ review flow ------------------------------ */}
        {flow ? (
          <Card
            title="How reviews are routed"
            note="What a customer sees after they scan and rate you."
          >
            <div role="radiogroup" aria-label="Review flow" className="space-y-2">
              {flow.options.map((o) => {
                const selected = flow.reviewFlow === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={busy === 'flow'}
                    onClick={() => changeFlow(o.value)}
                    className={`w-full rounded-xl p-4 text-left transition ${
                      selected ? 'bg-white ring-2 ring-ink' : 'bg-paper ring-1 ring-ink/10 hover:ring-ink/30'
                    }`}
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ink">{o.label}</span>
                      {o.recommended ? (
                        <span className="rounded-full bg-signal-live-soft px-2 py-0.5 text-[11px] font-semibold text-signal-live">
                          Recommended
                        </span>
                      ) : null}
                      {!o.compliant ? (
                        <span className="rounded-full bg-signal-warn-soft px-2 py-0.5 text-[11px] font-semibold text-[#8f2f0c]">
                          Against Google policy
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{o.summary}</span>
                  </button>
                );
              })}
            </div>

            {flow.reviewFlow === 'ROUTED' ? (
              <div className="mt-4">
                <Notice tone="bad">
                  Your page currently shows the Google review option only to customers who rate you 4 or 5. Google
                  prohibits that, and can remove reviews or suspend a listing for it. Switching to Open invite keeps
                  the private feedback and removes the risk.{' '}
                  <Link className="font-medium underline" to="/blog/review-gating-google-policy" target="_blank">
                    What the policy says
                  </Link>
                </Notice>
              </div>
            ) : null}
          </Card>
        ) : null}

        {/* ------------------------------ password ------------------------------ */}
        <Card title="Password" note="Changing it signs you out everywhere.">
          <form onSubmit={changePassword} noValidate className="space-y-4">
            {pwError ? <Notice tone="bad">{pwError}</Notice> : null}

            <div>
              <label htmlFor="pw-current" className="mb-1.5 block text-sm font-medium text-ink-soft">
                Current password
              </label>
              <input
                id="pw-current"
                type="password"
                autoComplete="current-password"
                value={pw.current}
                onChange={(e) => setPw((v) => ({ ...v, current: e.target.value }))}
                className="w-full rounded-xl bg-paper px-4 py-3 text-base text-ink outline-none ring-1 ring-ink/15 transition focus:bg-white focus:ring-2 focus:ring-ink"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pw-next" className="mb-1.5 block text-sm font-medium text-ink-soft">
                  New password
                </label>
                <input
                  id="pw-next"
                  type="password"
                  autoComplete="new-password"
                  value={pw.next}
                  onChange={(e) => setPw((v) => ({ ...v, next: e.target.value }))}
                  className="w-full rounded-xl bg-paper px-4 py-3 text-base text-ink outline-none ring-1 ring-ink/15 transition focus:bg-white focus:ring-2 focus:ring-ink"
                  required
                />
              </div>
              <div>
                <label htmlFor="pw-confirm" className="mb-1.5 block text-sm font-medium text-ink-soft">
                  Confirm it
                </label>
                <input
                  id="pw-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={pw.confirm}
                  onChange={(e) => setPw((v) => ({ ...v, confirm: e.target.value }))}
                  className="w-full rounded-xl bg-paper px-4 py-3 text-base text-ink outline-none ring-1 ring-ink/15 transition focus:bg-white focus:ring-2 focus:ring-ink"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy === 'password' || !pw.current || !pw.next}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:opacity-50"
            >
              {busy === 'password' ? 'Saving…' : 'Change password'}
            </button>
          </form>
        </Card>

        {/* ------------------------------ details ------------------------------ */}
        <Card title="Your details">
          <dl>
            <Row label="Name">{user?.name || '—'}</Row>
            <Row label="Email">{user?.email || '—'}</Row>
            <Row label="Business">{user?.businessName || '—'}</Row>
          </dl>
          <p className="mt-4 text-sm text-ink-mute">
            To change any of these, email{' '}
            <a className="font-medium text-brand-700 underline underline-offset-4" href="mailto:thelogicqr@gmail.com">
              thelogicqr@gmail.com
            </a>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
