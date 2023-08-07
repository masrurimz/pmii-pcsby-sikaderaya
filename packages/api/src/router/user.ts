import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { updatePasswordSchema, userSchema } from "../schema/user.schema";
import { updatePassword } from "../services/user.service";

export const userRouter = router({
  current: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/user/current" } })
    .input(z.void())
    .output(userSchema)
    .query(async ({ ctx }) => {
      return ctx.user;
    }),

  updatePassword: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/user/update-password" } })
    .input(updatePasswordSchema)
    .output(z.boolean())
    .query(async ({ ctx, input }) => {
      const result = await updatePassword(
        ctx,
        input.oldPassword,
        input.newPassword
      );
      return result;
    }),
});
