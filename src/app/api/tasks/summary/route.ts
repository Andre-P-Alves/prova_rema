import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET() {
  const tasks = await db.task.findMany({
    select: { startTime: true, endTime: true, status: true },
  });

  const completed = tasks.filter((t) => t.status === 'COMPLETED' && t.endTime);
  const totalMs = completed.reduce(
    (sum, t) => sum + (t.endTime!.getTime() - t.startTime.getTime()),
    0,
  );
  const avgMs = completed.length > 0 ? Math.round(totalMs / completed.length) : 0;

  const hours = (ms: number) => Math.floor(ms / 3_600_000);
  const minutes = (ms: number) => Math.floor((ms % 3_600_000) / 60_000);
  const fmt = (ms: number) =>
    ms <= 0 ? '0m' : hours(ms) > 0 ? `${hours(ms)}h ${minutes(ms)}m` : `${minutes(ms)}m`;

  return NextResponse.json({
    total: tasks.length,
    byStatus: {
      completed: tasks.filter((t) => t.status === 'COMPLETED').length,
      inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      cancelled: tasks.filter((t) => t.status === 'CANCELLED').length,
    },
    totalRegisteredTimeMs: totalMs,
    totalRegisteredTime: fmt(totalMs),
    avgTimePerTaskMs: avgMs,
    avgTimePerTask: fmt(avgMs),
  });
}
