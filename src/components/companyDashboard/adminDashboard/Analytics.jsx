import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { http } from '../../../lib/api';
import { money } from '../../../data/site';

/**
 * Traffic attribution and click tracking.
 *
 * ADMIN only. The API routes behind this all sit under /admin/analytics and
 * require an ADMIN token, so a staff member who reaches this URL sees nothing —
 * the role check is on the server, not just in the menu.
 */

const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
  { days: 365, label: '12 months' },
];

const MEDIUM_LABEL = {
  organic: 'Search',
  cpc: 'Paid ads',
  social: 'Social',
  ai: 'AI assistants',
  referral: 'Other sites',
  email: 'Email',
  none: 'Direct',
  internal: 'Internal',
};

const pct = (n) => (n === null || n === undefined ? '—' : `${n}%`);
const num = (n) => (n ?? 0).toLocaleString('en-IN');

function Tile({ label, value, sub, tone }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/10">
      <p className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-mute">{label}</p>
      <p className={`mt-1 text-3xl font-medium tracking-display tabular-nums ${tone || 'text-ink'}`}>{value}</p>
      {sub ? <p className="mt-1 text-xs leading-snug text-ink-mute">{sub}</p> : null}
    </div>
  );
}

function Panel({ title, note, children, right }) {
  return (
    <section className="rounded-2xl bg-white ring-1 ring-ink/10">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/10 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-ink">{title}</h3>
          {note ? <p className="mt-0.5 text-xs text-ink-mute">{note}</p> : null}
        </div>
        {right}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Table({ head, rows, empty }) {
  if (!rows.length) {
    return <p className="py-6 text-center text-sm text-ink-mute">{empty}</p>;
  }
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h.key}
                scope="col"
                className={`border-b border-ink/10 pb-2 text-[11.5px] font-semibold uppercase tracking-wider text-ink-mute ${
                  h.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-ink/5 last:border-0">
              {head.map((h) => (
                <td
                  key={h.key}
                  className={`py-2.5 ${h.align === 'right' ? 'text-right tabular-nums' : ''} ${
                    h.strong ? 'font-medium text-ink' : 'text-ink-soft'
                  }`}
                >
                  {h.render ? h.render(row) : row[h.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Analytics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const q = { params: { days } };
      const [overview, sources, campaigns, pages, clicks, series] = await Promise.all([
        http.get('/admin/analytics/overview', q),
        http.get('/admin/analytics/sources', q),
        http.get('/admin/analytics/campaigns', q),
        http.get('/admin/analytics/pages', q),
        http.get('/admin/analytics/clicks', q),
        http.get('/admin/analytics/timeseries', q),
      ]);
      setData({ overview, sources, campaigns, pages, clicks, series });
    } catch (err) {
      setError(err.message || 'Could not load analytics.');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const chartData = useMemo(
    () =>
      (data?.series?.rows || []).map((r) => ({
        day: new Date(r.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        Visits: r.visits,
        Visitors: r.visitors,
        Signups: r.signups,
      })),
    [data]
  );

  const ctaClicks = useMemo(
    () => (data?.clicks?.rows || []).filter((r) => r.name.startsWith('cta_')),
    [data]
  );
  const otherClicks = useMemo(
    () => (data?.clicks?.rows || []).filter((r) => !r.name.startsWith('cta_')),
    [data]
  );

  return (
    <div className="min-h-screen bg-paper pb-20 pl-16 pr-4 pt-6 lg:px-8 lg:pl-24">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-mute">Admin only</p>
          <h1 className="mt-1 text-3xl font-medium tracking-display text-ink">Where traffic comes from</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            First-touch attribution from our own tracking — no third-party cookies. A visitor who finds a guide through
            search and signs up a week later is still credited to search, not to &ldquo;direct&rdquo;.
          </p>
        </div>

        <div
          className="flex gap-1 rounded-full bg-white p-1 ring-1 ring-ink/10"
          role="group"
          aria-label="Date range"
        >
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              aria-pressed={days === r.days}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                days === r.days ? 'bg-ink text-white' : 'text-ink-soft hover:bg-paper'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      {error ? (
        <div className="mb-6 rounded-2xl bg-signal-warn-soft px-5 py-4 text-sm text-[#8f2f0c]">
          <p className="font-medium">{error}</p>
          <button type="button" onClick={load} className="mt-2 font-medium underline">
            Try again
          </button>
        </div>
      ) : null}

      {loading && !data ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60 ring-1 ring-ink/5" />
          ))}
        </div>
      ) : null}

      {data ? (
        <>
          {/* Headline */}
          <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Tile
              label="Visits"
              value={num(data.overview.traffic.visits)}
              sub={
                data.overview.traffic.changeVsPreviousPeriod === null
                  ? 'No earlier period to compare'
                  : `${data.overview.traffic.changeVsPreviousPeriod > 0 ? '+' : ''}${
                      data.overview.traffic.changeVsPreviousPeriod
                    }% vs previous ${days} days`
              }
            />
            <Tile
              label="People"
              value={num(data.overview.traffic.visitors)}
              sub={`${num(data.overview.traffic.newVisitors)} new · ${num(
                data.overview.traffic.returningVisitors
              )} returning`}
            />
            <Tile
              label="Signups paid"
              value={num(data.overview.funnel.signupsPaid)}
              sub={`${num(data.overview.funnel.signupsStarted)} started checkout`}
              tone="text-brand-700"
            />
            <Tile
              label="Visit → paid"
              value={pct(data.overview.funnel.visitToPaidRate)}
              sub="Share of visits that became a paying customer"
            />
          </div>

          {/* Funnel */}
          <div className="mb-3">
            <Panel
              title="The funnel"
              note="Each step as a share of the one before it. A big drop tells you which page to work on."
            >
              <ol className="grid gap-3 sm:grid-cols-4">
                {[
                  { label: 'Visits', value: data.overview.funnel.visits, rate: null },
                  {
                    label: 'Pressed a CTA',
                    value: data.overview.funnel.ctaClicks,
                    rate: data.overview.funnel.visitToCtaRate,
                  },
                  {
                    label: 'Started checkout',
                    value: data.overview.funnel.signupsStarted,
                    rate: data.overview.funnel.ctaToStartRate,
                  },
                  {
                    label: 'Paid',
                    value: data.overview.funnel.signupsPaid,
                    rate: data.overview.funnel.startToPaidRate,
                  },
                ].map((step, i) => (
                  <li key={step.label} className="rounded-xl bg-paper p-4">
                    <p className="font-mono text-[11px] text-ink-mute">{String(i + 1).padStart(2, '0')}</p>
                    <p className="mt-1 text-2xl font-medium tabular-nums text-ink">{num(step.value)}</p>
                    <p className="text-sm text-ink-soft">{step.label}</p>
                    {step.rate !== null ? (
                      <p className="mt-2 text-xs font-medium text-brand-700">{pct(step.rate)} of previous step</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </Panel>
          </div>

          {/* Over time */}
          <div className="mb-3">
            <Panel title="Over time" note="Daily visits, unique people and signups.">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#13B8CF" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="#13B8CF" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#121417" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#121417" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(18,20,23,.08)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: '#6F6D67' }}
                      stroke="rgba(18,20,23,.12)"
                      interval="preserveStartEnd"
                      minTickGap={28}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#6F6D67' }} stroke="rgba(18,20,23,.12)" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#fff',
                        border: '1px solid rgba(18,20,23,.1)',
                        borderRadius: 12,
                        fontSize: 13,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Area
                      type="monotone"
                      dataKey="Visits"
                      stroke="#13B8CF"
                      strokeWidth={2}
                      fill="url(#gVisits)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Signups"
                      stroke="#121417"
                      strokeWidth={2}
                      fill="url(#gSignups)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="mb-3 grid gap-3 lg:grid-cols-2">
            {/* Sources */}
            <Panel
              title="Sources"
              note="Where people came from, and how many of them paid."
            >
              <Table
                empty="No visits recorded in this period."
                head={[
                  { key: 'source', label: 'Source', strong: true },
                  {
                    key: 'medium',
                    label: 'Kind',
                    render: (r) => MEDIUM_LABEL[r.medium] || r.medium,
                  },
                  { key: 'visitors', label: 'People', align: 'right', render: (r) => num(r.visitors) },
                  { key: 'signups', label: 'Paid', align: 'right', render: (r) => num(r.signups) },
                  {
                    key: 'conversionRate',
                    label: 'Rate',
                    align: 'right',
                    render: (r) => pct(r.conversionRate),
                  },
                  {
                    key: 'revenuePaise',
                    label: 'Revenue',
                    align: 'right',
                    render: (r) => money(r.revenuePaise),
                  },
                ]}
                rows={data.sources.rows}
              />
            </Panel>

            {/* Landing pages */}
            <Panel
              title="Landing pages"
              note="Which page people arrive on. This is where the guides earn their keep."
            >
              <Table
                empty="No landing pages recorded yet."
                head={[
                  { key: 'landingPage', label: 'Page', strong: true },
                  { key: 'visitors', label: 'People', align: 'right', render: (r) => num(r.visitors) },
                  { key: 'organic', label: 'From search', align: 'right', render: (r) => num(r.organic) },
                ]}
                rows={data.pages.rows}
              />
            </Panel>
          </div>

          <div className="mb-3 grid gap-3 lg:grid-cols-2">
            {/* CTA clicks */}
            <Panel title="Button clicks" note="Every call to action on the site, by name.">
              <Table
                empty="No CTA clicks recorded yet."
                head={[
                  { key: 'name', label: 'Button', strong: true },
                  { key: 'clicks', label: 'Clicks', align: 'right', render: (r) => num(r.clicks) },
                  { key: 'visitors', label: 'People', align: 'right', render: (r) => num(r.visitors) },
                ]}
                rows={ctaClicks}
              />
            </Panel>

            {/* Other events */}
            <Panel title="Other events" note="Guides read, FAQs opened, demo interactions.">
              <Table
                empty="No other events recorded yet."
                head={[
                  { key: 'name', label: 'Event', strong: true },
                  { key: 'clicks', label: 'Count', align: 'right', render: (r) => num(r.clicks) },
                  { key: 'visitors', label: 'People', align: 'right', render: (r) => num(r.visitors) },
                ]}
                rows={otherClicks}
              />
            </Panel>
          </div>

          {/* Campaigns */}
          {data.campaigns.rows.length ? (
            <Panel title="Campaigns" note="Visits carrying a utm_campaign tag or an ad click id.">
              <Table
                empty="No tagged campaigns in this period."
                head={[
                  { key: 'campaign', label: 'Campaign', strong: true },
                  { key: 'source', label: 'Source' },
                  { key: 'visitors', label: 'People', align: 'right', render: (r) => num(r.visitors) },
                  { key: 'paid_clicks', label: 'Ad clicks', align: 'right', render: (r) => num(r.paid_clicks) },
                  { key: 'signups', label: 'Paid', align: 'right', render: (r) => num(r.signups) },
                ]}
                rows={data.campaigns.rows}
              />
            </Panel>
          ) : (
            <Panel title="Campaigns" note="Nothing tagged yet.">
              <div className="rounded-xl bg-brand-50 p-4 text-sm leading-relaxed text-brand-800">
                <p className="font-medium">To track a campaign, tag the link you share.</p>
                <p className="mt-2">
                  Add <code className="font-mono text-[13px]">?utm_source=instagram&amp;utm_campaign=diwali</code> to
                  any URL and it will appear here. Google Ads clicks are picked up automatically from{' '}
                  <code className="font-mono text-[13px]">gclid</code>, so no tagging is needed for those.
                </p>
              </div>
            </Panel>
          )}
        </>
      ) : null}
    </div>
  );
}
