import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { PrismaService } from "../../prisma.service";
import { MailingService } from "../../mailing/mailing.service";
import { BadRequestException } from "@nestjs/common";

describe("UserService", () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let mailingService: MailingService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService, MailingService, ConfigService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    mailingService = module.get<MailingService>(MailingService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("create", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should create a new user", async () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException if user already exists", async () => {});
  });

  describe("getUserById", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return user by id", async () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException if user not found", async () => {});
  });

  describe("getUserByLogin", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return user by login", async () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException if user not found", async () => {});
  });

  describe("createSession", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should create a new session", async () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException if user not found", async () => {});
  });

  describe("deleteRefreshToken", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should delete refresh token", async () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException if user not found", async () => {});
  });

  describe("getAllUsers", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an array of users", async () => {});
  });

  describe("verifyEmail", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should verify user email", async () => {});
  });

  describe("updateUser", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an updated user", async () => {});
  });

  describe("deleteUser", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an deleted user", async () => {});
  });
});
