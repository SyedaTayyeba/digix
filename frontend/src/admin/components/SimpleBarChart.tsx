/**
 * Minimal dependency-free horizontal bar chart.
 *
 * Used for simple admin breakdowns such as:
 * - Leads by Stage
 * - Leads by Source
 * - Leads over Time
 *
 * No external charting library is required.
 */

interface ChartItem {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartItem[];
}

export default function SimpleBarChart({
  data,
}: SimpleBarChartProps) {
  const maxValue = Math.max(
    1,
    ...data.map((item) => item.value)
  );

  if (data.length === 0) {
    return (
      <p className="text-xs text-white/40">
        No data yet.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {data.map((item, index) => {
        const percentage =
          (item.value / maxValue) * 100;

        return (
          <div
            key={`${item.label}-${index}`}
            className="w-full"
          >
            <div className="mb-1 flex items-center justify-between gap-4 text-xs">
              <span className="truncate text-white/60">
                {item.label}
              </span>

              <span className="shrink-0 font-medium text-white/80">
                {item.value}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-brand"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
