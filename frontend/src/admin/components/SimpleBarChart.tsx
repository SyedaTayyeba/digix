/**
 * Minimal dependency-free horizontal bar chart. The admin spec calls for
 * "Leads by Stage/Source/Over time" charts; rather than pulling in a
 * charting library for three simple breakdowns, this renders proportional
 * bars from plain data — keeps the admin bundle light and fast per the
 * "avoid excessive animations, keep admin UI fast" requirement.
 */
export default function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.length === 0) {
    return <p className="text-xs text-white/40">No data yet.</p>;
  }

  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex justify-between text-xs text-white/60">
            <span>{d.label}</span>
            <span>{d.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
