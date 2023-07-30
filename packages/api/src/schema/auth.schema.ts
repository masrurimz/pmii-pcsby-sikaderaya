import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const tokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
