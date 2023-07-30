import { TRPCError } from "@trpc/server";
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
  const item = await ctx.prisma.comissariat.findFirst({
    where: { id },
    include: { rayons: true },
  });
  if (!item)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Comissariat not found",
    });

  if (item.logo) item.logo = ctx.storage.getPublicUrl(item.logo);

  return item;
};

export const create = async (ctx: Context, data: CreateComissariatInput) => {
  const comissariat = await ctx.prisma.comissariat.create({
    data,
  });
  return comissariat;
};

export const update = async (ctx: Context, data: UpdateComissariatInput) => {
  const { id, ...payload } = data;
  const before = await ctx.prisma.comissariat.findFirst({
    where: { id },
    select: { logo: true },
  });
  if (!before)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Comissariat not found",
    });

  const item = await ctx.prisma.comissariat.update({
    where: { id },
    data: payload,
  });
  if (before.logo && data.logo && before.logo !== data.logo)
    await ctx.storage.deleteFile(before.logo);

  return item;
};

export const destroy = async (ctx: Context, id: number) => {
  const item = await ctx.prisma.comissariat.findFirst({
    where: { id },
  });
  if (!item)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Comissariat not found",
    });

  await ctx.prisma.comissariat.delete({ where: { id } });
  if (item.logo) await ctx.storage.deleteFile(item.logo);

  return item;
};
