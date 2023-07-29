import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  current: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/user/current" } })
    .input(z.void())
    .output(z.any())
    .query(async ({ ctx }) => {
      const { password, ...user } = ctx.user;
      return user
    }),
});