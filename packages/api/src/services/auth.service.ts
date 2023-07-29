import { Context } from "../context";
import argon2 from "argon2";
import { signJwt, verifyJwt } from "../utils/jwt";
import { config } from "../config/config";

export const signIn = async (ctx: Context, email: string, password: string) => {
  const user = await ctx.prisma.user.findFirstOrThrow({
    where: { email: email },
  });
  if (!user.password) throw new Error("Invalid password");

  const isValidPassword = await argon2.verify(user.password, password)
  if (!isValidPassword) throw new Error("Invalid password");

  return generateToken(user.id);
};

export const refreshToken = async (ctx: Context, token: string) => {
  const jwt = verifyJwt<{ sub: number }>(token, "refresh");
  if (!jwt) {
    throw new Error("Invalid refresh token");
  }
  const user = await ctx.prisma.user.findFirstOrThrow({
    where: { id: jwt.sub },
  });
  return generateToken(user.id);
};

const generateToken = (userId: number) => {
  const access_token = signJwt({ sub: userId }, "access", {
    expiresIn: config.JWT.accessExpiresIn + "m",
  });
  const refresh_token = signJwt({ sub: userId }, "refresh", {
    expiresIn: config.JWT.accessExpiresIn + "m",
  });

  return {
    access_token,
    refresh_token,
  };
};
