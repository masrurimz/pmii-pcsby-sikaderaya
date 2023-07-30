import { z } from "zod";

export const rayonSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const rayonIndexSchema = z.object({
  items: z.array(rayonSchema),
  nextCursor: z.number().optional(),
});

export const createRayonSchema = z.object({
  name: z.string(),
  logo: z.string().nullish(),
  comissariatId: z.number(),
});

export const updateRayonSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().nullish(),
});

export type CreateRayonInput = z.infer<typeof createRayonSchema>;
export type UpdateRayonInput = z.infer<typeof updateRayonSchema>;
