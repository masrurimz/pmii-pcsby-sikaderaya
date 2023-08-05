import { router } from "../trpc";
import { authRouter } from "./auth";
import { comissariatRouter } from "./comissariat";
import { facultyRouter } from "./faculty";
import { majorRouter } from "./major";
import { rayonRouter } from "./rayon";
import { storageRouter } from "./storage";
import { universityRouter } from "./university";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  comissariat: comissariatRouter,
  rayon: rayonRouter,
  storage: storageRouter,
  university: universityRouter,
  faculty: facultyRouter,
  major: majorRouter,
});

export type AppRouter = typeof appRouter;
