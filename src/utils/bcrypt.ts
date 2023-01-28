import * as bcrypt from "bcryptjs";

export const utils = {
  async encrypt(ToHash: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(ToHash, saltRounds);
  },

  async decrypt(ToDeHash: string, Hash: string): Promise<boolean> {
    return bcrypt.compare(ToDeHash, Hash);
  },

  async generateCode(): Promise<string> {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  },
};
