import { Rayon } from "@my/db/index";
import { Context } from "../context";

const EXPIRES_IN = 60 * 5;

export const getAll = async (
  ctx: Context,
  page: number,
  limit: number
): Promise<any> => {
  var rayons = await ctx.prisma.rayon.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  rayons = await Promise.all(rayons.map(async (rayon) => {
    if (rayon.logo) {
      rayon.logo = await ctx.storage.createSignedUrl(rayon.logo, EXPIRES_IN);
    }
    return rayon;
  }));
  const total = await ctx.prisma.rayon.count();
  return {
    data: rayons,
    total,
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
  const rayonBefore = await ctx.prisma.rayon.findFirstOrThrow({
    where: { id },
    select: { logo: true },
  });
  const rayon = await ctx.prisma.rayon.update({
    where: { id },
    data,
  });
  if (rayonBefore.logo && rayon.logo) {
    await ctx.storage.deleteFile(rayonBefore.logo);
  }
  return rayon;
};

export const destory = async (ctx: Context, id: number): Promise<Rayon> => {
  const rayon = await ctx.prisma.rayon.delete({
    where: { id },
  });
  if (rayon.logo) {
    await ctx.storage.deleteFile(rayon.logo);
  }
  return rayon;
};
