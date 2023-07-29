import {
  create,
  destroy,
  getAll,
  getOne,
  update,
} from "../services/comissariat.service";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { createPagination } from "../utils/pagination";

export const comissariatRouter = router({
  index: publicProcedure
    .meta({ openapi: { method: "GET", path: "/comissariats" } })
    .input(
      z.object({ page: z.number().default(1), limit: z.number().default(10) })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const { data, total } = await getAll(ctx, page, limit);
      const pagination = createPagination(page, limit, total);
      return {
        data,
        pagination,
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
