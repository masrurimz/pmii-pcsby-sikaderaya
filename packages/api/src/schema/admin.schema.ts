import { z } from "zod";

export const filterAdminSchema = z.object({
  limit: z.number().default(10),
  cursor: z.number().optional(),
  role: z.enum(["SUPERADMIN", "ADMIN_PC", "ADMIN_COMISSARIAT", "ADMIN_RAYON"]).optional(),
});

export const adminSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  roleDetail: z.number().nullish(),
  roleDetailName: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const adminIndexSchema = z.object({
  items: z.array(adminSchema),
  nextCursor: z.number().optional(),
});

export const createAdminSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6).optional(),
  role: z.enum(["SUPERADMIN", "ADMIN_PC", "ADMIN_COMISSARIAT", "ADMIN_RAYON"]),
  roleDetail: z.number().optional(),
}).refine(schema => {
  const roleNeedDetail = ["ADMIN_COMISSARIAT", "ADMIN_RAYON"];
  if (roleNeedDetail.includes(schema.role) && !schema.roleDetail) {
    return false;
  }
  return true;
});

export const updateAdminSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string().min(6).optional(),
  role: z.enum(["SUPERADMIN", "ADMIN_PC", "ADMIN_COMISSARIAT", "ADMIN_RAYON"]),
  roleDetail: z.number().optional(),
}).refine(schema => {
  const roleNeedDetail = ["ADMIN_COMISSARIAT", "ADMIN_RAYON"];
  if (roleNeedDetail.includes(schema.role) && !schema.roleDetail) {
    return false;
  }
  return true;
});

export type FilterAdminInput = z.infer<typeof filterAdminSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type Admin = z.infer<typeof adminSchema>;
