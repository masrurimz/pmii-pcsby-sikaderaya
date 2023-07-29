import { router } from "../trpc";
import { authRouter } from "./auth";
import { comissariatRouter } from "./comissariat";
import { rayonRouter } from "./rayon";
import { storageRouter } from "./storage";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  comissariat: comissariatRouter,
  rayon: rayonRouter,
  storage: storageRouter,
});

export type AppRouter = typeof appRouter;
