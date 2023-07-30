import { Context } from "../context";
import { PaginationQueryInput } from "../schema/base.schema";
import { CreateRayonInput, UpdateRayonInput } from "../schema/rayon.schema";

export const getAll = async (ctx: Context, filter: PaginationQueryInput) => {
  const { limit, cursor } = filter;
  let items = await ctx.prisma.rayon.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: "asc" },
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
  const rayon = await ctx.prisma.rayon.findFirstOrThrow({
    where: { id },
  });
  if (rayon.logo) {
    rayon.logo = ctx.storage.getPublicUrl(rayon.logo);
  }
  return rayon;
};

export const create = async (ctx: Context, data: CreateRayonInput) => {
  const rayon = await ctx.prisma.rayon.create({
    data,
  });
  return rayon;
};

export const update = async (ctx: Context, data: UpdateRayonInput) => {
  const { id, ...payload } = data;
  const before = await ctx.prisma.rayon.findFirstOrThrow({
    where: { id },
    select: { logo: true },
  });
  const rayon = await ctx.prisma.rayon.update({
    where: { id },
    data: payload,
  });
  if (before.logo && rayon.logo && before.logo !== rayon.logo) {
    await ctx.storage.deleteFile(before.logo);
  }
  return rayon;
};

export const destroy = async (ctx: Context, id: number) => {
  const rayon = await ctx.prisma.rayon.delete({
    where: { id },
  });
  if (rayon.logo) {
    await ctx.storage.deleteFile(rayon.logo);
  }
  return rayon;
};
