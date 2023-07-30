import { paginationQuery } from "../schema/base.schema";
import {
  createRayonSchema,
  rayonIndexSchema,
  rayonSchema,
  updateRayonSchema,
} from "../schema/rayon.schema";
import { getById } from "../services/comissariat.service";
import { create, destroy, getAll, update } from "../services/rayon.service";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const rayonRouter = router({
  index: publicProcedure
    .meta({ openapi: { method: "GET", path: "/rayons" } })
    .input(paginationQuery)
    .output(rayonIndexSchema)
    .query(async ({ ctx, input }) => {
      const result = await getAll(ctx, input);
      return result;
    }),

  getById: publicProcedure
    .meta({ openapi: { method: "GET", path: "/rayons/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(rayonSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await getById(ctx, id);
      return item;
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/rayons" } })
    .input(createRayonSchema)
    .output(rayonSchema)
    .query(async ({ ctx, input }) => {
      const item = await create(ctx, input);
      return item;
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/rayons/{id}" } })
    .input(updateRayonSchema)
    .output(rayonSchema)
    .query(async ({ ctx, input }) => {
      const item = await update(ctx, input);
      return item;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/rayons/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(rayonSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await destroy(ctx, id);
      return item;
    }),
});
