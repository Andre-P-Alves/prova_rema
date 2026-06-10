'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TasksBySetorChart } from './TasksBySetorChart';
import { CompletedOverTimeChart } from './CompletedOverTimeChart';
import { trpc } from '@/lib/trpc/client';
import {
  ChartPeriod, generatePeriods, getPeriodKey, formatDurationMs,
} from '@/lib/metricsUtils';

const PERIOD_OPTIONS: { value: ChartPeriod; label: string }[] = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
];

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  accent: string;
}

function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

export function MetricsLayout() {
  const [period, setPeriod] = useState<ChartPeriod>('monthly');
  const { data: tasks = [] } = trpc.task.getAll.useQuery();

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'COMPLETED' && t.endTime);
    const totalMs = completed.reduce(
      (sum, t) => sum + (t.endTime!.getTime() - t.startTime.getTime()),
      0,
    );
    const avgMs = completed.length > 0 ? totalMs / completed.length : 0;
    return {
      totalTasks: tasks.length,
      completedCount: completed.length,
      inProgressCount: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      totalTime: formatDurationMs(totalMs),
      avgTime: formatDurationMs(avgMs),
    };
  }, [tasks]);

  const tasksBySetor = useMemo(() => {
    const map = new Map<string, { name: string; COMPLETED: number; IN_PROGRESS: number; CANCELLED: number }>();
    for (const task of tasks) {
      const setor = task.user.setor;
      if (!map.has(setor)) {
        map.set(setor, { name: setor, COMPLETED: 0, IN_PROGRESS: 0, CANCELLED: 0 });
      }
      const row = map.get(setor)!;
      row[task.status as 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED']++;
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks]);

  const { completedOverTime, sectors } = useMemo(() => {
    const sectors = [...new Set(tasks.map((t) => t.user.setor))].sort();
    const periods = generatePeriods(period);
    const completed = tasks.filter((t) => t.status === 'COMPLETED' && t.endTime);

    const data = periods.map((p) => {
      const row: Record<string, string | number> = { period: p.label };
      for (const setor of sectors) {
        row[setor] = completed.filter(
          (t) => t.endTime && getPeriodKey(t.endTime, period) === p.key && t.user.setor === setor,
        ).length;
      }
      return row;
    });

    return { completedOverTime: data, sectors };
  }, [tasks, period]);

  return (
    <div className="flex h-screen bg-rema-cream overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rema-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Métricas</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Período do gráfico de linhas:</span>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
              {PERIOD_OPTIONS.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => setPeriod(opt.value)}
                  className={`px-3 py-2 transition-colors whitespace-nowrap ${
                    i > 0 ? 'border-l border-gray-300' : ''
                  } ${
                    period === opt.value
                      ? 'bg-rema-orange text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Consolidado */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Tempo total registrado"
              value={stats.totalTime}
              sub={`${stats.completedCount} tarefas concluídas`}
              accent="text-rema-orange"
            />
            <StatCard
              label="Tempo médio por tarefa"
              value={stats.avgTime}
              sub="média das concluídas"
              accent="text-blue-600"
            />
            <StatCard
              label="Total de tarefas"
              value={String(stats.totalTasks)}
              sub={`${stats.completedCount} concluídas`}
              accent="text-green-600"
            />
            <StatCard
              label="Em andamento"
              value={String(stats.inProgressCount)}
              sub="tarefas abertas agora"
              accent="text-gray-700"
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Tarefas por setor</h3>
                <p className="text-xs text-gray-400 mt-0.5">Total acumulado, separado por status</p>
              </div>
              <TasksBySetorChart data={tasksBySetor} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Tarefas concluídas ao longo do tempo</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Por setor · {PERIOD_OPTIONS.find((o) => o.value === period)?.label}
                </p>
              </div>
              <CompletedOverTimeChart data={completedOverTime} sectors={sectors} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
