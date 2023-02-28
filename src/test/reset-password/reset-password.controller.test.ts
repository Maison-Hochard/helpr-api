import { Test, TestingModule } from "@nestjs/testing";
import { ResetPasswordController } from "../../reset-password/reset-password.controller";
import { ResetPasswordService } from "../../reset-password/reset-password.service";
import { MailingService } from "../../mailing/mailing.service";
import { UserService } from "../../user/user.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma.service";
import { BadRequestException } from "@nestjs/common";
import { hash } from "../../utils";

describe("ResetPasswordController", () => {
  let controller: ResetPasswordController;
  let resetPasswordService: ResetPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordController],
      providers: [
        ResetPasswordService,
        MailingService,
        UserService,
        ConfigService,
        PrismaService,
      ],
    }).compile();

    resetPasswordService =
      module.get<ResetPasswordService>(ResetPasswordService);
    controller = module.get<ResetPasswordController>(ResetPasswordController);
  });

  describe("forgotPassword", () => {
    it("should return reset_password_email_sent message on valid email", async () => {
      const email = "test@test.com";
      jest.spyOn(resetPasswordService, "createResetToken").mockResolvedValue({
        message: "reset_password_email_sent",
      });
      expect(await controller.forgotPassword(email)).toEqual({
        message: "reset_password_email_sent",
      });
    });

    it("should throw BadRequestException on invalid email", async () => {
      const email = "invalid@test.com";
      jest
        .spyOn(resetPasswordService, "createResetToken")
        .mockRejectedValue(new BadRequestException("user_not_found"));
      await expect(controller.forgotPassword(email)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("resetPassword", () => {
    it("should return password_reset_success message on valid token and password", async () => {
      const token = "valid-token";
      const password = "new-password";
      jest.spyOn(resetPasswordService, "resetPassword").mockResolvedValue({
        message: "password_reset_success",
      });
      expect(await controller.resetPassword(password, token)).toEqual({
        message: "password_reset_success",
      });
    });

    it("should throw BadRequestException on invalid token", async () => {
      const token = "invalid-token";
      const password = "new-password";
      jest
        .spyOn(resetPasswordService, "resetPassword")
        .mockRejectedValue(new BadRequestException("invalid_token"));
      await expect(controller.resetPassword(password, token)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
