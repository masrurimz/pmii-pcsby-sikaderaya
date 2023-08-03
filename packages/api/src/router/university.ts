import { z } from "zod";
import { filterUniveritySchema, universityIndexSchema, universitySchema } from "../schema/university.schema";
import { create, destroy, getAll, getById, update } from "../services/university.service";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { createComissariatSchema, updateComissariatSchema } from "../schema/comissariat.schema";

export const universityRouter = router({
  index: publicProcedure
    .meta({ openapi: { method: "GET", path: "/universities" } })
    .input(filterUniveritySchema)
    .output(universityIndexSchema)
    .query(async ({ ctx, input }) => {
      const { items, nextCursor } = await getAll(ctx, input);
      return {
        items,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .meta({ openapi: { method: "GET", path: "/universities/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(universitySchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await getById(ctx, id);
      return item;
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/universities" } })
    .input(createComissariatSchema)
    .output(universitySchema)
    .query(async ({ ctx, input }) => {
      const item = await create(ctx, input);
      return item;
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/universities/{id}" } })
    .input(updateComissariatSchema)
    .output(universitySchema)
    .query(async ({ ctx, input }) => {
      const item = await update(ctx, input);
      return item;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/universities/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(universitySchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await destroy(ctx, id);
      return item;
    }),
})
