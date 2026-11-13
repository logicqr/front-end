import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { http, tokens, setSessionLostHandler } from './api';

/**
 * Who is signed in, and what they may see.
 *
 * The identity comes from `GET /me`, which the server authorises. The old code
 * read the role by running `jwtDecode` on the refresh token in sessionStorage —
 * which does not verify the signature — and used the result to build the admin
 * menu. Editing that stored value was enough to be shown the admin interface.
 *
 * `<Protected>` gates on the server's answer, and the API refuses anything the
 * role is not entitled to regardless, so a tampered client gets an empty shell.
 */

const AuthContext = createContext(null);

const ANON = { status: 'anonymous', kind: null, user: null, employee: null, role: null };

export function AuthProvider({ children }) {
  const [state, setState] = useState(() =>
    tokens.access() ? { ...ANON, status: 'loading' } : ANON
  );

  const load = useCallback(async () => {
    if (!tokens.access()) {
      setState(ANON);
      return null;
    }
    try {
      const me = await http.get('/me');
      const next = {
        status: 'authenticated',
        kind: me.kind,
        user: me.user || null,
        employee: me.employee || null,
        role: me.employee?.role || null,
      };
      setState(next);
      return next;
    } catch {
      tokens.clear();
      setState(ANON);
      return null;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // The API client calls this when a refresh fails, so one place decides what
  // "signed out" means instead of each interceptor doing `location.href = ...`.
  useEffect(() => {
    setSessionLostHandler(() => {
      tokens.clear();
      setState(ANON);
    });
  }, []);

  const signInCustomer = useCallback(
    async (email, password) => {
      const res = await http.post('/auth/login', { email, password });
      tokens.set(res.token);
      sessionStorage.setItem('id', res.user.user_id);
      await load();
      return res.user;
    },
    [load]
  );

  const signInEmployee = useCallback(
    async (email, password) => {
      const res = await http.post('/employees/login', { email, password });
      tokens.set(res.token);
      sessionStorage.setItem('id', res.employee.employee_id);
      await load();
      return res.employee;
    },
    [load]
  );

  /** Used straight after checkout, where the server returns a session with the account. */
  const adoptSession = useCallback(
    async ({ token, user }) => {
      tokens.set(token);
      if (user?.user_id) sessionStorage.setItem('id', user.user_id);
      return load();
    },
    [load]
  );

  const signOut = useCallback(async () => {
    const refreshToken = tokens.refresh();
    if (refreshToken) {
      // Tell the server to revoke it. Signing out only client-side left the
      // refresh token valid for its full seven days.
      await http.post('/auth/logout', { refreshToken }).catch(() => {});
    }
    tokens.clear();
    setState(ANON);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isLoading: state.status === 'loading',
      isAuthed: state.status === 'authenticated',
      isCustomer: state.kind === 'user',
      isEmployee: state.kind === 'employee',
      isAdmin: state.role === 'ADMIN',
      isStaff: state.role === 'STAFF',
      id: state.user?.user_id || state.employee?.employee_id || null,
      displayName: state.user?.name || state.employee?.employeeName || '',
      signInCustomer,
      signInEmployee,
      adoptSession,
      signOut,
      reload: load,
    }),
    [state, signInCustomer, signInEmployee, adoptSession, signOut, load]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

function AuthPending() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="flex items-center gap-3 text-ink-mute">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
        <span className="text-sm">Checking your session…</span>
      </div>
    </div>
  );
}

/**
 * Route guard.
 *
 *   <Protected kind="user">            — any signed-in customer
 *   <Protected kind="employee">        — staff or admin
 *   <Protected roles={['ADMIN']}>      — admins only
 */
export function Protected({ children, kind, roles }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) return <AuthPending />;

  const loginPath = kind === 'employee' || roles ? '/admin-login' : '/login';

  if (!auth.isAuthed) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (kind && auth.kind !== kind) {
    // A customer who lands on a staff URL, or the reverse.
    return <Navigate to={auth.isCustomer ? `/dashboard/${auth.id}` : '/admin-login'} replace />;
  }

  if (roles && !roles.includes(auth.role)) {
    // Signed in, wrong role. Send them to their own home rather than a dead end.
    return <Navigate to={auth.isStaff ? `/staff/dashboard/${auth.id}` : '/login'} replace />;
  }

  return children;
}
