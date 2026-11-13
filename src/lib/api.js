import axios from 'axios';

/**
 * API client.
 *
 * Changes from the previous version:
 *  - the base URL comes from the environment instead of being hardcoded in
 *    four places (two of them a stale localhost line);
 *  - the refresh interceptor fires on 401, not 403. The server returns 401 for
 *    an expired token and 403 for "you may not do this", so the old code never
 *    refreshed an expired session and pointlessly retried genuine permission
 *    errors;
 *  - concurrent 401s share one refresh instead of each firing their own;
 *  - responses are unwrapped from the `{ ok, data }` envelope, and errors are
 *    normalised to one shape so call sites stop hand-rolling `err.response?.data`.
 */

export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://back-end-ivnr.onrender.com/v1';

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

/* ---------- token storage ---------- */

export const tokens = {
  access: () => sessionStorage.getItem(TOKEN_KEY),
  refresh: () => sessionStorage.getItem(REFRESH_KEY),
  set({ accessToken, refreshToken }) {
    if (accessToken) sessionStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) sessionStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('name');
    // The old logout cleared sessionStorage only, so the previous customer's
    // name, email and phone stayed in localStorage for the next person at the
    // same browser.
    try {
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userNumber');
    } catch {
      /* private mode */
    }
  },
};

/* ---------- error shape ---------- */

export class ApiError extends Error {
  constructor({ status, code, message, details }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details || [];
  }

  /** The message for a specific field, if the server named one. */
  fieldError(field) {
    return this.details.find((d) => d.field === field)?.message;
  }
}

function toApiError(error) {
  if (error instanceof ApiError) return error;

  const res = error.response;
  if (!res) {
    return new ApiError({
      status: 0,
      code: 'NETWORK',
      message: navigator.onLine
        ? 'We could not reach the server. Please try again.'
        : 'You appear to be offline. Check your connection and try again.',
    });
  }

  const payload = res.data?.error || {};
  return new ApiError({
    status: res.status,
    code: payload.code || 'UNKNOWN',
    message: payload.message || 'Something went wrong. Please try again.',
    details: payload.details,
  });
}

/* ---------- instance ---------- */

const api = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((cfg) => {
  const token = tokens.access();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/** Unwrap `{ ok: true, data }` so callers get the payload directly. */
api.interceptors.response.use((res) => {
  if (res.data && typeof res.data === 'object' && 'ok' in res.data) {
    res.data = res.data.data;
  }
  return res;
});

/* ---------- refresh, shared across concurrent failures ---------- */

let refreshing = null;
let onSessionLost = () => {};

/** Lets AuthProvider decide what happens when the session cannot be renewed. */
export const setSessionLostHandler = (fn) => {
  onSessionLost = fn;
};

async function refreshSession() {
  const refreshToken = tokens.refresh();
  if (!refreshToken) throw new Error('no refresh token');

  // A bare axios call: going through `api` would recurse into this interceptor.
  const { data } = await axios.post(
    `${API_URL}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' }, timeout: 20_000 }
  );

  const payload = data?.data || data;
  if (!payload?.token?.accessToken) throw new Error('refresh returned no token');

  tokens.set(payload.token);
  return payload.token.accessToken;
}

api.interceptors.response.use(undefined, async (error) => {
  const original = error.config || {};
  const status = error.response?.status;
  const code = error.response?.data?.error?.code;

  const shouldRefresh =
    status === 401 &&
    code !== 'INVALID_CREDENTIALS' &&
    !original._retried &&
    !String(original.url || '').includes('/auth/refresh') &&
    Boolean(tokens.refresh());

  if (!shouldRefresh) return Promise.reject(toApiError(error));

  original._retried = true;

  try {
    refreshing = refreshing || refreshSession().finally(() => {
      refreshing = null;
    });
    const accessToken = await refreshing;

    original.headers = { ...original.headers, Authorization: `Bearer ${accessToken}` };
    return api(original);
  } catch {
    tokens.clear();
    onSessionLost();
    return Promise.reject(
      new ApiError({ status: 401, code: 'SESSION_EXPIRED', message: 'Your session expired. Please sign in again.' })
    );
  }
});

/* ---------- typed helpers ---------- */

const unwrap = (p) => p.then((r) => r.data).catch((e) => Promise.reject(toApiError(e)));

export const http = {
  get: (url, config) => unwrap(api.get(url, config)),
  post: (url, body, config) => unwrap(api.post(url, body, config)),
  put: (url, body, config) => unwrap(api.put(url, body, config)),
  patch: (url, body, config) => unwrap(api.patch(url, body, config)),
  del: (url, config) => unwrap(api.delete(url, config)),
};

export default api;
