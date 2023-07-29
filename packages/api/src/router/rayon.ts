import {
  create,
  destory,
  getAll,
  getOne,
  update,
} from "../services/rayon.service";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { createPagination } from "../utils/pagination";

export const rayonRouter = router({
  index: publicProcedure
    .meta({ openapi: { method: "GET", path: "/rayons" } })
    .input(
      z.object({ page: z.number().default(1), limit: z.number().default(10) })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      var { page, limit } = input;
      const { data, total } = await getAll(ctx, page, limit);
      const pagination = createPagination(page, limit, total);
      return {
        data,
        pagination,
      };
    }),

  show: publicProcedure
    .meta({ openapi: { method: "GET", path: "/rayons/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const rayon = await getOne(ctx, id);
      return {
        data: rayon,
      };
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
      return {
        data: rayon,
      };
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
      return {
        data: rayon,
      };
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/rayons/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const rayon = await destory(ctx, id);
      return {
        data: rayon,
      };
    }),
});
