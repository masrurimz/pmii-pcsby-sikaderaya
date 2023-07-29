import {
  create,
  destory,
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
      z.object({ page: z.number().optional(), limit: z.number().optional() })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      var { page, limit } = input;
      page = page ?? 1;
      limit = limit ?? 10;
      const { data, total } = await getAll(ctx, page, limit);
      const pagination = createPagination(page, limit, total);
      return {
        data,
        pagination,
      };
    }),

  show: publicProcedure
    .meta({ openapi: { method: "GET", path: "/comissariats/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      console.log(id);
      const comissariat = await getOne(ctx, id);
      return {
        data: comissariat,
      };
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/comissariats" } })
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
      })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const comissariat = await create(ctx, input);
      return {
        data: comissariat,
      };
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/comissariats/{id}" } })
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        address: z.string(),
      })
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const comissariat = await update(ctx, id, data);
      return {
        data: comissariat,
      };
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/comissariats/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const comissariat = await destory(ctx, id);
      return {
        data: comissariat,
      };
    }),
});
