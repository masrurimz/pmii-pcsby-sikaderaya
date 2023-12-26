import { Context } from "../context";
import {
  CreateMajorInput,
  FilterMajorInput,
  UpdateMajorInput,
} from "../schema/major.schema";
import { TRPCError } from "@trpc/server";

export const getAll = async (ctx: Context, filter: FilterMajorInput) => {
  const { limit, cursor, facultyId } = filter;
  let condition = {};
  if (facultyId) condition = { ...condition, facultyId };
  let items = await ctx.prisma.major.findMany({
    take: limit + 1,
    where: condition,
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
  const item = await ctx.prisma.major.findFirst({
    where: { id },
  });
  if (!item)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Major not found",
    });

  return item;
};

export const create = async (ctx: Context, data: CreateMajorInput) => {
  const major = await ctx.prisma.major.create({
    data,
  });
  return major;
};

export const update = async (ctx: Context, data: UpdateMajorInput) => {
  const { id, ...payload } = data;
  const before = await ctx.prisma.major.findFirst({
    where: { id },
  });
  if (!before)
    throw new TRPCError({ code: "NOT_FOUND", message: "Major not found" });

  const major = await ctx.prisma.major.update({
    where: { id },
    data: payload,
  });
  return major;
};

export const destroy = async (ctx: Context, id: number) => {
  const before = await ctx.prisma.major.findFirst({
    where: { id },
  });
  if (!before)
    throw new TRPCError({ code: "NOT_FOUND", message: "Major not found" });

  const major = await ctx.prisma.major.delete({
    where: { id },
  });
  return major;
};
