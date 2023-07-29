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
      const rayon = await getOne(ctx, id);
      return rayon;
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
      const rayon = await create(ctx, input);
      return rayon;
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
      const rayon = await update(ctx, id, rest);
      return rayon;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/rayons/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const rayon = await destroy(ctx, id);
      return rayon;
    }),
});
