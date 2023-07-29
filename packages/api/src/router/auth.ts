import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { refreshToken, signIn } from "../services/auth.service";

export const authRouter = router({
  signIn: publicProcedure
    .meta({
      openapi: { method: "POST", path: "/auth/sign-in" },
    })
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .output(z.object({ access_token: z.string(), refresh_token: z.string() }))
    .query(({ ctx, input }) => {
      return signIn(ctx, input.email, input.password);
    }),

  refreshToken: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth/refresh-token" } })
    .input(z.object({ refresh_token: z.string() }))
    .output(z.object({ access_token: z.string(), refresh_token: z.string() }))
    .query(({ ctx, input }) => {
      return refreshToken(ctx, input.refresh_token);
    }),
});
