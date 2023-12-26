import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import crypto from "crypto";
import dayjs from "dayjs";
import { config } from "../config/config";
import { Context } from "../context";
import { signJwt, verifyJwt } from "../utils/jwt";
import { sendResetPasswordMail } from "./mail.service";

export const signIn = async (ctx: Context, email: string, password: string) => {
  const user = await ctx.prisma.user.findFirst({
    where: { email: email },
  });
  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  if (!user.password)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User has no password",
    });

  const isValidPassword = await argon2.verify(user.password, password);
  if (!isValidPassword)
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid password" });

  return generateJWTToken(user.id);
};

export const refreshToken = async (ctx: Context, token: string) => {
  const jwt = verifyJwt<{ sub: number }>(token, "refresh");
  if (!jwt)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });

  const user = await ctx.prisma.user.findFirst({
    where: { id: jwt.sub },
  });
  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });

  return generateJWTToken(user.id);
};

const generateJWTToken = (userId: number) => {
  const accessToken = signJwt({ sub: userId }, "access", {
    expiresIn: config.jwt.accessExpiresIn + "m",
  });
  const refreshToken = signJwt({ sub: userId }, "refresh", {
    expiresIn: config.jwt.accessExpiresIn + "m",
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const forgotPassword = async (ctx: Context, email: string) => {
  const user = await ctx.prisma.user.findFirst({
    where: { email },
  });
  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });

  const token = crypto.randomBytes(32).toString("hex");
  const expiredAt = dayjs().add(10, "minute").toDate();
  await ctx.prisma.passwordResetToken.upsert({
    where: { email: email },
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
  await sendResetPasswordMail(email, token);
  return true;
};

export const resetPassword = async (
  ctx: Context,
  token: string,
  password: string
) => {
  const passwordResetToken = await ctx.prisma.passwordResetToken.findFirst({
    where: { token },
  });
  if (!passwordResetToken)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Token not found",
    });

  if (dayjs().isAfter(dayjs(passwordResetToken.expiredAt)))
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Token expired",
    });

  const hashedPassword = await argon2.hash(password);
  await ctx.prisma.user.update({
    where: { email: passwordResetToken.email },
    data: {
      password: hashedPassword,
    },
  });
  await ctx.prisma.passwordResetToken.delete({
    where: { token },
  });
  return true;
};
