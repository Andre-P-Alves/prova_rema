import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';

const userSelect = {
  id: true, name: true, email: true, setor: true, image: true,
} as const;

const createSchema = z.object({
  description: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  userId: z.string(),
});

export async function GET() {
  const tasks = await db.task.findMany({
    include: { user: { select: userSelect } },
    orderBy: { startTime: 'desc' },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const result = createSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { startTime, endTime, ...rest } = result.data;
  const task = await db.task.create({
    data: {
      ...rest,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : undefined,
      status: endTime ? 'COMPLETED' : 'IN_PROGRESS',
    },
    include: { user: { select: userSelect } },
  });
  return NextResponse.json(task, { status: 201 });
}
