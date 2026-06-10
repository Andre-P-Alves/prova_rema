import { createTRPCRouter } from "../trpc";
import { taskRouter } from "./task";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
