'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { SECTOR_COLORS } from '@/lib/metricsUtils';

interface CompletedOverTimeChartProps {
  data: Record<string, string | number>[];
  sectors: string[];
}

export function CompletedOverTimeChart({ data, sectors }: CompletedOverTimeChartProps) {
  if (data.length === 0 || sectors.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 text-gray-300 text-sm">
        Sem dados disponíveis
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="period" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {sectors.map((setor, i) => (
          <Line
            key={setor}
            type="monotone"
            dataKey={setor}
            stroke={SECTOR_COLORS[i % SECTOR_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
