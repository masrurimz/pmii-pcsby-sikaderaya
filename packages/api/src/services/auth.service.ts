import { Context } from "../context";
import bcrypt from "bcrypt";
import { signJwt, verifyJwt } from "../utils/jwt";
import customConfig from "../config/default";

export const signIn = async (ctx: Context, email: string, password: string) => {
  const user = await ctx.prisma.user.findFirstOrThrow({
    where: { email: email },
  });
  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error("Invalid password");

  return generateToken(user.id);
};

export const refreshToken = async (ctx: Context, token: string) => {
  const jwt = verifyJwt<{ sub: number }>(token, "refreshTokenKey");
  if (!jwt) {
    throw new Error("Invalid refresh token");
  }
  const user = await ctx.prisma.user.findFirstOrThrow({
    where: { id: jwt.sub },
  });
  return generateToken(user.id);
};

const generateToken = (userId: number) => {
  const access_token = signJwt({ sub: userId }, "accessTokenKey", {
    expiresIn: customConfig.accessTokenExpiresIn + "m",
  });
  const refresh_token = signJwt({ sub: userId }, "refreshTokenKey", {
    expiresIn: customConfig.refreshTokenExpiresIn + "m",
  });

  return {
    access_token,
    refresh_token,
  };
};
