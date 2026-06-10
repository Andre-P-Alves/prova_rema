import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';

const userSelect = {
  id: true, name: true, email: true, setor: true, image: true,
} as const;

const updateSchema = z.object({
  description: z.string().min(1).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().nullable().optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  userId: z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const task = await db.task.findUnique({
    where: { id },
    include: { user: { select: userSelect } },
  });
  if (!task) return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
  return NextResponse.json(task);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = updateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const exists = await db.task.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });

  const { startTime, endTime, ...rest } = result.data;
  const task = await db.task.update({
    where: { id },
    data: {
      ...rest,
      ...(startTime && { startTime: new Date(startTime) }),
      ...(endTime !== undefined && { endTime: endTime ? new Date(endTime) : null }),
    },
    include: { user: { select: userSelect } },
  });
  return NextResponse.json(task);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const exists = await db.task.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
  await db.task.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
