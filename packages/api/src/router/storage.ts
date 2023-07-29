import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const storageRouter = router({
  uploadSign: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/storage/upload/sign" } })
    .input(z.object({ filename: z.string() }))
    .output(z.object({ data: z.any() }))
    .query(async ({ ctx, input }) => {
      const { filename } = input;
      const data = await ctx.storage.createSignedUploadUrl(filename);
      return { data }
    }),
})
