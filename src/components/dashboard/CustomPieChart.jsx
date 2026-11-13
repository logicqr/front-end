import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

/**
 * Where scans went: to Google, or into a private note.
 *
 * Ratings of 4–5 are sent to Google and never stored, so the only honest
 * figures are the two counts we do record. The share that became a public
 * review is the headline.
 */
export default function CustomPieChart({ stats }) {
  const toGoogle = stats?.redirectedToGoogle ?? 0;
  const privateCount = stats?.privateFeedback?.count ?? 0;
  const total = toGoogle + privateCount;
  const rate = stats?.captureRate;

  const data =
    total === 0
      ? [{ name: 'No scans yet', value: 1, fill: '#E7E4DD' }]
      : [
          { name: 'Sent to Google', value: toGoogle, fill: '#13B8CF' },
          { name: 'Private feedback', value: privateCount, fill: '#121417' },
        ];

  return (
    <section className="w-full rounded-3xl bg-white p-6 ring-1 ring-ink/10" aria-label="Where scans went">
      <header className="mb-2">
        <h3 className="text-lg font-semibold tracking-tight text-ink">Where scans went</h3>
        <p className="text-sm text-ink-mute">Every rating, split by what happened next</p>
      </header>

      <div className="relative mx-auto h-56 w-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={72} outerRadius={100} paddingAngle={total ? 3 : 0} stroke="none">
              {data.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-4xl font-medium tracking-display tabular-nums text-ink">
              {rate === null || rate === undefined ? '—' : `${rate}%`}
            </p>
            <p className="text-xs text-ink-mute">went to Google</p>
          </div>
        </div>
      </div>

      <ul className="mt-2 grid grid-cols-2 gap-3 text-sm">
        <li className="rounded-xl bg-paper p-3">
          <span className="mb-1 flex items-center gap-2 text-ink-mute">
            <i className="h-2.5 w-2.5 rounded-full bg-brand-500" aria-hidden="true" />
            Sent to Google
          </span>
          <b className="text-xl font-medium tabular-nums text-ink">{toGoogle}</b>
        </li>
        <li className="rounded-xl bg-paper p-3">
          <span className="mb-1 flex items-center gap-2 text-ink-mute">
            <i className="h-2.5 w-2.5 rounded-full bg-ink" aria-hidden="true" />
            Private feedback
          </span>
          <b className="text-xl font-medium tabular-nums text-ink">{privateCount}</b>
        </li>
      </ul>
    </section>
  );
}
