import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const storageRouter = router({
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
