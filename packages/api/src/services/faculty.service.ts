import { Context } from "../context";
import {
  CreateFacultyInput,
  FilterFacultyInput,
  UpdateFacultyInput,
} from "../schema/faculty.schema";
import { TRPCError } from "@trpc/server";

export const getAll = async (ctx: Context, filter: FilterFacultyInput) => {
  const { limit, cursor, universityId } = filter;
  let condition = {};
  if (universityId) condition = { ...condition, universityId };

  let items = await ctx.prisma.faculty.findMany({
    take: limit + 1,
    where: condition,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: "asc" },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem?.id;
  }

  return {
    items,
    nextCursor,
  };
};

export const getById = async (ctx: Context, id: number) => {
  const item = await ctx.prisma.faculty.findFirst({
    where: { id },
  });
  if (!item)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Faculty not found",
    });

  return item;
};

export const create = async (ctx: Context, data: CreateFacultyInput) => {
  const faculty = await ctx.prisma.faculty.create({
    data,
  });
  return faculty;
};

export const update = async (ctx: Context, data: UpdateFacultyInput) => {
  const { id, ...payload } = data;
  const before = await ctx.prisma.faculty.findFirst({
    where: { id },
  });
  if (!before)
    throw new TRPCError({ code: "NOT_FOUND", message: "Faculty not found" });

  const faculty = await ctx.prisma.faculty.update({
    where: { id },
    data: payload,
  });
  return faculty;
};

export const destroy = async (ctx: Context, id: number) => {
  const before = await ctx.prisma.faculty.findFirst({
    where: { id },
  });
  if (!before)
    throw new TRPCError({ code: "NOT_FOUND", message: "Faculty not found" });

  const item = await ctx.prisma.faculty.delete({
    where: { id },
  });
  return item;
};
