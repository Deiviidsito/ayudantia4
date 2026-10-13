type BarChartProps = {
  data: { label: string; value: number; max?: number }[];
  color?: string;
  unit?: string;
};

export function BarChart({ data, color = 'bg-accent-600', unit = '' }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.max ?? d.value));
  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-brand-700 font-medium">{item.label}</span>
            <span className="text-sm text-brand-900 font-semibold tabular-nums">
              {item.value.toFixed(1)}{unit}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-brand-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
