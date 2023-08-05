import { Context } from "../context";
import {
  CreateRayonInput,
  FilterRayonInput,
  UpdateRayonInput,
} from "../schema/rayon.schema";
import { TRPCError } from "@trpc/server";

export const getAll = async (ctx: Context, filter: FilterRayonInput) => {
  const { limit, cursor, comissariatId } = filter;
  let condition = {};
  if (comissariatId) {
    condition = { ...condition, comissariatId };
  }

  let items = await ctx.prisma.rayon.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: "asc" },
    where: condition,
  });
  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem?.id;
  }

  items = items.map((item) => {
    if (item.logo) {
      item.logo = ctx.storage.getPublicUrl(item.logo);
    }
    return item;
  });

  return {
    items,
    nextCursor,
  };
};

export const getById = async (ctx: Context, id: number) => {
  const item = await ctx.prisma.rayon.findFirst({
    where: { id },
  });
  if (!item)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Rayon not found",
    });
  if (item.logo) {
    item.logo = ctx.storage.getPublicUrl(item.logo);
  }
  return item;
};

export const create = async (ctx: Context, data: CreateRayonInput) => {
  const rayon = await ctx.prisma.rayon.create({
    data,
  });
  return rayon;
};

export const update = async (ctx: Context, data: UpdateRayonInput) => {
  const { id, ...payload } = data;
  const before = await ctx.prisma.rayon.findFirst({
    where: { id },
    select: { logo: true },
  });
  if (!before)
    throw new TRPCError({ code: "NOT_FOUND", message: "Rayon not found" });
  const item = await ctx.prisma.rayon.update({
    where: { id },
    data: payload,
  });
  if (before.logo && item.logo && before.logo !== item.logo) {
    await ctx.storage.deleteFile(before.logo);
  }
  return item;
};

export const destroy = async (ctx: Context, id: number) => {
  const item = await ctx.prisma.rayon.findFirst({
    where: { id },
  });
  if (!item)
    throw new TRPCError({ code: "NOT_FOUND", message: "Rayon not found" });

  await ctx.prisma.rayon.delete({ where: { id } });
  if (item.logo) await ctx.storage.deleteFile(item.logo);

  return item;
};
