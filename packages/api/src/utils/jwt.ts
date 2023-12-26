import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/config";

export const signJwt = (
  payload: Object,
  type: "access" | "refresh",
  options: SignOptions = {}
) => {
  let privateKey: jwt.Secret;
  if (type === "access") {
    privateKey = config.jwt.accessSecret;
  } else {
    privateKey = config.jwt.refreshSecret;
  }
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "HS256",
  });
};

export const verifyJwt = <T>(
  token: string,
  type: "access" | "refresh"
): T | null => {
  try {
    let privateKey: jwt.Secret;
    if (type === "access") {
      privateKey = config.jwt.accessSecret;
    } else {
      privateKey = config.jwt.refreshSecret;
    }
    return jwt.verify(token, privateKey) as T;
  } catch (error) {
    return null;
  }
};
