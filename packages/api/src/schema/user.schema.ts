import { z } from "zod";

export const roleSchema = z.object({
  role: z.enum([
    "SUPERADMIN",
    "ADMIN_PC",
    "ADMIN_COMISSARIAT",
    "ADMIN_RAYON",
    "MEMBER",
  ]),
  roleDetail: z.number().nullish(),
  roleDetailName: z.string().nullish(),
});

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  roles: z.array(roleSchema),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6),
});

export type User = z.infer<typeof userSchema>;
