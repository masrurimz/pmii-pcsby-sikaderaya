import { Rayon } from "@my/db/index";
import { Context } from "../context";

const EXPIRES_IN = 60 * 5;

export const getAll = async (
  ctx: Context,
  limit: number,
  cursor: number | undefined
): Promise<any> => {
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
  items = await Promise.all(items.map(async (item) => {
    if (item.logo) {
      item.logo = await ctx.storage.createSignedUrl(item.logo, EXPIRES_IN);
    }
    return item;
  }));
  return {
    items,
    nextCursor,
  };
};

export const getOne = async (ctx: Context, id: number): Promise<Rayon> => {
  const rayon = await ctx.prisma.rayon.findFirstOrThrow({
    where: { id },
  });
  if (rayon.logo) {
    rayon.logo = await ctx.storage.createSignedUrl(rayon.logo, EXPIRES_IN);
  }
  return rayon;
};

export const create = async (ctx: Context, data: any): Promise<Rayon> => {
  const rayon = await ctx.prisma.rayon.create({
    data,
  });
  return rayon;
};

export const update = async (
  ctx: Context,
  id: number,
  data: any
): Promise<Rayon> => {
  const before = await ctx.prisma.rayon.findFirstOrThrow({
    where: { id },
    select: { logo: true },
  });
  const rayon = await ctx.prisma.rayon.update({
    where: { id },
    data,
  });
  if (before.logo && rayon.logo && before.logo !== rayon.logo) {
    await ctx.storage.deleteFile(before.logo);
  }
  return rayon;
};

export const destroy = async (ctx: Context, id: number): Promise<Rayon> => {
  const rayon = await ctx.prisma.rayon.delete({
    where: { id },
  });
  if (rayon.logo) {
    await ctx.storage.deleteFile(rayon.logo);
  }
  return rayon;
};
