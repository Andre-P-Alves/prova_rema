import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const userSelect = {
  id: true,
  name: true,
  email: true,
  setor: true,
  image: true,
} as const;

const taskStatus = z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"]);

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure
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
          ...(input?.status === "in_progress" && { status: "IN_PROGRESS" }),
          ...(input?.status === "completed" && { status: "COMPLETED" }),
        },
        include: { user: { select: userSelect } },
        orderBy: { startTime: "desc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.task.findUnique({
        where: { id: input.id },
        include: { user: { select: userSelect } },
      });
    }),

  create: protectedProcedure
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
        data: {
          ...input,
          status: input.endTime ? "COMPLETED" : "IN_PROGRESS",
        },
        include: { user: { select: userSelect } },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: taskStatus.optional(),
        userId: z.string().optional(),
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.task.delete({ where: { id: input.id } });
    }),
});
