import { z } from "zod";
import { createMajorSchema, filterMajorSchema, majorIndexSchema, majorSchema, updateMajorSchema } from "../schema/major.schema";
import { create, destroy, getAll, getById, update } from "../services/major.service";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const majorRouter = router({
  index: publicProcedure
    .meta({ openapi: { method: "GET", path: "/majors" } })
    .input(filterMajorSchema)
    .output(majorIndexSchema)
    .query(async ({ ctx, input }) => {
      const { items, nextCursor } = await getAll(ctx, input);
      return {
        items,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .meta({ openapi: { method: "GET", path: "/majors/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(majorSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await getById(ctx, id);
      return item;
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/majors" } })
    .input(createMajorSchema)
    .output(majorSchema)
    .query(async ({ ctx, input }) => {
      const item = await create(ctx, input);
      return item;
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/majors/{id}" } })
    .input(updateMajorSchema)
    .output(majorSchema)
    .query(async ({ ctx, input }) => {
      const item = await update(ctx, input);
      return item;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/majors/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(majorSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await destroy(ctx, id);
      return item;
    }),
});
