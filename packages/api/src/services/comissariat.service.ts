import { Context } from "../context";

const EXPIRES_IN = 60 * 5;

export const getAll = async (
  ctx: Context,
  limit: number,
  cursor: number | undefined
) => {
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
  items = await Promise.all(
    items.map(async (comissariat) => {
      if (comissariat.logo) {
        comissariat.logo = await ctx.storage.createSignedUrl(
          comissariat.logo,
          EXPIRES_IN
        );
      }
      return comissariat;
    })
  );
  return {
    items,
    nextCursor,
  };
};

export const getOne = async (ctx: Context, id: number) => {
  const comissariat = await ctx.prisma.comissariat.findFirstOrThrow({
    where: { id },
    include: { rayons: true },
  });
  if (comissariat.logo) {
    comissariat.logo = await ctx.storage.createSignedUrl(
      comissariat.logo,
      EXPIRES_IN
    );
  }
  return comissariat;
};

export const create = async (ctx: Context, data: any) => {
  const comissariat = await ctx.prisma.comissariat.create({
    data,
  });
  return comissariat;
};

export const update = async (ctx: Context, id: number, data: any) => {
  const before = await ctx.prisma.comissariat.findFirstOrThrow({
    where: { id },
    select: { logo: true },
  });
  const comissariat = await ctx.prisma.comissariat.update({
    where: { id },
    data,
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
