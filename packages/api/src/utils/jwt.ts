import jwt, { SignOptions } from "jsonwebtoken";
import customConfig from "../config/default";

export const signJwt = (
  payload: Object,
  key: "accessTokenKey" | "refreshTokenKey",
  options: SignOptions = {}
) => {
  const privateKey = customConfig[key];
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'HS256',
  });
};

export const verifyJwt = <T>(
  token: string,
  key: "accessTokenKey" | "refreshTokenKey"
): T | null => {
  try {
    const privateKey = customConfig[key];
    return jwt.verify(token, privateKey) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
};
