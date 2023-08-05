import { z } from "zod";
import { rayonSchema } from "./rayon.schema";

export const filterComissariatSchema = z.object({
  limit: z.number().default(10),
  cursor: z.number().optional(),
});

export const comissariatSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullish(),
  logo: z.string().nullish(),
  rayons: z.array(rayonSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const comissariatIndexSchema = z.object({
  items: z.array(comissariatSchema),
  nextCursor: z.number().optional(),
});

export const createComissariatSchema = z.object({
  name: z.string(),
  address: z.string().nullish(),
  logo: z.string().nullish(),
});

export const updateComissariatSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullish(),
  logo: z.string().nullish(),
});

export type FilterComissariatInput = z.infer<typeof filterComissariatSchema>;
export type CreateComissariatInput = z.infer<typeof createComissariatSchema>;
export type UpdateComissariatInput = z.infer<typeof updateComissariatSchema>;
