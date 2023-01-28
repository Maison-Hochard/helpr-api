import { User } from "@prisma/client";

export type UserForFrontend = Omit<User, "password" | "refreshToken">;
