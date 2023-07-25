import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const testRouter = router({
	helloByName: publicProcedure
		.meta({ openapi: { method: "GET", path: "/test/helloByName" } })
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.output(z.string())
		.query(({ input }) => {
			return `Hello ${input.name}`;
		}),
	sendMeMessage: publicProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.mutation(({ input }) => {
			return `You sent me ${input.name}`;
		}),
});
