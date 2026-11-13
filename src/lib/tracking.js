import { API_URL } from './api';

/**
 * First-party attribution and click tracking.
 *
 * Answers "where did this signup come from" and "how many people pressed the
 * button" without third-party cookies:
 *
 *   visitorId  — a random id in localStorage, so repeat visits group together
 *   sessionId  — a random id in sessionStorage, one per tab session
 *   attribution — the first campaign that brought this visitor, kept for 90 days
 *
 * First-touch is what gets stored, not last-touch: if someone finds a blog post
 * through Google, leaves, and comes back a week later by typing the address,
 * the signup is still credited to organic search rather than to "direct".
 *
 * Reporting on all of this is admin-only — the API routes behind it sit under
 * /admin/analytics and require an ADMIN token. Nothing here reads anything
 * back; it only writes.
 */

const VISITOR_KEY = 'lq_vid';
const SESSION_KEY = 'lq_sid';
const ATTR_KEY = 'lq_attr';
const SEEN_KEY = 'lq_seen';
const ATTR_TTL_DAYS = 90;

const newId = () =>
  (crypto.randomUUID?.() || `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`).replace(/-/g, '');

/** localStorage throws in some private modes; never let that break the page. */
const safe = {
  get(store, key) {
    try {
      return window[store].getItem(key);
    } catch {
      return null;
    }
  },
  set(store, key, value) {
    try {
      window[store].setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
};

/* ---------- identity ---------- */

let memoryVisitorId = null;

export function visitorId() {
  let id = safe.get('localStorage', VISITOR_KEY);
  if (!id) {
    id = memoryVisitorId || newId();
    memoryVisitorId = id;
    safe.set('localStorage', VISITOR_KEY, id);
  }
  return id;
}

export function sessionId() {
  let id = safe.get('sessionStorage', SESSION_KEY);
  if (!id) {
    id = newId();
    safe.set('sessionStorage', SESSION_KEY, id);
  }
  return id;
}

const isNewVisitor = () => {
  const seen = safe.get('localStorage', SEEN_KEY);
  if (!seen) {
    safe.set('localStorage', SEEN_KEY, String(Date.now()));
    return true;
  }
  return false;
};

/* ---------- attribution ---------- */

const UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content'];

function readUtmFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};

  for (const key of UTM_KEYS) {
    const value = params.get(`utm_${key}`);
    if (value) utm[key] = value.slice(0, 120);
  }
  // Ad platform click ids, which identify paid traffic even with no utm tags.
  for (const key of ['gclid', 'msclkid', 'fbclid']) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  }
  // A plain ?ref=partner-name, which partners use more readily than utm tags.
  const ref = params.get('ref');
  if (ref && !utm.source) {
    utm.source = ref.slice(0, 120);
    utm.medium = utm.medium || 'referral';
  }

  return utm;
}

/**
 * The stored first-touch attribution, if it has not expired.
 * Read this when submitting a signup or a contact form.
 */
