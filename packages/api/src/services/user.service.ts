import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import argon2 from "argon2";
import crypto from "crypto";
import dayjs from "dayjs";
import { sendInvitationMail } from "./mail.service";

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

export const inviteUser = async (ctx: Context, id: number) => {
  const user = await ctx.prisma.user.findFirst({
    where: { id },
  });
  if (!user) return false;
  const email = user.email;
  if (!email) return false;

  const token = crypto.randomBytes(32).toString("hex");
  const expiredAt = dayjs().add(10, "minute").toDate();
  await ctx.prisma.passwordResetToken.upsert({
    where: { email },
    create: {
      email,
      token,
      expiredAt: expiredAt,
    },
    update: {
      token,
      expiredAt: expiredAt,
    },
  });
  await sendInvitationMail(email, token);
  return true;
};
