import { Comissariat } from "@my/db/index";
import { Context } from "../context";

const EXPIRES_IN = 60 * 5;

export const getAll = async (
  ctx: Context,
  page: number,
  limit: number
): Promise<any> => {
  let comissariats = await ctx.prisma.comissariat.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  comissariats = await Promise.all(
    comissariats.map(async (comissariat) => {
      if (comissariat.logo) {
        comissariat.logo = await ctx.storage.createSignedUrl(
          comissariat.logo,
          EXPIRES_IN
        );
      }
      return comissariat;
    })
  );
  const total = await ctx.prisma.comissariat.count();
  return {
    data: comissariats,
    total,
  };
};

export const getOne = async (
  ctx: Context,
  id: number
): Promise<Comissariat> => {
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

export const create = async (ctx: Context, data: any): Promise<Comissariat> => {
  const comissariat = await ctx.prisma.comissariat.create({
    data,
  });
  return comissariat;
};

export const update = async (
  ctx: Context,
  id: number,
  data: any
): Promise<Comissariat> => {
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

export const destroy = async (
  ctx: Context,
  id: number
): Promise<Comissariat> => {
  const comissariat = await ctx.prisma.comissariat.delete({
    where: { id },
  });
  if (comissariat.logo) {
    await ctx.storage.deleteFile(comissariat.logo);
  }
  return comissariat;
};
