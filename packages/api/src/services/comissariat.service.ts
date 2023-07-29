import { Comissariat } from "@my/db/index";
import { Context } from "../context";

const EXPIRES_IN = 60 * 5;

export const getAll = async (
  ctx: Context,
  page: number,
  limit: number
): Promise<any> => {
  var comissariats = await ctx.prisma.comissariat.findMany({
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
  const comissariatBefore = await ctx.prisma.comissariat.findFirstOrThrow({
    where: { id },
    select: { logo: true },
  });
  const comissariat = await ctx.prisma.comissariat.update({
    where: { id },
    data,
  });
  if (comissariatBefore.logo && data.logo) {
    await ctx.storage.deleteFile(comissariatBefore.logo);
  }
  return comissariat;
};

export const destory = async (
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
