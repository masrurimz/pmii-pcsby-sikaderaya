import { publicProcedure, router } from "../trpc";
import { refreshToken, signIn } from "../services/auth.service";
import {
  refreshTokenSchema,
  signInSchema,
  tokenSchema,
} from "../schema/auth.schema";

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
});
