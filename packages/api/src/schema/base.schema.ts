import { z } from "zod";

export const paginationQuery = z.object({
  limit: z.number().default(10),
  cursor: z.number().optional(),
})

export type PaginationQueryInput = z.infer<typeof paginationQuery>;
