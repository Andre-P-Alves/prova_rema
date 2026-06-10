'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/metricsUtils';

interface TasksBySetorData {
  name: string;
  COMPLETED: number;
  IN_PROGRESS: number;
  CANCELLED: number;
}

interface TasksBySetorChartProps {
  data: TasksBySetorData[];
}

export function TasksBySetorChart({ data }: TasksBySetorChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 text-gray-300 text-sm">
        Sem dados disponíveis
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => [
            value,
            STATUS_LABELS[name as keyof typeof STATUS_LABELS] ?? (name as string),
          ]}
        />
        <Legend
          formatter={(value) =>
            STATUS_LABELS[value as keyof typeof STATUS_LABELS] ?? value
          }
        />
        <Bar dataKey="COMPLETED" stackId="a" fill={STATUS_COLORS.COMPLETED} radius={[0, 0, 0, 0]} />
        <Bar dataKey="IN_PROGRESS" stackId="a" fill={STATUS_COLORS.IN_PROGRESS} />
        <Bar dataKey="CANCELLED" stackId="a" fill={STATUS_COLORS.CANCELLED} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
