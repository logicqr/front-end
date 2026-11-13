import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/**
 * Private feedback by star rating.
 *
 * The chart this replaces plotted "positive" and "negative" percentages that
 * were not percentages: negative was the mean low rating divided by five (so it
 * *rose* as complaints got milder) and positive was five minus that, with
 * positive reviews never counted. It then drew them on a 0–5 axis labelled as a
 * percentage.
 *
 * This shows what is actually stored — how many pieces of private feedback sit
 * at each rating — and takes the numbers from the dashboard's own response
 * rather than fetching the whole dashboard a second time.
 */
const RATING_COLOUR = { 1: '#FF6A3D', 2: '#FF8F66', 3: '#FFB15C', 4: '#8EE6F2', 5: '#13B8CF' };

export default function ReviewCharts({ stats }) {
  const byRating = stats?.privateFeedback?.byRating ?? [];
  const total = stats?.privateFeedback?.count ?? 0;
  const data = byRating.map((r) => ({ name: `${r.rating}★`, rating: r.rating, count: r.count }));

  return (
    <section
      className="h-[400px] w-full rounded-3xl bg-ink p-6 text-white shadow-card"
      aria-label="Private feedback by rating"
    >
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Private feedback</h3>
          <p className="text-sm text-white/55">What customers told you directly, by rating</p>
        </div>
        <p className="text-right">
          <span className="block text-3xl font-medium tabular-nums">{total}</span>
          <span className="text-xs uppercase tracking-wider text-white/50">in total</span>
        </p>
      </header>

      {total === 0 ? (
        <div className="grid h-[290px] place-items-center text-center">
          <div>
            <p className="font-medium">Nothing here yet</p>
            <p className="mt-1 max-w-[30ch] text-sm text-white/55">
              Private feedback appears the moment a customer leaves some. No news is good news.
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={290}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#fff', fontSize: 12 }} stroke="rgba(255,255,255,.2)" />
            <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,.7)', fontSize: 12 }} stroke="rgba(255,255,255,.2)" />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,.08)' }}
              contentStyle={{ background: '#2A2D33', border: 0, borderRadius: 12, color: '#fff', fontSize: 13 }}
              formatter={(v) => [v, 'Feedback']}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={56}>
              {data.map((d) => (
                <Cell key={d.rating} fill={RATING_COLOUR[d.rating]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
