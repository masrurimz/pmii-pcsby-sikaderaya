import { Prisma } from "@my/db/index";
import { Context } from "../context";
import {
  Admin,
  CreateAdminInput,
  FilterAdminInput,
  UpdateAdminInput,
} from "../schema/admin.schema";
import { TRPCError } from "@trpc/server";
import argon2 from "argon2";

const baseQuery = Prisma.sql`
  SELECT
    u.id, u.name, u.email, u.created_at, u.updated_at, ur.role, ur.role_detail,
    (
      CASE ur.role
        WHEN 'admin_comissariat' THEN (SELECT name FROM comissariats WHERE id = role_detail)
        WHEN 'admin_rayon' THEN (SELECT name FROM rayons WHERE id = role_detail)
        ELSE NULL
      END
    ) AS role_detail_name
  FROM users u
  INNER JOIN user_roles ur ON ur.user_id = u.id AND ur.role != 'member'
`;

export const getAll = async (ctx: Context, filter: FilterAdminInput) => {
  const { limit, cursor, role } = filter;
  const sql = Prisma.sql`
    ${baseQuery}
    WHERE 1 = 1
    ${
      role
        ? Prisma.sql`AND ur.role = ${role.toLowerCase()}::role`
        : Prisma.empty
    }
    ${cursor ? Prisma.sql`AND u.id > ${cursor}` : Prisma.empty}
    ORDER BY u.id ASC
    LIMIT ${limit + 1}
  `;
  let items = await ctx.prisma
    .$queryRaw<any[]>(sql)
    .then((items2) => items2.map((item) => parseToAdmin(item)));
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
  const items = await ctx.prisma
    .$queryRaw<any[]>(Prisma.sql`${baseQuery} WHERE u.id = ${id}`)
    .then((items) => items.map((item) => parseToAdmin(item)));
  const item = items[0];
  if (!item)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Admin not found",
    });
  return item;
};

const parseToAdmin = (item: any): Admin => {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.role.toUpperCase(),
    roleDetail: item.role_detail,
    roleDetailName: item.role_detail_name,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

export const create = async (ctx: Context, data: CreateAdminInput) => {
  await validateRoleDetail(ctx, data.role, data.roleDetail);
  const { name, email } = data;
  const user = await ctx.prisma.user.findFirst({
    where: { email },
    include: { roles: true },
  });
  const payload = {
    email,
    name,
    password: "",
    roles: {
      create: {
        role: data.role,
        roleDetail: data.roleDetail,
      },
    },
  };
  if (data.password) {
    const hashedPassword = await argon2.hash(data.password);
    payload.password = hashedPassword;
  }
  let userId = 0;
  if (user) {
    const hasRoleMember = user.roles.find((role) => role.role === "MEMBER");
    if (!hasRoleMember)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User already has role",
      });

    userId = user.id;
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: payload,
    });
  } else {
    const admin = await ctx.prisma.user.create({
      data: payload,
    });
    userId = admin.id;
  }
  return getById(ctx, userId);
};

export const update = async (ctx: Context, data: UpdateAdminInput) => {
  const { id } = data;
  const before = await ctx.prisma.user.findFirst({
    where: { id, roles: { some: { role: { not: "MEMBER" } } } },
  });
  if (!before)
    throw new TRPCError({ code: "NOT_FOUND", message: "Admin not found" });

  await validateRoleDetail(ctx, data.role, data.roleDetail);

  const admin = await ctx.prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      roles: {
        deleteMany: {
          role: { not: "MEMBER" },
        },
        create: {
          role: data.role,
          roleDetail: data.roleDetail,
        },
      },
    },
  });
  if (data.password) {
    const hashedPassword = await argon2.hash(data.password);
    await ctx.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }
  return getById(ctx, admin.id);
};

const validateRoleDetail = async (
  ctx: Context,
  role: string,
  roleDetail: number | undefined
) => {
  if (role == "ADMIN_COMISSARIAT") {
    const comissariat = await ctx.prisma.comissariat.findFirst({
      where: { id: roleDetail },
    });
    if (!comissariat)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Comissariat not found",
      });
  } else if (role == "ADMIN_RAYON") {
    const rayon = await ctx.prisma.rayon.findFirst({
      where: { id: roleDetail },
    });
    if (!rayon)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Rayon not found",
      });
  }
};

export const destroy = async (ctx: Context, id: number) => {
  const admin = await ctx.prisma.user.findFirst({
    where: { id, roles: { some: { role: { not: "MEMBER" } } } },
    include: { roles: true },
  });
  if (!admin)
    throw new TRPCError({ code: "NOT_FOUND", message: "Admin not found" });

  const hasRoleMember = admin.roles.find((role) => role.role === "MEMBER");
  if (hasRoleMember) {
    await ctx.prisma.userRole.deleteMany({
      where: { userId: id, role: { not: "MEMBER" } },
    });
  } else {
    await ctx.prisma.userRole.deleteMany({
      where: { userId: id },
    });
    await ctx.prisma.user.delete({
      where: { id },
    });
  }
  return true;
};
