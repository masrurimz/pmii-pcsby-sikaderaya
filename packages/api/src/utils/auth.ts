import { Prisma, prisma } from "@my/db/index";
import { verifyJwt } from "./jwt";
import { User } from "../schema/user.schema";

export const getUserFromToken = async (token: string): Promise<User | null> => {
  const jwt = verifyJwt<{ sub: number }>(token, "access");
  if (!jwt) return null;

  const user = await prisma.user.findFirst({
    where: { id: jwt.sub },
  });
  if (!user) return null;
  const roles = await prisma
    .$queryRaw<any[]>(
      Prisma.sql`
        SELECT role, role_detail, (CASE role
          WHEN 'admin_comissariat' THEN (SELECT name FROM comissariats WHERE id = role_detail)
          WHEN 'admin_rayon' THEN (SELECT name FROM rayons WHERE id = role_detail)
          ELSE NULL
        END) AS role_detail_name
        FROM user_roles
        WHERE user_id = ${user.id}`
    )
    .then((items) =>
      items.map((item) => {
        return {
          role: item.role.toUpperCase(),
          roleDetail: item.role_detail,
          roleDetailName: item.role_detail_name,
        };
      })
    );
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles,
  };
};
