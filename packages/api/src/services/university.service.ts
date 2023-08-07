import { Context } from "../context";
import {
  CreateUniversityInput,
  FilterUniversityInput,
  UpdateUniversityInput,
} from "../schema/university.schema";
import { TRPCError } from "@trpc/server";

export const getAll = async (ctx: Context, filter: FilterUniversityInput) => {
  const { limit, cursor } = filter;
  let items = await ctx.prisma.university.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: "asc" },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem?.id;
  }

  return {
    items,
    nextCursor,
  };
};

export const getById = async (ctx: Context, id: number) => {
  const item = await ctx.prisma.university.findFirst({
    where: { id },
  });
  if (!item)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "University not found",
    });

  return item;
};

export const create = async (ctx: Context, data: CreateUniversityInput) => {
  const university = await ctx.prisma.university.create({
    data,
  });
  return university;
};

export const update = async (ctx: Context, data: UpdateUniversityInput) => {
  const { id, ...payload } = data;
  const before = await ctx.prisma.university.findFirst({
    where: { id },
  });
  if (!before)
    throw new TRPCError({ code: "NOT_FOUND", message: "University not found" });

  const university = await ctx.prisma.university.update({
    where: { id },
    data: payload,
  });
  if (before.logo && university.logo && before.logo !== university.logo) {
    ctx.storage.deleteFile(before.logo);
  }
  return university;
};

export const destroy = async (ctx: Context, id: number) => {
  const before = await ctx.prisma.university.findFirst({
    where: { id },
  });
  if (!before)
    throw new TRPCError({ code: "NOT_FOUND", message: "University not found" });

  const item = await ctx.prisma.university.delete({
    where: { id },
  });
  return item;
};
