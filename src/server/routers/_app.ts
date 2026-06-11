// Router raiz do tRPC — combina os routers de user e task e exporta o tipo AppRouter para o cliente.
import { createTRPCRouter } from "../trpc";
import { taskRouter } from "./task";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
