import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CardStats } from '../types';

interface StatsChartProps {
  stats: CardStats;
  color?: string;
}

const StatsChart: React.FC<StatsChartProps> = ({ stats, color = "#8884d8" }) => {
  const data = [
    { subject: 'Power', A: stats.power, fullMark: 100 },
    { subject: 'Vibe', A: stats.vibe, fullMark: 100 },
    { subject: 'Chaos', A: stats.chaos, fullMark: 100 },
    { subject: 'Mystery', A: stats.mystery, fullMark: 100 },
  ];

  return (
    <div className="w-full h-full min-h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;