import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      select: { id: true, name: true, email: true, setor: true, image: true },
      orderBy: { name: "asc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
        select: { id: true, name: true, email: true, setor: true, image: true },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        setor: z.string().min(1).optional(),
        image: z.string().url().nullable().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.user.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.delete({ where: { id: input.id } });
    }),
});
