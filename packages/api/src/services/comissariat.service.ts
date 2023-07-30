import { Context } from "../context";
import { PaginationQueryInput } from "../schema/base.schema";
import {
  CreateComissariatInput,
  UpdateComissariatInput,
} from "../schema/comissariat.schema";

export const getAll = async (ctx: Context, filter: PaginationQueryInput) => {
  const { limit, cursor } = filter;
  let items = await ctx.prisma.comissariat.findMany({
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
  const comissariat = await ctx.prisma.comissariat.findFirstOrThrow({
    where: { id },
    include: { rayons: true },
  });
  if (comissariat.logo) {
    comissariat.logo = ctx.storage.getPublicUrl(comissariat.logo);
  }
  return comissariat;
};

export const create = async (ctx: Context, data: CreateComissariatInput) => {
  const comissariat = await ctx.prisma.comissariat.create({
    data,
  });
  return comissariat;
};

export const update = async (ctx: Context, data: UpdateComissariatInput) => {
  const { id, ...payload } = data;
  const before = await ctx.prisma.comissariat.findFirstOrThrow({
    where: { id },
    select: { logo: true },
  });
  const comissariat = await ctx.prisma.comissariat.update({
    where: { id },
    data: payload,
  });
  if (before.logo && data.logo && before.logo !== data.logo) {
    await ctx.storage.deleteFile(before.logo);
  }
  return comissariat;
};

export const destroy = async (ctx: Context, id: number) => {
  const comissariat = await ctx.prisma.comissariat.delete({
    where: { id },
  });
  if (comissariat.logo) {
    await ctx.storage.deleteFile(comissariat.logo);
  }
  return comissariat;
};
