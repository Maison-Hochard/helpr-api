import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { MailingService } from "../mailing/mailing.service";
import { utils } from "../utils/bcrypt";
import { ConfigService } from "@nestjs/config";
import { User, ResetPassword, Session } from "@prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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
    const hashedPassword = await utils.encrypt(createUserDto.password);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    const url = await this.createVerificationUrl(user, false);
    await this.mailingService.sendNewUser(user, url);
    return user;
  }

  async createVerificationUrl(user: User, isEmail: boolean): Promise<string> {
    const resetEntity: ResetPassword =
      await this.prisma.emailVerification.create({
        data: {
          userId: user.id,
          token: await utils.generateCode(),
        },
      });
    const url = `${this.configService.get("app.url")}/verify-user-${
      resetEntity.token
    }`;
    if (isEmail) {
      await this.mailingService.sendNewVerification(user, url);
    }
    return url;
  }

  async getUserById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByLogin(login: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });
  }

  async createSession(user: User, authToken: string): Promise<Session> {
    return await this.prisma.session.create({
      data: {
        userId: user.id,
        authToken,
      },
      select: {
        id: true,
        userId: true,
        authToken: true,
        user: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  /*async create(createUserDto: CreateUserDto) {
    const findUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    if (findUser) {
      throw new BadRequestException("user_already_exists");
    }
    const hashedPassword = await utils.encrypt(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    const url = await this.createVerificationUrl(user.id, false);
    await this.mailingService.sendNewUser(user, url);
    return user;
  }

  async insertRefreshToken(id: number, refreshToken: string) {
    const userToInsert = await this.userRepository.findOne({ where: { id } });
    userToInsert.refreshToken = await utils.encrypt(refreshToken);
    await this.userRepository.save(userToInsert);
  }

  async removeRefreshToken(id: number) {
    return await this.userRepository.update(id, { refreshToken: null });
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException("user_not_found");
    return user;
  }

  async getUserByLogin(login: string) {
    return this.userRepository.findOne({
      where: [{ username: login }, { email: login }],
    });
  }

  async getAllUsers() {
    return {
      status: "success",
      message: "users_found",
      content: await this.userRepository.find(),
    };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException("user_not_found");
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return {
      status: "success",
      message: "user_updated",
      content: { user: updatedUser },
    };
  }

  async updatePassword(id: number, password: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.password = password;
    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException("user_not_found");
    await this.userRepository.delete(id);
    return { message: "user_deleted" };
  }

  async createVerificationUrl(id: number, sendMail: boolean) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    const verif_code = new VerifCode();
    verif_code.email = user.email;
    verif_code.code = Math.floor(100000 + Math.random() * 900000).toString();
    const verifCode = this.verifCodeRepository.create(verif_code);
    await this.verifCodeRepository.save(verifCode);
    const verifyUrl = `${this.configService.get(
      "frontend_url",
    )}/app/confirm-account-${verifCode.code}`;
    if (sendMail) {
      await this.mailingService.sendNewVerification(user, verifyUrl);
    }
    return verifyUrl;
  }

  async verifyEmail(id: number, code: string) {
    const userToVerify = await this.userRepository.findOne({ where: { id } });
    const verifCode = await this.verifCodeRepository.findOne({
      where: { code: code, email: userToVerify.email },
    });
    if (verifCode && verifCode.code === code) {
      userToVerify.isVerified = true;
      await this.userRepository.save(userToVerify);
      await this.verifCodeRepository.delete({ email: userToVerify.email });
      return {
        message: "email_verified",
      };
    } else {
      throw new BadRequestException("invalid_code");
    }
  }*/
}
