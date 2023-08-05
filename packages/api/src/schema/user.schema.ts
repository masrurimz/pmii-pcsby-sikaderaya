import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email().nullish(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6)
});
