import {
  create,
  destroy,
  getAll,
  getOne,
  update,
} from "../services/comissariat.service";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const comissariatRouter = router({
  index: publicProcedure
    .meta({ openapi: { method: "GET", path: "/comissariats" } })
    .input(
      z.object({ limit: z.number().default(10), cursor: z.number().optional() })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { items, nextCursor } = await getAll(ctx, limit, cursor);
      return {
        items,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .meta({ openapi: { method: "GET", path: "/comissariats/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const comissariat = await getOne(ctx, id);
      return comissariat;
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/comissariats" } })
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        logo: z.string().optional(),
      })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const comissariat = await create(ctx, input);
      return comissariat;
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/comissariats/{id}" } })
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        address: z.string(),
        logo: z.string().optional(),
      })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const comissariat = await update(ctx, id, data);
      return comissariat;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/comissariats/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const comissariat = await destroy(ctx, id);
      return comissariat;
    }),
});
