import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/config";

export const signJwt = (
  payload: Object,
  type: "access" | "refresh",
  options: SignOptions = {}
) => {
  var privateKey: jwt.Secret;
  if (type === "access") {
    privateKey = config.JWT.accessSecret;
  } else {
    privateKey = config.JWT.refreshSecret;
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
    var privateKey: jwt.Secret;
    if (type === "access") {
      privateKey = config.JWT.accessSecret;
    } else {
      privateKey = config.JWT.refreshSecret;
    }
    return jwt.verify(token, privateKey) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
};
