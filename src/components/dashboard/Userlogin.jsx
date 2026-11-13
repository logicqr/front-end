import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthShell, { AuthAside } from '../auth/AuthShell';
import { http } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { FIRST_MONTH } from '../../data/site';

/**
 * Customer sign-in, with the password reset flow in the same page.
 *
 * Sessions now go through the auth provider, which stores the tokens and then
 * asks the server who the caller is. The page no longer writes to
 * sessionStorage itself or decodes a token to work out where to send someone.
 */
export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInCustomer } = useAuth();

  const [mode, setMode] = useState('signin'); // signin | request | reset
  const [form, setForm] = useState({ email: '', password: '', otp: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const signIn = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const user = await signInCustomer(form.email.trim().toLowerCase(), form.password);
      navigate(location.state?.from || `/dashboard/${user.user_id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Email or password is incorrect.');
    } finally {
      setBusy(false);
    }
  };

  const requestCode = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const res = await http.post('/auth/forgot-password', { email: form.email.trim().toLowerCase() });
      setNotice(res.message || 'If that email has an account, a code is on its way.');
      setMode('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirm) {
      setError('Those two passwords do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }

    setBusy(true);
    try {
      const res = await http.post('/auth/reset-password', {
        email: form.email.trim().toLowerCase(),
        otp: form.otp.trim(),
        newPassword: form.newPassword,
      });
      setNotice(res.message || 'Password updated. Sign in with your new password.');
      setMode('signin');
      setForm((f) => ({ ...f, password: '', otp: '', newPassword: '', confirm: '' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const aside = (
    <AuthAside
      heading="Your feedback, in one place."
      points={[
        'Every private note your customers leave',
        'Your QR code, ready to print',
        'What went to Google and what did not',
      ]}
      note={`New here? Your first month is ${FIRST_MONTH}.`}
    />
  );

  return (
    <>
      <Helmet>
        <title>Sign in — LogicQR</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AuthShell
        title={
          mode === 'signin' ? 'Sign in' : mode === 'request' ? 'Reset your password' : 'Enter your code'
        }
        subtitle={
          mode === 'signin'
            ? 'For businesses collecting reviews with LogicQR.'
            : mode === 'request'
              ? 'We will email you a 6-digit code.'
              : `Check the inbox for ${form.email || 'your email'}, including spam.`
        }
        aside={aside}
        footer={
          mode === 'signin' ? (
            <>
              No account yet?{' '}
              <Link className="auth-link" to="/register">
                Start for {FIRST_MONTH}
              </Link>
            </>
          ) : (
            <button
              type="button"
              className="auth-textbtn"
              onClick={() => {
                setMode('signin');
                setError('');
                setNotice('');
              }}
            >
              Back to sign in
            </button>
          )
        }
      >
        {notice ? (
          <p className="notice good" role="status">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="notice bad" role="alert">
            {error}
          </p>
        ) : null}

        {mode === 'signin' ? (
          <form onSubmit={signIn} noValidate>
            <div className="field">
              <label htmlFor="li-email">Email</label>
              <input
                id="li-email"
                className="inp"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="li-password">Password</label>
              <input
                id="li-password"
                className="inp"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={set('password')}
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>

            <button
              type="button"
              className="auth-textbtn"
              onClick={() => {
                setMode('request');
                setError('');
                setNotice('');
              }}
            >
              Forgotten your password?
            </button>
          </form>
        ) : null}

        {mode === 'request' ? (
          <form onSubmit={requestCode} noValidate>
            <div className="field">
              <label htmlFor="fp-email">Email</label>
              <input
                id="fp-email"
                className="inp"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send me a code'}
            </button>
          </form>
        ) : null}

        {mode === 'reset' ? (
          <form onSubmit={resetPassword} noValidate>
            <div className="field">
              <label htmlFor="rp-otp">6-digit code</label>
              <input
                id="rp-otp"
                className="inp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={form.otp}
                onChange={set('otp')}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="rp-new">New password</label>
              <input
                id="rp-new"
                className="inp"
                type="password"
                autoComplete="new-password"
                value={form.newPassword}
                onChange={set('newPassword')}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="rp-confirm">Confirm it</label>
              <input
                id="rp-confirm"
                className="inp"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={set('confirm')}
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? 'Saving…' : 'Set new password'}
            </button>
          </form>
        ) : null}
      </AuthShell>
    </>
  );
}
