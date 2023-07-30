import { Context } from "../context";
import argon2 from "argon2";
import { signJwt, verifyJwt } from "../utils/jwt";
import { config } from "../config/config";
import { TRPCError } from "@trpc/server";

export const signIn = async (ctx: Context, email: string, password: string) => {
  const user = await ctx.prisma.user.findFirstOrThrow({
    where: { email: email },
  });
  if (!user.password)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User has no password",
    });

  const isValidPassword = await argon2.verify(user.password, password);
  if (!isValidPassword)
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid password" });

  return generateToken(user.id);
};

export const refreshToken = async (ctx: Context, token: string) => {
  const jwt = verifyJwt<{ sub: number }>(token, "refresh");
  if (!jwt) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
  }
  const user = await ctx.prisma.user.findFirstOrThrow({
    where: { id: jwt.sub },
  });
  return generateToken(user.id);
};

const generateToken = (userId: number) => {
  const accessToken = signJwt({ sub: userId }, "access", {
    expiresIn: config.JWT.accessExpiresIn + "m",
  });
  const refreshToken = signJwt({ sub: userId }, "refresh", {
    expiresIn: config.JWT.accessExpiresIn + "m",
  });

  return {
    accessToken,
    refreshToken,
  };
};
