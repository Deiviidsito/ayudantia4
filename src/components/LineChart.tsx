type LineChartProps = {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  unit?: string;
};

export function LineChart({ data, height = 180, color = '#C2410C', unit = '' }: LineChartProps) {
  const width = 500;
  const padding = { top: 20, right: 20, bottom: 35, left: 40 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const maxVal = 5;
  const minVal = 3.5;

  const points = data.map((d, i) => {
    const x = padding.left + (innerWidth / Math.max(data.length - 1, 1)) * i;
    const y = padding.top + innerHeight - ((d.value - minVal) / (maxVal - minVal)) * innerHeight;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;

  const gridLines = [5.0, 4.5, 4.0, 3.5];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: height }}>
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridLines.map((g) => {
        const y = padding.top + innerHeight - ((g - minVal) / (maxVal - minVal)) * innerHeight;
        return (
          <g key={g}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3,3" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#6B7280">
              {g.toFixed(1)}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill="url(#areaGradient)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2.5" />
          <text x={p.x} y={padding.top + innerHeight + 20} textAnchor="middle" fontSize="10" fill="#6B7280">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
