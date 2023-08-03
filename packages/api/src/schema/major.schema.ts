import { z } from "zod";

export const filterMajorSchema = z.object({
  limit: z.number().default(10),
  cursor: z.number().optional(),
  facultyId: z.number().optional(),
});

export const majorSchema = z.object({
  id: z.number(),
  name: z.string(),
  facultyId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const majorIndexSchema = z.object({
  items: z.array(majorSchema),
  nextCursor: z.number().optional(),
});

export const createMajorSchema = z.object({
  name: z.string(),
  facultyId: z.number(),
});

export const updateMajorSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type FilterMajorInput = z.infer<typeof filterMajorSchema>;
export type CreateMajorInput = z.infer<typeof createMajorSchema>;
export type UpdateMajorInput = z.infer<typeof updateMajorSchema>;
