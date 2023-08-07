import { publicProcedure, router } from "../trpc";
import {
  forgotPassword,
  refreshToken,
  resetPassword,
  signIn,
} from "../services/auth.service";
import {
  forgotPasswordSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  signInSchema,
  tokenSchema,
} from "../schema/auth.schema";
import { z } from "zod";

export const authRouter = router({
  signIn: publicProcedure
    .meta({
      openapi: { method: "POST", path: "/auth/sign-in" },
    })
    .input(signInSchema)
    .output(tokenSchema)
    .query(({ ctx, input }) => {
      return signIn(ctx, input.email, input.password);
    }),

  refreshToken: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth/refresh-token" } })
    .input(refreshTokenSchema)
    .output(tokenSchema)
    .query(({ ctx, input }) => {
      return refreshToken(ctx, input.refreshToken);
    }),

  forgotPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth/forgot-password" } })
    .input(forgotPasswordSchema)
    .output(z.boolean())
    .query(({ ctx, input }) => {
      return forgotPassword(ctx, input.email);
    }),

  resetPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth/reset-password" } })
    .input(resetPasswordSchema)
    .output(z.boolean())
    .query(({ ctx, input }) => {
      return resetPassword(ctx, input.token, input.password);
    }),
});
