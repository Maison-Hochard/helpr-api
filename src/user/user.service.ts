import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { User, ResetPassword } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { Response } from "express";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtPayload } from "../auth/auth.service";
import { encrypt, formatUser, generateCode } from "../utils";
import { UserForFrontend } from "../type";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserForFrontend> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });
    if (findUser) {
      throw new BadRequestException("user_already_exists");
    }
    const hashedPassword = await encrypt(createUserDto.password);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    const url = await this.createVerificationUrl(user, false);
    await this.mailingService.sendNewUser(user, url);
    return formatUser(user);
  }

  async createVerificationUrl(
    user: JwtPayload,
    isEmail: boolean,
  ): Promise<string> {
    const resetEntity: ResetPassword =
      await this.prisma.emailVerification.create({
        data: {
          userId: user.id,
          token: await generateCode(),
        },
      });
    const url = `${this.configService.get("frontend_url")}/verify-user-${
      resetEntity.token
    }`;
    if (isEmail) {
      await this.mailingService.sendNewVerification(user, url);
    }
    return url;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException("user_not_found");
    }
    return user;
  }

  async getUserByLogin(login: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });
  }

  async createSession(
    user: User,
    authToken: string,
    resetToken: string,
    response: Response,
  ) {
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        authToken,
      },
      include: {
        user: true,
      },
    });
    response.cookie("refreshToken", resetToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });
    await this.insertRefreshToken(user.id, resetToken);
    return session;
  }

  async deleteSession(response: Response, sessionId: string, userId: string) {
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (!session) throw new BadRequestException("session_not_found");
    response.clearCookie("resetToken");
    await this.prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
    await this.deleteRefreshToken(userId);
    return { message: "session deleted" };
  }

  async insertRefreshToken(userId: string, refreshToken: string) {
    const encryptedToken = await encrypt(refreshToken);
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: encryptedToken },
    });
  }

  async deleteRefreshToken(userId: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async verifyEmail(userId: string, token: string) {
    const emailVerification = await this.prisma.emailVerification.findFirst({
      where: {
        userId,
        token,
      },
    });
    if (!emailVerification) throw new BadRequestException("invalid_token");
    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
    await this.prisma.emailVerification.delete({
      where: { id: emailVerification.id },
    });
    return { message: "email_verified" };
  }

  async updatePassword(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("user_not_found");
    const hashedPassword = await encrypt(password);
    return await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("user_not_found");
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("user_not_found");
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: "user deleted" };
  }
}
