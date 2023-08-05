import { z } from "zod";

export const filterFacultySchema = z.object({
  limit: z.number().default(10),
  cursor: z.number().optional(),
  universityId: z.number().optional(),
});

export const facultySchema = z.object({
  id: z.number(),
  name: z.string(),
  universityId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const facultyIndexSchema = z.object({
  items: z.array(facultySchema),
  nextCursor: z.number().optional(),
});

export const createFacultySchema = z.object({
  name: z.string(),
  universityId: z.number(),
});

export const updateFacultySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type FilterFacultyInput = z.infer<typeof filterFacultySchema>;
export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
