import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import argon2 from "argon2";

export const updatePassword = async (
  ctx: Context,
  oldPassword: string,
  newPassword: string
) => {
  const user = await ctx.prisma.user.findFirst({
    where: { id: ctx.user?.id },
  });
  if (!user)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

  const isOldPasswordValid = await argon2.verify(
    user.password ?? "",
    oldPassword
  );
  if (!isOldPasswordValid)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Old password is wrong",
    });

  const hashedPassword = await argon2.hash(newPassword);
  await ctx.prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};
