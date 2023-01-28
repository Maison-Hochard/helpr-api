import { UserForFrontend } from "../type";
import { User } from "@prisma/client";

export const formatUser = (user: User): UserForFrontend => {
  delete user.password;
  delete user.refreshToken;
  return user;
};
