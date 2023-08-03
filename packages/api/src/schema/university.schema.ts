import { z } from "zod";

export const filterUniveritySchema = z.object({
  limit: z.number().default(10),
  cursor: z.number().optional(),
});

export const universitySchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullish(),
  logo: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const universityIndexSchema = z.object({
  items: z.array(universitySchema),
  nextCursor: z.number().optional(),
});

export const createUniversitySchema = z.object({
  name: z.string(),
  address: z.string().nullish(),
  logo: z.string().nullish(),
});

export const updateUniversitySchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullish(),
  logo: z.string().nullish(),
});

export type FilterUniversityInput = z.infer<typeof filterUniveritySchema>;
export type CreateUniversityInput = z.infer<typeof createUniversitySchema>;
export type UpdateUniversityInput = z.infer<typeof updateUniversitySchema>;
