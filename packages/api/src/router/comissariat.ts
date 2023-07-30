import { paginationQuery } from "../schema/base.schema";
import {
  comissariatIndexSchema,
  comissariatSchema,
  createComissariatSchema,
  updateComissariatSchema,
} from "../schema/comissariat.schema";
import {
  create,
  destroy,
  getAll,
  getById,
  update,
} from "../services/comissariat.service";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const comissariatRouter = router({
  index: publicProcedure
    .meta({ openapi: { method: "GET", path: "/comissariats" } })
    .input(paginationQuery)
    .output(comissariatIndexSchema)
    .query(async ({ ctx, input }) => {
      const { items, nextCursor } = await getAll(ctx, input);
      return {
        items,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .meta({ openapi: { method: "GET", path: "/comissariats/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(comissariatSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await getById(ctx, id);
      return item;
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/comissariats" } })
    .input(createComissariatSchema)
    .output(comissariatSchema)
    .query(async ({ ctx, input }) => {
      const item = await create(ctx, input);
      return item;
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/comissariats/{id}" } })
    .input(updateComissariatSchema)
    .output(comissariatSchema)
    .query(async ({ ctx, input }) => {
      const item = await update(ctx, input);
      return item;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/comissariats/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(comissariatSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await destroy(ctx, id);
      return item;
    }),
});