export function storedAttribution() {
  try {
    const raw = safe.get('localStorage', ATTR_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const ageDays = (Date.now() - (parsed.at || 0)) / 86_400_000;
    if (ageDays > ATTR_TTL_DAYS) return null;

    return parsed;
  } catch {
    return null;
  }
}

function rememberAttribution(utm) {
  const existing = storedAttribution();
  const hasNewCampaign = Boolean(utm.source || utm.gclid || utm.msclkid || utm.fbclid);

  // Keep the first touch. Overwrite only when a genuinely new campaign brings
  // them back — a later untagged visit should not relabel the signup "direct".
  if (existing && !hasNewCampaign) return existing;

  const referrer = document.referrer || '';
  let referrerHost = '';
  try {
    referrerHost = referrer ? new URL(referrer).host : '';
  } catch {
    /* malformed referrer */
  }

  const record = {
    source: utm.source || null,
    medium: utm.medium || null,
    campaign: utm.campaign || null,
    term: utm.term || null,
    content: utm.content || null,
    gclid: utm.gclid || null,
    msclkid: utm.msclkid || null,
    referrer: referrerHost && referrerHost !== window.location.host ? referrer.slice(0, 500) : null,
    landingPage: `${window.location.pathname}${window.location.search}`.slice(0, 300),
    visitorId: visitorId(),
    at: Date.now(),
  };

  safe.set('localStorage', ATTR_KEY, JSON.stringify(record));
  return record;
}

/** The shape the API's `attribution` field expects. */
export function attributionPayload() {
  const a = storedAttribution();
  if (!a) return undefined;

  return {
    source: a.source || undefined,
    medium: a.medium || undefined,
    campaign: a.campaign || undefined,
    term: a.term || undefined,
    content: a.content || undefined,
    referrer: a.referrer || undefined,
    landingPage: a.landingPage || undefined,
    visitorId: a.visitorId || visitorId(),
    gclid: a.gclid || undefined,
    msclkid: a.msclkid || undefined,
  };
}

/* ---------- transport ---------- */

/**
 * `sendBeacon` where available, because a click that navigates away would
 * otherwise cancel an in-flight fetch and lose the event. `keepalive` fetch is
 * the fallback.
 */
function beacon(path, body) {
  const url = `${API_URL}${path}`;
  const json = JSON.stringify(body);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([json], { type: 'application/json' });
      if (navigator.sendBeacon(url, blob)) return;
    }
    fetch(url, {
      method: 'POST',
      body: json,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      mode: 'cors',
    }).catch(() => {});
  } catch {
    /* tracking must never break the page */
  }
}

/* ---------- public API ---------- */

let lastPath = null;

/** Called on every marketing route change. */
export function trackPageView(path = window.location.pathname) {
  if (path === lastPath) return;
  lastPath = path;

  const utm = readUtmFromUrl();
  const attr = rememberAttribution(utm);

  beacon('/track/visit', {
    visitorId: visitorId(),
    sessionId: sessionId(),
    path: path.slice(0, 300),
    landingPage: attr.landingPage,
    referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
    isNewVisitor: isNewVisitor(),
    utm: {
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      term: utm.term,
      content: utm.content,
      gclid: utm.gclid,
      msclkid: utm.msclkid,
    },
  });
}

/**
 * Records a named interaction.
 * Names are namespaced so the admin report can group them:
 *   cta_*      — a call to action was pressed
 *   pricing_*  — something happened on the pricing page
 *   blog_*     — a post was read
 *   signup_*   — a step in the signup funnel
 */
export function trackClick(name, meta) {
  if (!/^[a-z0-9_]{3,60}$/.test(name)) {
    if (import.meta.env.DEV) console.warn(`[tracking] bad event name: ${name}`);
    return;
  }

  const attr = storedAttribution();

  beacon('/track/click', {
    name,
    visitorId: visitorId(),
    sessionId: sessionId(),
    path: window.location.pathname.slice(0, 300),
    meta: meta && Object.keys(meta).length ? meta : undefined,
    utm: { source: attr?.source || undefined, campaign: attr?.campaign || undefined },
  });

  // Mirror into GA4 when the gtag snippet is present, so both reports agree.
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, meta || {});
  }
}

/**
 * Fires once when an element has been visible for a moment — used to tell a
 * blog post that was opened from one that was actually read.
 */
export function trackVisible(element, name, meta, { threshold = 0.5, dwellMs = 2000 } = {}) {
  if (!element || typeof IntersectionObserver === 'undefined') return () => {};

  let timer = null;
  let fired = false;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !fired) {
          timer = setTimeout(() => {
            fired = true;
            trackClick(name, meta);
            observer.disconnect();
          }, dwellMs);
        } else if (!entry.isIntersecting && timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
    },
    { threshold }
  );

  observer.observe(element);

  return () => {
    if (timer) clearTimeout(timer);
    observer.disconnect();
  };
}
