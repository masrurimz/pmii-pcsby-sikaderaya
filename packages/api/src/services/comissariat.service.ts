import { Comissariat } from "@my/db/index";
import { Context } from "../context";

export const getAll = async (ctx: Context, page: number, limit: number): Promise<any> => {
  const comissariats = await ctx.prisma.comissariat.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await ctx.prisma.comissariat.count();
  return {
    data: comissariats,
    total,
  };
};

export const getOne = async (ctx: Context, id: number): Promise<Comissariat> => {
  const comissariat = await ctx.prisma.comissariat.findFirstOrThrow({
    where: { id },
  })
  return comissariat;
};

export const create = async (ctx: Context, data: any): Promise<Comissariat> => {
  const comissariat = await ctx.prisma.comissariat.create({
    data,
  });
  return comissariat;
};

export const update = async (ctx: Context, id: number, data: any): Promise<Comissariat> => {
  const comissariat = await ctx.prisma.comissariat.update({
    where: { id },
    data,
  });
  return comissariat;
}

export const destory = async (ctx: Context, id: number): Promise<Comissariat> => {
  const comissariat = await ctx.prisma.comissariat.delete({
    where: { id },
  });
  return comissariat;
}
