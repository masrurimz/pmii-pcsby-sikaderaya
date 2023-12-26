import { z } from "zod";
import {
  adminIndexSchema,
  adminSchema,
  createAdminSchema,
  filterAdminSchema,
  updateAdminSchema,
} from "../schema/admin.schema";
import {
  create,
  destroy,
  getAll,
  getById,
  update,
} from "../services/admin.service";
import { protectedProcedure, router } from "../trpc";
import { inviteUser } from "../services/user.service";

export const adminRouter = router({
  index: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/admins" } })
    .input(filterAdminSchema)
    .output(adminIndexSchema)
    .query(async ({ ctx, input }) => {
      const { items, nextCursor } = await getAll(ctx, input);
      return {
        items,
        nextCursor,
      };
    }),

  getById: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/admins/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(adminSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await getById(ctx, id);
      return item;
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/admins" } })
    .input(createAdminSchema)
    .output(adminSchema)
    .query(async ({ ctx, input }) => {
      const item = await create(ctx, input);
      return item;
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/admins/{id}" } })
    .input(updateAdminSchema)
    .output(adminSchema)
    .query(async ({ ctx, input }) => {
      const item = await update(ctx, input);
      return item;
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/admins/{id}" } })
    .input(z.object({ id: z.number() }))
    .output(z.boolean())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await destroy(ctx, id);
      return item;
    }),

  invite: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/admins/{id}/invite" } })
    .input(z.object({ id: z.number() }))
    .output(z.boolean())
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const item = await inviteUser(ctx, id);
      return item;
    }),
});
