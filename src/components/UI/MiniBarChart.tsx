interface MiniBarChartProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}

export default function MiniBarChart({ data, labels, color = '#3b82f6', height = 80 }: MiniBarChartProps) {
  const max = Math.max(...data, 1);
  const barWidth = 100 / (data.length * 2 - 1);

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        {data.map((value, i) => {
          const barHeight = (value / max) * (height - 10);
          const x = i * barWidth * 2;
          const y = height - barHeight;
          return (
            <g key={i}>
              <rect
                x={`${x}%`}
                y={y}
                width={`${barWidth}%`}
                height={barHeight}
                rx="2"
                fill={color}
                opacity={0.85}
              />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between mt-1">
        {labels.map((label, i) => (
          <span key={i} className="text-xs text-gray-400">{label}</span>
        ))}
      </div>
    </div>
  );
}
