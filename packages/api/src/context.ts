import { prisma, User } from "@my/db";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

// Create a single supabase client for interacting with your user/db

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type IUserProps = {
  user: User | null;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async (
  { user }: IUserProps,
  storage: StorageInterface
) => {
  return {
    user,
    prisma,
    storage,
  };
};

import { verifyJwt } from "./utils/jwt";
import { SupabaseStorage } from "./storage/supabase.storage";
import { StorageInterface } from "./storage/storage.interface";

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;

  async function getUserFromHeader() {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return null;

    const jwt = verifyJwt<{ sub: number }>(token, "access");
    if (!jwt) return null;

    const user = await prisma.user.findFirst({
      where: { id: jwt.sub },
    });
    return user;
  }

  const user = await getUserFromHeader();
  const storage = new SupabaseStorage();

  return await createContextInner({ user }, storage);
};

export type Context = inferAsyncReturnType<typeof createContext>;
