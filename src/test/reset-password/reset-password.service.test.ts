import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { MailingService } from "../../mailing/mailing.service";
import { UserService } from "../../user/user.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma.service";
import { ResetPasswordService } from "../../reset-password/reset-password.service";
import { generateCode, hash } from "../../utils";
import { ResetPassword } from "@prisma/client";

describe("ResetPasswordService", () => {
  let resetPasswordService: ResetPasswordService;
  let prismaService: PrismaService;
  let userService: UserService;
  let mailingService: MailingService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordService,
        {
          provide: PrismaService,
          useValue: {
            resetPassword: {
              create: jest.fn(),
              findFirst: jest.fn(),
              delete: jest.fn(),
            },
            user: { update: jest.fn() },
          },
        },
        {
          provide: UserService,
          useValue: { getUserByLogin: jest.fn() },
        },
        {
          provide: MailingService,
          useValue: { sendResetPassword: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    resetPasswordService =
      moduleRef.get<ResetPasswordService>(ResetPasswordService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
    mailingService = moduleRef.get<MailingService>(MailingService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe("createResetToken", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should create reset token and send email", async () => {});
  });

  describe("resetPassword", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when invalid token", async () => {});
  });
});
