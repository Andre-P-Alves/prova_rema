export type ChartPeriod = 'weekly' | 'monthly' | 'yearly';

export interface PeriodEntry {
  key: string;
  label: string;
}

export const STATUS_COLORS = {
  COMPLETED: '#16a34a',
  IN_PROGRESS: '#C96010',
  CANCELLED: '#9ca3af',
} as const;

export const STATUS_LABELS = {
  COMPLETED: 'Concluída',
  IN_PROGRESS: 'Em andamento',
  CANCELLED: 'Cancelada',
} as const;

export const SECTOR_COLORS = [
  '#C96010', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
];

export function formatDurationMs(ms: number): string {
  if (ms <= 0) return '0m';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function mondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoWeekKey(monday: Date): string {
  const d = new Date(Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function getPeriodKey(date: Date, period: ChartPeriod): string {
  if (period === 'yearly') return String(date.getFullYear());
  if (period === 'monthly') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
  return isoWeekKey(mondayOf(date));
}

export function generatePeriods(period: ChartPeriod): PeriodEntry[] {
  const now = new Date();

  if (period === 'weekly') {
    const seen = new Set<string>();
    const result: PeriodEntry[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const monday = mondayOf(d);
      const key = isoWeekKey(monday);
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          key,
          label: monday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        });
      }
    }
    return result;
  }

  if (period === 'monthly') {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return {
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      };
    });
  }

  return Array.from({ length: 5 }, (_, i) => {
    const year = now.getFullYear() - (4 - i);
    return { key: String(year), label: String(year) };
  });
}
