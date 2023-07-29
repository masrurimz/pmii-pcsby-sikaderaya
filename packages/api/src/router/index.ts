import { router } from "../trpc";
import { authRouter } from "./auth";
import { comissariatRouter } from "./comissariat";
import { userRouter } from "./user";

export const appRouter = router({
	user: userRouter,
	auth: authRouter,
  comissariat: comissariatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
