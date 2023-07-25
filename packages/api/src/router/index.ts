import { router } from "../trpc";
import { entryRouter } from "./entry";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { testRouter } from "./test";

export const appRouter = router({
	entry: entryRouter,
	user: userRouter,
	auth: authRouter,
	test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
