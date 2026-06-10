import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const userSelect = {
  id: true,
  name: true,
  email: true,
  setor: true,
  image: true,
} as const;

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          userId: z.string().optional(),
          setor: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          status: z.enum(["all", "in_progress", "completed"]).optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          ...(input?.userId && { userId: input.userId }),
          ...(input?.setor && { user: { setor: input.setor } }),
          ...(input?.startDate && { startTime: { gte: input.startDate } }),
          ...(input?.endDate && { startTime: { lte: input.endDate } }),
          ...(input?.status === "in_progress" && { endTime: null }),
          ...(input?.status === "completed" && { endTime: { not: null } }),
        },
        include: { user: { select: userSelect } },
        orderBy: { startTime: "desc" },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.task.findUnique({
        where: { id: input.id },
        include: { user: { select: userSelect } },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        startTime: z.date(),
        endTime: z.date().optional(),
        description: z.string().min(1),
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.task.create({
        data: input,
        include: { user: { select: userSelect } },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        startTime: z.date().optional(),
        endTime: z.date().nullable().optional(),
        description: z.string().min(1).optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.task.update({
        where: { id },
        data,
        include: { user: { select: userSelect } },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.task.delete({ where: { id: input.id } });
    }),
});
