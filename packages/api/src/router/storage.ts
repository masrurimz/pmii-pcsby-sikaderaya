import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const storageRouter = router({
  upload: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/storage/upload/{wildcard}" } })
    .input(z.object({ wildcard: z.string() }))
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const { wildcard } = input;
      return wildcard
    }),

  uploadSign: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/storage/upload/sign" } })
    .input(z.object({ filename: z.string() }))
    .output(z.object({ token: z.string(), path: z.string(), signedUrl: z.string() }))
    .query(async ({ ctx, input }) => {
      const { filename } = input;
      const result = await ctx.storage.createSignedUploadUrl(filename);
      return result;
    }),
})
