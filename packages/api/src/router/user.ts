import { z } from "zod";
import { userSchema } from "../schema/auth.schema";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  current: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/user/current" } })
    .input(z.void())
    .output(userSchema)
    .query(async ({ ctx }) => {
      return ctx.user;
    }),
});
