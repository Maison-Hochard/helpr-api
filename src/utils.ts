import { User } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

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

export const hash = async (ToHash: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(ToHash, saltRounds);
};

export const compare = async (
  ToDeHash: string,
  Hash: string,
): Promise<boolean> => {
  return bcrypt.compare(ToDeHash, Hash);
};

export function encryptAES(plainText, secretKey) {
  return CryptoJS.AES.encrypt(plainText, secretKey).toString();
}

export function decryptAES(cipherText, secretKey) {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}