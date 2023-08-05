import { z } from "zod";
import { createFacultySchema, facultyIndexSchema, facultySchema, filterFacultySchema, updateFacultySchema } from "../schema/faculty.schema";
import { create, destroy, getAll, getById, update } from "../services/faculty.service";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const facultyRouter = router({
  index: publicProcedure
    .meta({ openapi: { method: "GET", path: "/faculties" } })
    .input(filterFacultySchema)
    .output(facultyIndexSchema)
    .query(async ({ ctx, input }) => {
      const { items, nextCursor } = await getAll(ctx, input);
      return {
        items,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .meta({ openapi: { method: "GET", path: "/faculties/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(facultySchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await getById(ctx, id);
      return item;
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/faculties" } })
    .input(createFacultySchema)
    .output(facultySchema)
    .query(async ({ ctx, input }) => {
      const item = await create(ctx, input);
      return item;
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/faculties/{id}" } })
    .input(updateFacultySchema)
    .output(facultySchema)
    .query(async ({ ctx, input }) => {
      const item = await update(ctx, input);
      return item;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/faculties/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(facultySchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await destroy(ctx, id);
      return item;
    }),
});
