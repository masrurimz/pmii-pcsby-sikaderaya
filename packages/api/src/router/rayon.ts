import {
  create,
  destroy,
  getAll,
  getOne,
  update,
} from "../services/rayon.service";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const rayonRouter = router({
  index: publicProcedure
    .meta({ openapi: { method: "GET", path: "/rayons" } })
    .input(
      z.object({ limit: z.number().default(10), cursor: z.number().optional() })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const result = await getAll(ctx, limit, cursor);
      return result;
    }),

  getById: publicProcedure
    .meta({ openapi: { method: "GET", path: "/rayons/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await getOne(ctx, id);
      return item;
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/rayons" } })
    .input(
      z.object({
        name: z.string(),
        logo: z.string().optional(),
        comissariatId: z.number(),
      })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const item = await create(ctx, input);
      return item;
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/rayons/{id}" } })
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        logo: z.string().optional(),
        comissariatId: z.number(),
      })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const item = await update(ctx, id, rest);
      return item;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/rayons/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await destroy(ctx, id);
      return item;
    }),
});
