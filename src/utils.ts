import { User } from "@prisma/client";
import * as bcrypt from "bcryptjs";

export const formatUser = (user: User): User => {
  delete user.password;
  delete user.refreshToken;
  return user;
};

export const generateCode = async (): Promise<string> => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const encrypt = async (ToHash: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(ToHash, saltRounds);
};

export const decrypt = async (
  ToDeHash: string,
  Hash: string,
): Promise<boolean> => {
  return bcrypt.compare(ToDeHash, Hash);
};
