import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthShell, { AuthAside } from '../auth/AuthShell';
import { http } from '../../lib/api';
import { useAuth } from '../../lib/auth';

/**
 * Staff and admin sign-in.
 *
 * Where someone lands after signing in comes from the role the *server*
 * reports, not from a client-side decode of the stored token. The old page read
 * the role out of the response and then `Nav` separately ran `jwtDecode` on the
 * refresh token to build the menu, which meant editing that stored value was
 * enough to be shown the admin interface.
 */
export default function EmployeeLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInEmployee } = useAuth();

  const [mode, setMode] = useState('signin');
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
      const employee = await signInEmployee(form.email.trim().toLowerCase(), form.password);
      const home =
        employee.role === 'ADMIN'
          ? `/admin/dashboard/${employee.employee_id}`
          : `/staff/dashboard/${employee.employee_id}`;
      navigate(location.state?.from || home, { replace: true });
    } catch (err) {
      // A plaintext-era account needs a reset before it can sign in; the server
      // says so with its own code rather than a generic failure.
      if (err.code === 'PASSWORD_MIGRATION_REQUIRED') {
        setError(err.message);
        setMode('request');
        return;
      }
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
      const res = await http.post('/employees/forgot-password', { email: form.email.trim().toLowerCase() });
      setNotice(res.message || 'If that is a team account, a code is on its way.');
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
      const res = await http.post('/employees/reset-password', {
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
      heading="Team access."
      points={['Your referrals and what they are worth', 'Customer support queue', 'Payouts and settlements']}
      note="Accounts are created by an admin. Ask them if you need one."
    />
  );

  return (
    <>
      <Helmet>
        <title>Team sign in — LogicQR</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AuthShell
        title={mode === 'signin' ? 'Team sign in' : mode === 'request' ? 'Reset your password' : 'Enter your code'}
        subtitle={
          mode === 'signin'
            ? 'For LogicQR staff and admins.'
            : mode === 'request'
              ? 'We will email you a 6-digit code.'
              : `Check the inbox for ${form.email || 'your email'}.`
        }
        aside={aside}
        footer={
          mode === 'signin' ? (
            <>
              Looking for the customer sign-in?{' '}
              <a className="auth-link" href="/login">
                That is over here
              </a>
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
              <label htmlFor="el-email">Work email</label>
              <input
                id="el-email"
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
              <label htmlFor="el-password">Password</label>
              <input
                id="el-password"
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
              <label htmlFor="ef-email">Work email</label>
              <input
                id="ef-email"
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
              <label htmlFor="er-otp">6-digit code</label>
              <input
                id="er-otp"
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
              <label htmlFor="er-new">New password</label>
              <input
                id="er-new"
                className="inp"
                type="password"
                autoComplete="new-password"
                value={form.newPassword}
                onChange={set('newPassword')}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="er-confirm">Confirm it</label>
              <input
                id="er-confirm"
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
